import { IRepositoryCreated } from '../events'
import { Project } from '../models/project'
import { Token } from '../models/token'
import { User } from '../models/users'
import axios from 'axios'

export const repositoryCreated = async (res: IRepositoryCreated) => {
    return new Promise(async (resolve, reject) => {
        try {
            let token_new: boolean = false
            if (res.vestingAccount != null && res.vestingAccount != undefined) {
                token_new = true
            }
            if (
                res.tokenMetadataUri !== null &&
                res.tokenMetadataUri !== undefined
            ) {
                let new_metadata_uri = res.tokenMetadataUri
                    .toString()
                    .replace('gateway.pinata.cloud', 'ipfs.io')
                axios
                    .get(new_metadata_uri)
                    .then(async (response) => {
                        const tokenAddress = res.rewardsMint.toBase58()
                        let repo_token = await Token.findOne({
                            token_spl_addr: tokenAddress,
                        })
                        if (!repo_token) {
                            const token = new Token({
                                token_spl_addr: tokenAddress,
                                token_symbol: res.tokenSymbol,
                                token_name: res.tokenName,
                                token_image_url: response.data.image,
                                token_new: token_new,
                            })
                            token.save()
                            repo_token = token
                        }
                        const user = await User.findOne({
                            user_phantom_address:
                                res.repositoryCreator.toString(),
                        })
                        if (!user) {
                            reject('User not found')
                            return
                        }
                        const project = new Project({
                            project_account: res.repositoryAccount.toString(),
                            project_name: res.id,
                            num_contributions: 0,
                            num_contributions_chg_perc: 0,
                            num_open_issues: 0,
                            community_health: 0,
                            project_repo_link: res.uri,
                            project_token: repo_token._id,
                            project_owner_github: user.user_github,
                        })
                        project.save()
                        resolve('Repository Creation Successfull')
                    })
                    .catch((err) => reject(err))
            }
        } catch (err) {
            reject(err)
        }
    })
}
