import { IRepositoryCreated } from '../events'
import { Project } from '../models/project'
import { Token } from '../models/token'
import { User } from '../models/users'
import axios from 'axios'
import { getMint } from '@solana/spl-token'
import { PublicKey, Connection, clusterApiUrl } from '@solana/web3.js'

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
                    .replace(
                        'https://ipfs.io',
                        'https://defi-os.infura-ipfs.io'
                    )
                await axios.get(new_metadata_uri).then(async (response) => {
                    const tokenAddress = res.rewardsMint.toBase58()
                    let repo_token = await Token.findOne({
                        token_spl_addr: tokenAddress,
                    })
                    const connection = new Connection(clusterApiUrl('devnet'))
                    const mintInfo = await getMint(
                        connection,
                        new PublicKey(tokenAddress)
                    ).catch((err) => {
                        console.log(err)
                    })
                    if (!repo_token) {
                        const token = new Token({
                            token_spl_addr: tokenAddress,
                            token_symbol: res.tokenSymbol,
                            token_name: res.tokenName,
                            token_image_url: response.data.image,
                            token_new: token_new,
                            token_decimals: mintInfo ? mintInfo.decimals : 1,
                        })
                        await token.save()
                        repo_token = token
                    }
                    const user = await User.findOne({
                        user_phantom_address: res.repositoryCreator.toString(),
                    })
                    if (!user) {
                        reject('User not found')
                        return
                    }
                    const repo = await axios
                        .get(`https://api.github.com/repositories/${res.id}`, {
                            headers: {
                                Authorization: `Bearer ${process.env.GH_TOKEN}`,
                            },
                        })
                        .then((res) => {
                            return res.data
                        })
                        .catch((err) => {
                            console.log(err)
                            return
                        })
                    const project = new Project({
                        project_account: res.repositoryAccount.toString(),
                        project_name: repo.full_name,
                        project_github_id: res.id,
                        num_contributions: 0,
                        num_contributions_chg_perc: 0,
                        num_open_issues: 0,
                        community_health: 0,
                        coins_staked: 0,
                        coins_rewarded: 0,
                        project_repo_link: res.uri,
                        project_token: repo_token._id,
                        project_owner_github: user.user_github,
                    })
                    await project.save()
                    resolve('Repository Creation Successfull')
                })
            } else {
                const user = await User.findOne({
                    user_phantom_address: res.repositoryCreator.toString(),
                })
                if (!user) {
                    reject('User not found')
                    return
                }
                const repo = await axios
                    .get(`https://api.github.com/repositories/${res.id}`, {
                        headers: {
                            Authorization: `Bearer ${process.env.GH_TOKEN}`,
                        },
                    })
                    .then((res) => {
                        return res.data
                    })
                    .catch((err) => {
                        console.log(err)
                        return
                    })
                const project = new Project({
                    project_account: res.repositoryAccount.toString(),
                    project_name: repo.full_name,
                    project_github_id: res.id,
                    num_contributions: 0,
                    num_contributions_chg_perc: 0,
                    num_open_issues: 0,
                    community_health: 0,
                    coins_staked: 0,
                    coins_rewarded: 0,
                    project_repo_link: res.uri,
                    project_owner_github: user.user_github,
                })
                await project.save()
                resolve('Repository Creation Successfull')
            }
        } catch (err) {
            reject(err)
        }
    })
}
