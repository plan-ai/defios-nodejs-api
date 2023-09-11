import axios from 'axios'
import { IIssueCreated } from '../events'
import { Issues } from '../models/issues'
import { Project } from '../models/project'
import { User } from '../models/users'
import { Token } from '../models/token'
const config = require('config')

const github_token = config.github.api_key
console.log(github_token)
export const issueCreated = async (res: IIssueCreated) => {
    return new Promise(async (resolve, reject) => {
        const user = await User.findOne({
            user_phantom_address: res.issueCreator?.toString(),
        })
        if (!user) {
            reject('User not found')
            return
        }

        let project: any
        let token: any
        let tries = 10
        while (tries > 0 && !project && !token) {
            project = await Project.findOne({
                project_account: res.repositoryAccount?.toString(),
            })
            token = await Token.findById(project.project_token)
            setTimeout(() => {
                tries--
            }, 1000)
        }
        if (!project) {
            reject('Project not found')
            return
        }
        if (!token) {
            reject('Token not found')
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
            .then(async (data) => {
                const issue = new Issues({
                    issue_account: res.issueAccount.toString(),
                    issue_creator_gh: user.user_github,
                    issue_project_id: res.repositoryAccount.toString(),
                    issue_project_name: project.project_name,
                    issue_title: data.data.title,
                    issue_state: 'open',
                    issue_summary: data.data.body,
                    issue_gh_url: res.uri,
                    issue_stake_amount: 0,
                    issue_token: token._id,
                    issue_prs: [],
                    issue_tags: data.data.labels.map(
                        (label: any) => label.name
                    ),
                })
                issue.save()
                project.num_open_issues += 1
                project.save()
                resolve(issue)
            })
            .catch((err) => {
                reject(err)
            })
    })
}
