import mongoose from 'mongoose'

interface IProject {
    project_account: mongoose.Schema.Types.String
    project_owner_github: mongoose.Schema.Types.String
    project_token: mongoose.Schema.Types.ObjectId
    project_name: mongoose.Schema.Types.String
    project_github_id: mongoose.Schema.Types.String
    project_repo_link: mongoose.Schema.Types.String
    num_open_issues: mongoose.Schema.Types.Number
    community_health: mongoose.Schema.Types.Number
    num_contributions: mongoose.Schema.Types.Number
    num_contributions_chg_perc: mongoose.Schema.Types.Number
    num_contributions_graph: mongoose.Schema.Types.String
    is_token_native: mongoose.Schema.Types.Boolean
    coins_staked: mongoose.Schema.Types.Number
    coins_rewarded: mongoose.Schema.Types.Number
}

export const ProjectSchema = new mongoose.Schema<IProject>(
    {
        project_account: {
            type: mongoose.Schema.Types.String,
            required: true,
        },
        project_owner_github: {
            type: mongoose.Schema.Types.String,
        },
        project_token: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Token',
        },
        project_name: {
            type: mongoose.Schema.Types.String,
        },
        project_github_id: {
            type: mongoose.Schema.Types.String,
        },
        project_repo_link: {
            type: mongoose.Schema.Types.String,
        },
        num_open_issues: {
            type: mongoose.Schema.Types.Number,
        },
        community_health: {
            type: mongoose.Schema.Types.Number,
        },
        num_contributions: {
            type: mongoose.Schema.Types.Number,
        },
        num_contributions_chg_perc: {
            type: mongoose.Schema.Types.Number,
        },
        num_contributions_graph: {
            type: mongoose.Schema.Types.String,
        },
        is_token_native: {
            type: mongoose.Schema.Types.Boolean,
        },
        coins_staked: {
            type: mongoose.Schema.Types.Number,
        },
        coins_rewarded: {
            type: mongoose.Schema.Types.Number,
        }
    },
    { versionKey: false }
)

export const Project = mongoose.model<IProject>('Projects', ProjectSchema)
