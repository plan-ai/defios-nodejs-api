import { IPullRequestUnstaked } from '../events'
import { Issues } from '../models/issues'
import { Contribution, User } from '../models/users'

export const pullRequestUnstaked = async (res: IPullRequestUnstaked) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({
                user_phantom_address: res.pr_staker.toString(),
            })
            if (!user) {
                reject('User not found')
                return
            }
            const issue = await Issues.findOne({
                'issue_prs.issue_pr_account': res.pr_account,
            })
            if (!issue) {
                reject('issue not found')
                return
            }
            const updatedPR = issue.issue_prs.map((item) => {
                if (
                    item.issue_pr_account.toString() !==
                    res.pr_account.toString()
                ) {
                    return item
                } else {
                    item.issue_vote_amount =
                        parseInt(item.issue_vote_amount.toString()) -
                        parseInt(res.staked_amount.toString())
                    return item
                }
            })
            issue.issue_prs = updatedPR
            issue.save()
            const contribution = new Contribution({
                contributor_github: user.user_github,
                contribution_link: res.pr_contribution_link,
                contribution_timestamp: new Date(),
                contribution_amt: res.staked_amount.toString(),
                contribution_token_symbol: issue.issue_stake_token_symbol,
                contribution_token_url: issue.issue_stake_token_url,
                contribution_type: 'inbound',
            })
            user.user_contributions.push(contribution)
            user.save()
            resolve('Staked on PR Successfully')
        } catch (err) {
            reject(err)
        }
    })
}
