import { IPullRequestSent } from '../events'
import { IIssuePRs, Issues, IIssue } from '../models/issues'
import axios from 'axios'
const config = require('config')

const token = process.env.GH_TOKEN as string
const github_token = config.github.api_key

export const pullRequestSent = async (res: IPullRequestSent) => {
    return new Promise(async (resolve, reject) => {
        try {
            const issue = await Issues.findOne({
                issue_account: res.issue.toString(),
            })
            var config = {
                method: 'get',
                url: res.metadataUri
                    .replace(
                        'https://github.com/',
                        'https://api.github.com/repos/'
                    )
                    .replace('/pull/', '/pulls/'),
                headers: {
                    Authorization: 'Bearer ' + github_token,
                    'Content-Type': 'application/json',
                },
            }
            axios(config)
                .then((data) => {
                    if (issue) {
                        issue.issue_prs.push({
                            issue_pr_account: res.pullRequest.toString(),
                            issue_pr_author: res.sentBy.toString(),
                            issue_pr_link: res.metadataUri.toString(),
                            issue_originality_score: 0,
                            issue_author_github:
                                issue.issue_creator_gh.toString(),
                            issue_pr_title: data.data.title.toString(),
                            issue_vote_amount: 0,
                            issue_pr_github: data.data.user.id.toString(),
                        })
                        issue.save()
                        resolve(issue)
                    }
                })
                .catch((err) => reject(err))
        } catch (err) {
            reject(err)
        }
    })
}
