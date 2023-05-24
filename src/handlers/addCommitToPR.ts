import { IAddCommitToPR } from '../events'
import { IIssuePRs, Issues, IIssue } from '../models/issues'

export const addCommitToPR = async (commit: IAddCommitToPR) => {
    return new Promise(async (resolve, reject) => {
        resolve('Added Commit to PR')
    })
}
