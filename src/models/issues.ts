import mongoose from 'mongoose'

export interface IIssue {
    issue_account: mongoose.Schema.Types.String
    issue_creator_gh: mongoose.Schema.Types.String
    issue_project_id: mongoose.Schema.Types.String
    issue_project_name: mongoose.Schema.Types.String
    issue_title: mongoose.Schema.Types.String
    issue_state: 'open' | 'voting' | 'winner_declared' | 'closed'
    issue_summary: mongoose.Schema.Types.String
    issue_gh_url: mongoose.Schema.Types.String
    issue_stake_amount: mongoose.Schema.Types.Number
    issue_token: mongoose.Schema.Types.ObjectId
    issue_prs: IIssuePRs[]
    issue_tags: Array<mongoose.Schema.Types.String>
    rewardee: string
}

export interface IIssuePRs {
    issue_pr_account: string
    issue_pr_author: string
    issue_pr_link: string
    issue_originality_score: number
    issue_author_github: string
    issue_pr_github_name: string
    issue_pr_title: string
    issue_vote_amount: number
    issue_pr_github: string
    issue_pr_voters: string[]
}

export const IssuePRsSchema = new mongoose.Schema<IIssuePRs>(
    {
        issue_pr_account: {
            type: mongoose.Schema.Types.String,
        },
        issue_pr_author: {
            type: mongoose.Schema.Types.String,
        },
        issue_pr_link: {
            type: mongoose.Schema.Types.String,
        },
        issue_originality_score: {
            type: mongoose.Schema.Types.Number,
        },
        issue_author_github: {
            type: mongoose.Schema.Types.String,
        },
        issue_pr_github_name: {
            type: mongoose.Schema.Types.String,
        },
        issue_pr_title: {
            type: mongoose.Schema.Types.String,
        },
        issue_vote_amount: {
            type: mongoose.Schema.Types.Number,
        },
        issue_pr_github: {
            type: mongoose.Schema.Types.String,
        },
        issue_pr_voters: {
            type: [mongoose.Schema.Types.String],
        },
    },
    { versionKey: false, _id: false }
)

export const IssueSchema = new mongoose.Schema<IIssue>(
    {
        issue_account: {
            type: mongoose.Schema.Types.String,
        },
        issue_creator_gh: {
            type: mongoose.Schema.Types.String,
        },
        issue_project_id: {
            type: mongoose.Schema.Types.String,
        },
        issue_project_name: {
            type: mongoose.Schema.Types.String,
        },
        issue_title: {
            type: mongoose.Schema.Types.String,
        },
        issue_state: {
            type: mongoose.Schema.Types.String,
        },
        issue_summary: {
            type: mongoose.Schema.Types.String,
        },
        issue_gh_url: {
            type: mongoose.Schema.Types.String,
        },
        issue_stake_amount: {
            type: mongoose.Schema.Types.Number,
        },
        issue_token: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Token',
        },
        issue_prs: {
            type: [IssuePRsSchema],
        },
        issue_tags: {
            type: [mongoose.Schema.Types.String],
        },
        rewardee: {
            type: mongoose.Schema.Types.String,
        },
    },
    { versionKey: false }
)

export const Issues = mongoose.model('Issues', IssueSchema)
