import { PublicKey } from '@solana/web3.js'
import { BN } from '@project-serum/anchor'

export interface IPullRequestSent {
    sentBy: PublicKey
    commits: Array<PublicKey>
    metadataUri: String
    issue: PublicKey
    pullRequest: PublicKey
}

export interface IAddCommitToPR {
    commit: PublicKey
    by: PublicKey
}

export interface IAddChildObjective {
    parentAccount: PublicKey
    addedBy: PublicKey
}

export interface IAddObjectiveDataEvent {
    objective_title: String
    objective_metadata_uri: String
    objective_start_unix: number
    objective_creation_unix: number

    // look into these 2 fields

    // objective_end_unix: Option<number>,
    // objective_deliverable: ObjectiveDeliverable,

    objective_public_key: PublicKey
    objective_issue: PublicKey
}

export interface IAddRoadmapDataEvent {
    roadmapTitle: String
    roadmapDescriptionLink: String
    roadmapCreationUnix: number
    roadmapCreator: PublicKey
    rootObjectiveIds: Array<PublicKey>
    roadmapOutlook: number
}

export interface INameRouterCreated {
    routerCreator: PublicKey
    nameRouterAccount: PublicKey
}

export interface IVerifiedUserAdded {
    routerCreator: PublicKey
    nameRouterAccount: PublicKey
    verifiedUserAccount: PublicKey
    userName: String
    userPubkey: PublicKey
}

export interface ICommitAdded {
    commitCreator: PublicKey
    commitAccount: PublicKey
    issueAccount: PublicKey
    metadataUri: String
}

export interface IIssueCreated {
    issueCreator: PublicKey
    issueAccount: PublicKey
    repositoryAccount: PublicKey
    issueTokenPoolAccount: PublicKey
    rewardsMint: PublicKey
    uri: String
}

export interface IRepositoryCreated {
    repositoryCreator: PublicKey
    repositoryAccount: PublicKey
    rewardsMint?: PublicKey
    uri: String
    name: String
    description: String
    tokenName?: String
    tokenImage?: String
    tokenMetadataUri?: String
}

export interface IIssueStaked {
    issueStaker: PublicKey
    issueStakerTokenAccount: PublicKey
    issueAccount: PublicKey
    stakedAmount: BN
    rewardsMint: PublicKey
    issueContributionLink: String
}

export interface IIssueUnstaked {
    issueStaker: PublicKey
    issueStakerTokenAccount: PublicKey
    issueAccount: PublicKey
    unstakedAmount: BN
    rewardsMint: PublicKey
    issueContributionLink: String
}

export interface IPullRequestAccepted {
    pullRequestAddr: PublicKey
    repository: PublicKey
    repositoryName: String
    issue: PublicKey
    repositoryCreator: PublicKey
}

export interface IVestingScheduleChanged {
    repositoryAccount: PublicKey
    repositoryCreator: PublicKey
    oldVestingSchedule: Array<String>
    newVestingSchedule: Array<String>
}

export interface IDefaultVestingScheduleChanged {
    numberOfSchedules: number
    perVestingAmount: number
    unixChange: number
}

export interface IPullRequestStaked {
    prStaker: PublicKey
    prStakerTokenAccount: PublicKey
    prAccount: PublicKey
    stakedAmount: BN
    rewardsMint: PublicKey
    prContributionLink: String
}

export interface IPullRequestUnstaked {
    prStaker: PublicKey
    prStakerTokenAccount: PublicKey
    prAccount: PublicKey
    stakedAmount: BN
    rewardsMint: PublicKey
    prContributionLink: String
}
