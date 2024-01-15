import { IIssueStaked } from '../events'
import { Issues } from '../models/issues'
import { User } from '../models/users'
import { Project } from '../models/project'
import { Token } from '../models/token'

export const issueStaked = async (res: IIssueStaked) => {
    return new Promise(async (resolve, reject) => {
        try {
            const dateTime = new Date()

            const formatDate = new Intl.DateTimeFormat('en-US', {
                day: 'numeric',
                month: 'short',
                year: '2-digit',
            }).format(dateTime);

            const user: any = await User.findOne({
                user_phantom_address: res.issueStaker.toString(),
            })
            if (!user) {
                reject('User not found')
                return
            }
            let issue: any
            let token: any
            let tries = 20
            while (tries > 0 && !issue) {
                issue = await Issues.findOne({
                    issue_account: res.issueAccount.toString(),
                })
                setTimeout(() => {
                    tries--
                }, 1000)
            }

            let tokenTries = 20
            while (tokenTries > 0 && !token) {
                if (issue && issue.issue_token) {
                    token = await Token.findById(issue.issue_token)
                }
                setTimeout(() => {
                    tokenTries--
                }, 1000)
            }

            if (!issue) {
                reject('issue not found')
                return
            }
            if (!token) {
                reject('token not found')
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
                parseFloat(issue.issue_stake_amount) +
                (parseFloat(res.stakedAmount)/10**token.token_decimals)
            
            let found = false;

            issue.issue_stakers.forEach((staker: any) => {
                if (staker.issue_staker_account == res.issueStaker.toString()) {
                    found = true;
                    staker.issue_staker_amount =
                        parseFloat(staker.issue_staker_amount) +
                        (parseFloat(res.stakedAmount)/10**token.token_decimals)
                }
            })

            if (!found) {
                issue.issue_stakers.push({
                    issue_staker_name: user.user_gh_name,
                    issue_staker_avatar: user.user_profile_pic,
                    issue_staker_account: res.issueStaker.toString(),
                    issue_staker_github: user.user_github,
                    issue_staker_amount: parseFloat(res.stakedAmount)/10**token.token_decimals,
                })
            }

            issue.issue_stake_timeline[issue.issue_stake_timeline.length - 1].data = {
                avatar: user.user_profile_pic,
                staker_account: res.issueStaker.toString(),
                staker_github: user.user_github,
                staker_name: user.user_gh_name,
                staked: true,
                staker_amount: parseFloat(res.stakedAmount)/10**token.token_decimals,
            }

            issue.issue_stake_timeline.push({
                name: formatDate,
                value: issue.issue_stake_amount,
                date: dateTime.valueOf()
            })

            console.log(issue)
            
            await issue.save()
            if (project.coins_staked) {
                project.coins_staked =
                    parseFloat(project.coins_staked) +
                    parseFloat(res.stakedAmount)/10**token.token_decimals
            } else {
                project.coins_staked = parseFloat(res.stakedAmount)/10**token.token_decimals
            }
            await project.save()
            user.user_contributions.push({
                contributor_github: user.user_github,
                contribution_link: res.issueContributionLink,
                contribution_timestamp: new Date(),
                contribution_amt: parseFloat(res.stakedAmount)/10**token.token_decimals,
                contribution_token_symbol: token.token_symbol,
                contribution_token_icon: token.token_image_url,
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
