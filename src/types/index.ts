export type WorkshopPhase =
  | 'SETUP'
  | 'FUNDAMENTALS'
  | 'BRANCHING'
  | 'COLLABORATION'
  | 'CODE_REVIEW'
  | 'CI_CD'
  | 'INCIDENT'
  | 'ADVANCED_GIT'
  | 'OPEN_SOURCE'
  | 'COMPLETE'

export type ProductionStatus = 'HEALTHY' | 'DEGRADED' | 'INCIDENT'

export type StudentRole = 'developer' | 'team-lead'

export interface Student {
  github: string
  name: string
  team: string
  role: StudentRole
  interests: string[]
}

export interface Team {
  id: string
  name: string
  members: string[]
  category: string
}

export interface Challenge {
  id: string
  phase: WorkshopPhase
  title: string
  summary: string
  skills: string[]
}

export interface AchievementDefinition {
  id: string
  title: string
  description: string
  rule: string
}

export interface WorkshopPhaseInfo {
  id: WorkshopPhase
  label: string
  emphasis: string
}

export interface WorkshopConfig {
  title: string
  subtitle: string
  org: string
  defaultPhase: WorkshopPhase
  refreshIntervalMs: number
  phases: WorkshopPhaseInfo[]
  shortcuts: { key: string; action: string }[]
}

export interface RepositoryInfo {
  name: string
  fullName: string
  description: string
  defaultBranch: string
  htmlUrl: string
  openIssues: number
}

export interface ContributorInfo {
  login: string
  avatarUrl: string
  htmlUrl: string
  contributions: number
}

export interface BranchInfo {
  name: string
  sha: string
  protected: boolean
}

export interface CommitInfo {
  sha: string
  message: string
  authorLogin: string | null
  authorName: string | null
  date: string
  htmlUrl: string
}

export type PullRequestState = 'open' | 'closed'
export type ReviewState = 'APPROVED' | 'CHANGES_REQUESTED' | 'COMMENTED' | 'DISMISSED' | 'PENDING'
export type CiStatus = 'pass' | 'fail' | 'pending' | 'unknown'

export interface PullRequestReviewInfo {
  id: number
  reviewer: string
  state: ReviewState
  submittedAt: string | null
  body: string
}

export interface PullRequestInfo {
  number: number
  title: string
  body: string
  state: PullRequestState
  merged: boolean
  draft: boolean
  author: string
  head: string
  base: string
  createdAt: string
  updatedAt: string
  mergedAt: string | null
  htmlUrl: string
  requestedReviewers: string[]
  changedFiles: number
  additions: number
  deletions: number
  reviews: PullRequestReviewInfo[]
  ciStatus: CiStatus
}

export interface IssueInfo {
  number: number
  title: string
  state: 'open' | 'closed'
  author: string
  labels: string[]
  createdAt: string
  closedAt: string | null
  htmlUrl: string
  isPullRequest: boolean
}

export interface WorkflowRunInfo {
  id: number
  name: string
  status: string
  conclusion: string | null
  headBranch: string
  event: string
  htmlUrl: string
  createdAt: string
  pullRequestNumbers: number[]
}

export interface ReleaseInfo {
  id: number
  tagName: string
  name: string
  draft: boolean
  prerelease: boolean
  publishedAt: string | null
  htmlUrl: string
  author: string
}

export interface GitHubSnapshot {
  repository: RepositoryInfo
  contributors: ContributorInfo[]
  branches: BranchInfo[]
  commits: CommitInfo[]
  pullRequests: PullRequestInfo[]
  issues: IssueInfo[]
  workflowRuns: WorkflowRunInfo[]
  releases: ReleaseInfo[]
  fetchedAt: string
  rateLimitRemaining: number | null
}

export interface GitHubConnectionState {
  mode: 'mock' | 'live'
  connected: boolean
  lastSync: string | null
  error: string | null
  rateLimitRemaining: number | null
}

export type AttentionReason =
  | 'no-commits'
  | 'no-branches'
  | 'no-pull-requests'
  | 'no-reviews'
  | 'disconnected'
  | 'failing-ci'
  | 'open-pr-without-review'

export interface ParticipantStats {
  student: Student
  avatarUrl: string
  commits: number
  pullRequests: number
  mergedPullRequests: number
  reviews: number
  crossTeamReviews: number
  issues: number
  issuesClosed: number
  branches: number
  ciFixes: number
  recentActivity: ActivityEvent[]
  collaboratedWith: string[]
  achievements: string[]
  needsAttention: AttentionReason[]
  isActive: boolean
  isDisconnected: boolean
}

export interface TeamStats {
  team: Team
  members: ParticipantStats[]
  commits: number
  pullRequests: number
  reviews: number
  issuesClosed: number
  isActive: boolean
}

export type ActivityKind = 'commit' | 'pull-request' | 'review' | 'ci' | 'issue' | 'merge'

export interface ActivityEvent {
  id: string
  kind: ActivityKind
  at: string
  actor: string | null
  summary: string
  href?: string
  tone?: 'default' | 'success' | 'warning' | 'danger'
}

export type GraphNodeKind = 'student' | 'team' | 'pullRequest' | 'main' | 'ciRun'

export interface GraphNodeData {
  kind: GraphNodeKind
  label: string
  subtitle?: string
  meta?: Record<string, string | number | boolean>
  [key: string]: unknown
}

export interface GraphEdgeData {
  kind: 'member-of' | 'authored' | 'reviewed' | 'reviewed-author' | 'collaborated' | 'targets-main'
  label: string
}

export interface GraphModel {
  nodes: Array<{
    id: string
    type: GraphNodeKind
    position: { x: number; y: number }
    data: GraphNodeData
  }>
  edges: Array<{
    id: string
    source: string
    target: string
    data: GraphEdgeData
  }>
}

export interface GraphFilters {
  showTeamLabels: boolean
  showReviewEdges: boolean
  showPrNodes: boolean
  showOnlyActive: boolean
  showOnlyFailingCi: boolean
  showDisconnected: boolean
  highlightTeamId: string | null
  highlightStudent: string | null
}

export interface CollaborationHealth {
  activeStudents: number
  totalStudents: number
  teamsActive: number
  totalTeams: number
  studentsWithCommit: number
  studentsWithPr: number
  studentsWithReview: number
  crossTeamReviews: number
  openPrs: number
  failingCi: number
}

export interface GlobalMetrics {
  developers: number
  teams: number
  activeDevelopers: number
  commits: number
  branches: number
  openPrs: number
  mergedPrs: number
  reviews: number
  issuesClosed: number
  ciPassing: number
  ciFailing: number
  releases: number
}

export interface AttentionItem {
  reason: AttentionReason
  label: string
  items: string[]
}

export interface CollaborationScoreInput {
  commits: number
  pullRequests: number
  reviews: number
  crossTeamReviews: number
  issuesClosed: number
}
