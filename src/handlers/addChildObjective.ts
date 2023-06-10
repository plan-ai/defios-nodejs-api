import { IAddChildObjectiveEvent } from '../events'

export const addChildObjective = async (res: IAddChildObjectiveEvent) => {
    return new Promise(async (resolve, reject) => {
        try {
            resolve("Child Objective Added")
        } catch (err) {
            reject(err)
        }
    })
}
