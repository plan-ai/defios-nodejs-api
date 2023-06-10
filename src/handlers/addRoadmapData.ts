import { IAddRoadmapDataEvent } from '../events'
import { Roadmap, RoadmapObjective } from '../models/roadmap'
import { User } from '../models/users'

export const addRoadmapData = async (roadmap: IAddRoadmapDataEvent) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({
                user_phantom_address: roadmap.roadmapCreator.toString(),
            })
            if (!user) {
                reject('User not found')
                return
            }
            let objective_list: Array<RoadmapObjective> = [] 
            for( var objective_id in roadmap.rootObjectiveIds){
                let objective_object = await RoadmapObjective.findOne({
                    objective_key:objective_id.toString()
                })
                objective_list.push(objective_object)
            }
            const new_roadmap = new Roadmap({
                roadmap: roadmap.roadmap.toString(),
                roadmap_title: roadmap.roadmapTitle,
                roadmap_description: roadmap.roadmapDescriptionLink,
                roadmap_creation_date: roadmap.roadmapCreationUnix,
                roadmap_creator_gh: user.user_github,
                roadmap_creator_gh_profile_url: user.user_profile_pic,
                roadmap_creator_gh_name: user.user_gh_name,
                roadmap_cover_img_url: roadmap.roadmapImageUrl,
                roadmap_objectives_list: objective_list
            })
            new_roadmap.save()
            resolve('Roadmap Created')
        } catch (err) {
            reject(err)
        }
    })
}
