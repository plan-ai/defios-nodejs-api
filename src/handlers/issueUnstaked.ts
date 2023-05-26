import { IIssueUnstaked } from '../events'
import { Issues } from '../models/issues'
import { Contribution, User } from '../models/users'

export const issueUnstaked = async (res: IIssueUnstaked) => {
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
            issue.updateOne({
                issue_stake_amount:
                    parseInt(issue.issue_stake_amount.toString()) -
                    parseInt(res.unstakedAmount.toString()),
            })
            issue.save()
            const contribution = new Contribution({
                contributor_github: user.user_github,
                contribution_link: res.issueContributionLink,
                contribution_timestamp: new Date(),
                contribution_amt: res.unstakedAmount.toString(),
                contribution_token_symbol: issue.issue_stake_token_symbol,
                contribution_token_url: issue.issue_stake_token_url,
                contribution_type: 'inbound',
            })
            user.user_contributions.push(contribution)
            user.save()
            resolve('Unstaked Successfully')
        } catch (err) {
            reject(err)
        }
    })
}
