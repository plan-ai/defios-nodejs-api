import mongoose from 'mongoose'

export interface Roadmap {
    roadmap_key: mongoose.Schema.Types.String
    roadmap_creator_gh: mongoose.Schema.Types.String
    roadmap_creator_gh_profile_url: mongoose.Schema.Types.String
    roadmap_creator_gh_name: mongoose.Schema.Types.String
    roadmap_cover_img_url: mongoose.Schema.Types.String
    roadmap_active_objectives: mongoose.Schema.Types.Number
    roadmap_objectives_list: RoadmapObjective[]
    roadmap_objectives_graph: Object
    roadmap_creation_date: mongoose.Schema.Types.Date
    roadmap_title: mongoose.Schema.Types.String
    roadmap_description: mongoose.Schema.Types.String
    roadmap_outlook:
        | 'Next 2 Yrs'
        | 'Long-Term Public Good'
        | 'Next 5 Yrs'
        | 'More than 5 Yrs'
}

export interface RoadmapObjective {
    roadmap: mongoose.Schema.Types.String
    objective_key: mongoose.Schema.Types.String
    objective_title: mongoose.Schema.Types.String
    objective_creation_date: mongoose.Schema.Types.Date
    objective_creator_gh_name: mongoose.Schema.Types.String
    objective_creator_gh_profile_pic: mongoose.Schema.Types.String
    objective_deliverable:
        | 'Infrastructure'
        | 'Tooling'
        | 'Publication'
        | 'Product'
        | 'Other'
    objective_state: 'Locked' | 'InProgress' | 'Closed' | 'Deprecated'
    objective_start_date: mongoose.Schema.Types.Date
    objective_end_date: mongoose.Schema.Types.Date
}

export const RoadmapObjectiveSchema = new mongoose.Schema<RoadmapObjective>(
    {
        roadmap: {
            type: mongoose.Schema.Types.String,
        },
        objective_key: {
            type: mongoose.Schema.Types.String,
            required: true,
        },
        objective_title: {
            type: mongoose.Schema.Types.String,
            required: true,
        },
        objective_creation_date: {
            type: mongoose.Schema.Types.Date,
            set: (d: number) => new Date(d * 1000)
        },
        objective_creator_gh_name: {
            type: mongoose.Schema.Types.String,
        },
        objective_creator_gh_profile_pic: {
            type: mongoose.Schema.Types.String,
        },
        objective_deliverable: {
            type: mongoose.Schema.Types.String,
        },
        objective_state: {
            type: mongoose.Schema.Types.String,
        },
        objective_start_date: {
            type: mongoose.Schema.Types.Date,
            set: (d: number) => new Date(d * 1000),
        },
        objective_end_date: {
            type: mongoose.Schema.Types.Date,
            set: (d: number) => new Date(d * 1000),
        },
    },
    { versionKey: false }
)

export const RoadmapSchema = new mongoose.Schema<Roadmap>(
    {
        roadmap_key: {
            type: mongoose.Schema.Types.String,
            required: true,
        },
        roadmap_creator_gh: {
            type: mongoose.Schema.Types.String,
        },
        roadmap_creator_gh_profile_url: {
            type: mongoose.Schema.Types.String,
        },
        roadmap_creator_gh_name: {
            type: mongoose.Schema.Types.String,
            required: true,
            default: '',
        },
        roadmap_cover_img_url: {
            type: mongoose.Schema.Types.String,
        },
        roadmap_active_objectives: {
            type: mongoose.Schema.Types.Number,
        },
        roadmap_objectives_list: {
            type: [RoadmapObjectiveSchema],
        },
        roadmap_objectives_graph: {
            type: Object,
        },
        roadmap_creation_date: {
            type: mongoose.Schema.Types.Date,
            set: (d: number) => new Date(d * 1000),
        },
        roadmap_title: {
            type: mongoose.Schema.Types.String,
        },
        roadmap_description: {
            type: mongoose.Schema.Types.String,
        },
        roadmap_outlook: {
            type: mongoose.Schema.Types.String,
            required: true,
            default: 'Next 2 Yrs',
        },
    },
    { versionKey: false }
)

export const Roadmap = mongoose.model<Roadmap>('Roadmap', RoadmapSchema)
export const RoadmapObjective = mongoose.model<RoadmapObjective>(
    'RoadmapObjective',
    RoadmapObjectiveSchema
)
