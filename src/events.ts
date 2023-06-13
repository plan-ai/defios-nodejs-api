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

export interface IAddChildObjectiveEvent {
    parentObjectiveAccount: PublicKey
    addedBy: PublicKey
    objectives: Array<PublicKey>
}

export interface IAddObjectiveDataEvent {
    objectiveTitle: String
    objectiveMetadataUri: String
    objectiveStartUnix: BN
    objectiveCreationUnix: BN
    objectiveEndUnix: BN | null
    objectiveDeliverable: object
    objectivePublicKey: PublicKey
    objectiveIssue: PublicKey
    objectiveAddr: PublicKey
    childObjectives: Array<PublicKey>
}

export interface IAddRoadmapDataEvent {
    roadmapTitle: String
    roadmapDescriptionLink: String
    roadmapCreationUnix: BN
    roadmapCreator: PublicKey
    rootObjectiveIds: Array<PublicKey>
    roadmapOutlook: object
    roadmapImageUrl: String
    roadmap: PublicKey
    roadmapRepository: String
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
    id: String
    description: String
    tokenName?: String
    tokenSymbol?: String
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
