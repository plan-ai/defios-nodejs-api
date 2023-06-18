import { IAddObjectiveDataEvent } from '../events'
import { RoadmapObjective } from '../models/roadmap'
import { User } from '../models/users'
import { BN } from '@project-serum/anchor'

export const addObjectiveData = async (objective: IAddObjectiveDataEvent) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({
                user_phantom_address: objective.objectiveAddr.toString(),
            })
            if (!user) {
                reject('User not found')
                return
            }
            let objective_end: BN | null = null
            if (objective.objectiveEndUnix) {
                objective_end = objective.objectiveEndUnix
            }
            let children: Array<String> = []
            for (var child_objectives in objective.childObjectives) {
                children.push(child_objectives.toString())
            }
            const new_objective = new RoadmapObjective({
                objective_key: objective.objectivePublicKey.toString(),
                objective_title: objective.objectiveTitle,
                objective_creation_date: objective.objectiveCreationUnix,
                objective_start_date: objective.objectiveStartUnix,
                objective_end_date: objective_end,
                objective_state: 'InProgress',
                objective_creator_gh_name: user.user_gh_name,
                objective_creator_gh_profile_pic: user.user_profile_pic,
            })
            new_objective.save()
            resolve('Objective Created')
        } catch (err) {
            reject(err)
        }
    })
}
