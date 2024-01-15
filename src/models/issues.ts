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
    reward_claimed: mongoose.Schema.Types.Boolean
    issue_stakers: IIssueStakers[]
    issue_stake_timeline: IIssueStakeTimeline[]
}

export interface IIssuePRs {
    issue_pr_account: string
    issue_pr_author: string
    issue_pr_link: string
    issue_author_github: string
    issue_pr_github_name: string
    issue_pr_title: string
    issue_vote_amount: number
    issue_pr_github: string
    issue_pr_voters: string[]
}

export interface IIssueStakers {
    issue_staker_avatar: string,
    issue_staker_name: string,
    issue_staker_account: string
    issue_staker_github: string
    issue_staker_amount: number
}

export interface IIssueStakeTimeline {
    name: string
    value: number
    date: number
    data?: {
        avatar: string,
        staker_account: string,
        staker_github: string,
        staker_name: string,
        staker_amount: number,
        staked: boolean,
    }
}

export const IssueStakeTimelineSchema = new mongoose.Schema<IIssueStakeTimeline>(
    {
        name: {
            type: mongoose.Schema.Types.String,
        },
        value: {
            type: mongoose.Schema.Types.Number,
        },
        date: {
            type: mongoose.Schema.Types.Number,
        },
        data: {
            avatar: {
                type: mongoose.Schema.Types.String,
            },
            staker_account: {
                type: mongoose.Schema.Types.String,
            },
            staker_github: {
                type: mongoose.Schema.Types.String,
            },
            staker_name: {
                type: mongoose.Schema.Types.String,
            },
            staker_amount: {
                type: mongoose.Schema.Types.Number,
            },
            staked: {
                type: mongoose.Schema.Types.Boolean,
            },
        },
    },
    { versionKey: false, _id: false }
)

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

export const IssueStakersSchema = new mongoose.Schema<IIssueStakers>(
    {
        issue_staker_avatar: {
            type: mongoose.Schema.Types.String,
        },
        issue_staker_name: {
            type: mongoose.Schema.Types.String,
        },
        issue_staker_account: {
            type: mongoose.Schema.Types.String,
        },
        issue_staker_github: {
            type: mongoose.Schema.Types.String,
        },
        issue_staker_amount: {
            type: mongoose.Schema.Types.Number,
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
        reward_claimed: {
            type: mongoose.Schema.Types.Boolean,
        },
        issue_stakers: {
            type: [IssueStakersSchema],
        },
        issue_stake_timeline: {
            type: [IssueStakeTimelineSchema],
        },
    },
    { versionKey: false }
)

export const Issues = mongoose.model('Issues', IssueSchema)
