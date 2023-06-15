import { IAddChildObjectiveEvent } from '../events'
import { RoadmapObjective, Roadmap } from '../models/roadmap'

export const addChildObjective = async (res: IAddChildObjectiveEvent) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('addChildObjective: ', res)
            const parent_objective = await RoadmapObjective.findOne({
                objective_key: res.parentObjectiveAccount.toString(),
            })
            const child_objective = await RoadmapObjective.findOne({
                objective_key: res.objectives[0].toString(),
            })
            const roadmap = await Roadmap.findOne({
                roadmap_key: child_objective.roadmap.toString(),
            })

            for (var child_objectives_id in res.objectives) {
                const objective_child = await RoadmapObjective.findOne({
                    objective_key: child_objectives_id.toString(),
                })
                roadmap.roadmap_objectives_list.push(objective_child)
            }

            const node = parent_objective
                ? parent_objective.objective_key.toString()
                : 'root'

            roadmap.roadmap_objectives_graph.push(
                res.parentObjectiveAccount.toString() +
                    ':' +
                    child_objective.objective_key.toString()
            )

            await roadmap.save()
            console.log(roadmap)

            resolve('Child Objective Added')
        } catch (err) {
            reject(err)
        }
    })
}
