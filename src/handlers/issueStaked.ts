import { IIssueStaked } from '../events'
import { Issues } from '../models/issues'
import { User } from '../models/users'
import { Project } from '../models/project'

export const issueStaked = async (res: IIssueStaked) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user: any = await User.findOne({
                user_phantom_address: res.issueStaker.toString(),
            })
            if (!user) {
                reject('User not found')
                return
            }
            let issue: any
            let tries = 6
            while (tries > 0 && !issue) {
                issue = await Issues.findOne({
                    issue_account: res.issueAccount.toString(),
                })
                setTimeout(() => {
                    tries--
                }, 1000)
            }

            if (!issue) {
                reject('issue not found')
                return
            }
            const project: any = await Project.findOne({
                project_account: issue.issue_project_id,
            })
            if (!project) {
                reject('project not found')
                return
            }
            issue.issue_stake_amount =
                parseFloat(res.stakedAmount) +
                parseFloat(issue.issue_stake_amount)
            await issue.save()
            if (project.coins_staked) {
                project.coins_staked =
                    parseFloat(project.coins_staked) +
                    parseFloat(res.stakedAmount)
            } else {
                project.coins_staked = parseFloat(res.stakedAmount)
            }
            await project.save()
            user.user_contributions.push({
                contributor_github: user.user_github,
                contribution_link: res.issueContributionLink,
                contribution_timestamp: new Date(),
                contribution_amt: parseFloat(res.stakedAmount),
                contribution_token_symbol: issue.issue_stake_token_symbol,
                contribution_token_url: issue.issue_stake_token_url,
                contribution_type: 'outbound',
                contributor_project_id: issue.issue_project_id,
                contributor_project_name: issue.issue_project_name,
            })
            await user.save()
            resolve('Staked Successfully')
        } catch (err) {
            reject(err)
        }
    })
}
