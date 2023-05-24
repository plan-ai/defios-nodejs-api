import { ICommitAdded } from '../events'
import { IIssuePRs, Issues, IIssue } from '../models/issues'

export const commitCreated = async (commit: ICommitAdded) => {
    return new Promise(async (resolve, reject) => {
        try {
            const issue = await Issues.findOne({
                issue_account: commit.issue_account.toString(),
            })
            if (!issue) {
                reject('Issue not found')
                return
            } else {
                resolve('Commit Created')
            }
        } catch (err) {
            reject(err)
        }
    })
}
