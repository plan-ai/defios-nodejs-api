import { IPullRequestAccepted } from '../events'
import { IIssuePRs, Issues, IIssue } from '../models/issues'
import { Project } from '../models/project'
import { User } from '../models/users'

export const pullRequestAccepted = async (res: IPullRequestAccepted) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({
                user_phantom_address: res.pull_request_addr.toString(),
            })
            if (!user) {
                reject('User not found')
                return
            }
            const repository = await Project.findOne({
                project_account: res.repository.toString(),
            })
            if (!repository) {
                reject('Repository not found')
                return
            }
            const issue = await Issues.findOne({
                issue_account: res.issue.toString(),
            })
            if (!issue) {
                reject('Issue not found')
                return
            }
            if (issue.issue_project_id.toString() !== res.issue.toString()) {
                reject('Issue does not belong to the Repository')
                return
            }
            if (issue) {
                issue.updateOne({
                    issue_state: 'closed',
                    rewardee: res.pull_request_addr,
                })
                issue.save()
                resolve('Pull Request Accepted/Merged Successfully')
            }
        } catch (err) {
            reject(err)
        }
    })
}
