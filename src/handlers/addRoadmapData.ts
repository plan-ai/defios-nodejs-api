import { IAddRoadmapDataEvent } from '../events'
import { Roadmap } from '../models/roadmap'
import { User } from '../models/users'

export const addRoadmapData = async (roadmap: IAddRoadmapDataEvent) => {
    return new Promise(async (resolve, reject) => {
        const user = await User.findOne({
            user_phantom_address: roadmap.roadmapCreator.toString(),
        })
        if (!user) {
            reject('User not found')
            return
        }
        const new_roadmap = new Roadmap({
            roadmap_title: roadmap.roadmapTitle,
            roadmap_description: roadmap.roadmapDescriptionLink,
            roadmap_creation_date: roadmap.roadmapCreationUnix,
            roadmap_creator_gh: user.user_github,
            roadmap_creator_gh_profile_url: user.user_profile_pic,
            roadmap_creator_gh_name: user.user_gh_name,
        })
        new_roadmap.save()
    })
}
