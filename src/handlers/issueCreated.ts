import axios from 'axios'
import { IIssueCreated } from '../events'
import { Issues } from '../models/issues'
import { Project } from '../models/project'
import { Token } from '../models/token'
import { User } from '../models/users'
const config = require('config')

const token = process.env.GH_TOKEN as string
const github_token = config.github.api_key
console.log(github_token)
export const issueCreated = async (res: IIssueCreated) => {
    return new Promise(async (resolve, reject) => {
        const user = await User.findOne({
            user_phantom_address: res.issue_creator.toString(),
        })
        if (!user) {
            reject('User not found')
            return
        }
        const token = await Token.findOne({
            token_spl_addr: res.rewards_mint.toString(),
        })
        if (!token) {
            reject('Token not found')
            return
        }
        const project = await Project.findOne({
            project_account: res.repository_account.toString(),
        })
        if (!project) {
            reject('Project not found')
            return
        }
        var config = {
            method: 'get',
            url: res.uri.replace(
                'https://github.com/',
                'https://api.github.com/repos/'
            ),
            headers: {
                Authorization: 'Bearer ' + github_token,
                'Content-Type': 'application/json',
            },
        }

        axios(config)
            .then((data) => {
                const issue = new Issues({
                    issue_account: res.issue_account.toString(),
                    issue_creator_gh: user.user_github,
                    issue_project_id: res.repository_account.toString(),
                    issue_project_name: project.project_name,
                    issue_title: data.data.title,
                    issue_state: 'open',
                    issue_summary: data.data.body,
                    issue_gh_url: res.uri,
                    issue_stake_amount: 0,
                    issue_stake_token_symbol: token.token_symbol,
                    issue_stake_token_url: res.rewards_mint.toString(),
                    issue_prs: [],
                    issue_tags: data.data.labels.map(
                        (label: any) => label.name
                    ),
                })
                issue.save()
                resolve(issue)
            })
            .catch((err) => {
                reject(err)
            })
    })
}
