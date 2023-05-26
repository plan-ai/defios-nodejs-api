import { IPullRequestSent } from '../events'
import { IIssuePRs, Issues, IIssue } from '../models/issues'

export const pullRequestSent = async (res: IPullRequestSent) => {
    return new Promise(async (resolve, reject) => {
        try {
            const issue = await Issues.findOne({
                issue_account: res.issue.toString(),
            })
            if (issue) {
                issue.issue_prs.push({
                    issue_pr_account: res.pullRequest.toString(),
                    issue_pr_author: res.sentBy.toString(),
                    issue_pr_link: res.metadataUri.toString(),
                    issue_originality_score: 0,
                    issue_author_github: issue.issue_creator_gh.toString(),
                    issue_title: issue.issue_title.toString(),
                    issue_vote_amount: 0,
                })
                issue.save()
                resolve(issue)
            }
        } catch (err) {
            reject(err)
        }
    })
}
