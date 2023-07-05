import { IAddCommitToPR } from '../events'

export const addCommitToPR = async (commit: IAddCommitToPR) => {
    return new Promise(async (resolve, reject) => {
        resolve('Added Commit to PR')
    })
}
