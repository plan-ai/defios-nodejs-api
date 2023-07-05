import { IAddChildObjectiveEvent } from '../events'
import { RoadmapObjective, Roadmap } from '../models/roadmap'

export const addChildObjective = async (res: IAddChildObjectiveEvent) => {
    return new Promise(async (resolve, reject) => {
        try {
            const parent_objective = await RoadmapObjective.findOne({
                objective_key: res.parentObjectiveAccount.toString(),
            })
            const parent_roadmap = await Roadmap.findOne({
                roadmap_key: res.parentObjectiveAccount.toString(),
            })

            let child_objective: any = null

            for (let i = 0; i < 10; i++) {
                child_objective = await RoadmapObjective.findOne({
                    objective_key:
                        res.objectives[res.objectives.length - 1].toString(),
                })
                if (child_objective) {
                    break
                } else {
                    await new Promise((resolve) => setTimeout(resolve, 1000))
                }
            }
            const roadmap: any = await Roadmap.findOne({
                roadmap_key: parent_objective
                    ? parent_objective.roadmap.toString()
                    : parent_roadmap.roadmap_key.toString(),
            })

            const node = parent_objective
                ? parent_objective.objective_key.toString()
                : 'root'

            for (let i = 0; i < res.objectives.length; i++) {
                const objective_child: any = await RoadmapObjective.findOne({
                    objective_key: res.objectives[i].toString(),
                })

                if (objective_child !== null && objective_child !== undefined) {
                    objective_child.roadmap = roadmap.roadmap_key.toString()

                    await objective_child.save()

                    if (
                        !roadmap.roadmap_objectives_graph.includes(
                            node + ':' + res.objectives[i].toString()
                        )
                    ) {
                        roadmap.roadmap_objectives_graph.push(
                            node + ':' + res.objectives[i].toString()
                        )
                        roadmap.roadmap_active_objectives += 1
                    }
                }
            }

            await roadmap.save()
            resolve('Child Objective Added')
        } catch (err) {
            reject(err)
        }
    })
}
