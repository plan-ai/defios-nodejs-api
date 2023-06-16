import { IAddChildObjectiveEvent } from '../events'
import { RoadmapObjective, Roadmap } from '../models/roadmap'

export const addChildObjective = async (res: IAddChildObjectiveEvent) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('addChildObjective: ', res)

            const parent_objective = await RoadmapObjective.findOne({
                objective_key: res.parentObjectiveAccount.toString(),
            })
            // const parent_roadmap = await Roadmap.findOne({
            //     roadmap_key: res.parentObjectiveAccount.toString(),
            // })

            let child_objective: any = null

            for (let i = 0; i < 10; i++) {
                child_objective = await RoadmapObjective.findOne({
                    objective_key: res.objectives[0].toString(),
                })
                if (child_objective) {
                    console.log('fetched!')
                    break
                } else {
                    console.log('timeout ' + (i + 1))
                    await new Promise((resolve) => setTimeout(resolve, 1000))
                }
            }
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
                node + ':' + child_objective.objective_key.toString()
            )

            await roadmap.save()
            console.log(roadmap)

            resolve('Child Objective Added')
        } catch (err) {
            reject(err)
        }
    })
}
