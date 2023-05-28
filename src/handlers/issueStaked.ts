import { IIssueStaked } from '../events'
import { Issues } from '../models/issues'
import { User } from '../models/users'

export const issueStaked = async (res: IIssueStaked) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({
                user_phantom_address: res.issueStaker.toString(),
            })
            if (!user) {
                reject('User not found')
                return
            }
            const issue = await Issues.findOne({
                issue_account: res.issueAccount.toString(),
            })
            if (!issue) {
                reject('issue not found')
                return
            }
            issue.issue_stake_amount =
                res.stakedAmount.toNumber() + issue.issue_stake_amount
            issue.save()
            user.user_contributions.push({
                contributor_github: user.user_github,
                contribution_link: res.issueContributionLink,
                contribution_timestamp: new Date(),
                contribution_amt: res.stakedAmount.toNumber(),
                contribution_token_symbol: issue.issue_stake_token_symbol,
                contribution_token_url: issue.issue_stake_token_url,
                contribution_type: 'outbound',
                contributor_project_id: issue.issue_project_id,
                contributor_project_name: issue.issue_project_name,
            })
            user.save()
            resolve('Staked Successfully')
        } catch (err) {
            reject(err)
        }
    })
}
