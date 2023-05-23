import { ICommitAdded } from '../events'
import { IIssuePRs, Issues, IIssue } from '../models/issues'

export const commitCreated = async (commit: ICommitAdded) => {
    return new Promise(async (resolve, reject) => {
        try {
            const issue = await Issues.findOne({
                issue_account: commit.issue_account.toString(),
            })
            if (issue) {
                issue.updateOne({
                    issue_prs: issue.issue_prs.concat({
                        issue_pr_account: commit.commit_account.toString(),
                        issue_pr_author: commit.commit_creator.toString(),
                        issue_pr_link: commit.metadata_uri.toString(),
                        issue_originality_score: 0,
                        issue_author_github: issue.issue_creator_gh.toString(),
                        issue_title: issue.issue_title.toString(),
                        issue_vote_amount: 0,
                    }),
                })
                issue.save()
                resolve(issue)
            }
        } catch (err) {
            reject(err)
        }
    })
}
