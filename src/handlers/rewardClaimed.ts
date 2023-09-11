import { IRewardClaimed } from '../events'
import { Issues } from '../models/issues'

export const rewardClaimed = async (res: IRewardClaimed) => {
    return new Promise(async (resolve, reject) => {
        const issue: any = await Issues.findOne({
            'issue_prs.issue_pr_account': res.pullRequest.toString(),
        })
        if (!issue) {
            reject('issue not found')
            return
        }
        issue.reward_claimed = true
        issue.save()
        resolve('Reward Claimed in issue')
    })
}
