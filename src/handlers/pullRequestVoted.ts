import { IPRVoted } from '../events'
import { Issues } from '../models/issues'
import { User } from '../models/users'

export const pullRequestVoted = async (res: IPRVoted) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user: any = await User.findOne({
                user_phantom_address: res.voter.toString(),
            })
            if (!user) {
                reject('User not found')
                return
            }
            const issue: any = await Issues.findOne({
                'issue_prs.issue_pr_account': res.pullRequest.toString(),
            })
            if (!issue) {
                reject('issue not found')
                return
            }
            const updatedPR = issue.issue_prs.map((item: any) => {
                if (
                    item.issue_pr_account.toString() !==
                    res.pullRequest.toString()
                ) {
                    return item
                } else {
                    item.issue_vote_amount =
                        parseInt(res.voteAmount.toString()) +
                        item.issue_vote_amount
                    item.issue_pr_voters.push(user.user_phantom_address)
                    return item
                }
            })
            issue.issue_prs = updatedPR
            issue.save()
            resolve('Voted on PR Successfully')
        } catch (err) {
            reject(err)
        }
    })
}
