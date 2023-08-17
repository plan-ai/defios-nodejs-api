import { IPullRequestAccepted } from '../events'
import { IIssuePRs, Issues, IIssue } from '../models/issues'
import { Project } from '../models/project'
import { User } from '../models/users'

export const pullRequestAccepted = async (res: IPullRequestAccepted) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(res.pullRequestAddr.toString())
            const user = await User.findOne({
                user_phantom_address: res.pullRequestAddr.toString(),
            })
            if (!user) {
                reject('User not found')
                return
            }
            const repository: any = await Project.findOne({
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
            if (
                issue.issue_project_id.toString() !== res.repository.toString()
            ) {
                reject('Issue does not belong to the Repository')
                return
            }
            const prAccepted: any = issue.issue_prs.filter((item: any) => {
                return item.issue_pr_account === res.pullRequestAddr.toString()
            })
            if (issue) {
                issue.issue_state = 'closed'
                issue.rewardee = res.pullRequestAddr.toString()
                issue.save()
                repository.num_open_issues -= 1
                repository.coins_rewarded +=
                    issue.issue_stake_amount + prAccepted[0].issue_vote_amount
                repository.save()
                resolve('Pull Request Accepted/Merged Successfully')
            }
        } catch (err) {
            reject(err)
        }
    })
}
