import { describe, expect, it } from 'vitest'
import { deriveCiStatus, transformCommit, transformPullRequest, transformRepository } from '@/services/github/transform'

describe('GitHub response transforms', () => {
  it('maps a repository payload', () => {
    const repo = transformRepository({
      name: 'git-real-playground',
      full_name: 'org/git-real-playground',
      description: 'workshop',
      default_branch: 'main',
      html_url: 'https://github.com/org/git-real-playground',
      open_issues_count: 4,
    })
    expect(repo.defaultBranch).toBe('main')
    expect(repo.openIssues).toBe(4)
  })

  it('uses the first line of a commit message and the GitHub login when present', () => {
    const commit = transformCommit({
      sha: 'abc',
      html_url: 'https://example.com/abc',
      commit: {
        message: 'feat: hello\n\nbody',
        author: { name: 'Rahul Sharma', date: '2026-08-21T10:00:00Z' },
      },
      author: { login: 'rahul' },
    })
    expect(commit.message).toBe('feat: hello')
    expect(commit.authorLogin).toBe('rahul')
  })

  it('maps pull request fields and keeps unknown CI until derived', () => {
    const pr = transformPullRequest({
      number: 14,
      title: 'Add list',
      body: null,
      state: 'open',
      merged_at: null,
      draft: false,
      user: { login: 'rahul' },
      head: { ref: 'feat/list' },
      base: { ref: 'main' },
      created_at: '2026-08-21T10:00:00Z',
      updated_at: '2026-08-21T11:00:00Z',
      html_url: 'https://example.com/14',
      requested_reviewers: [{ login: 'gauri' }],
    })
    expect(pr.author).toBe('rahul')
    expect(pr.requestedReviewers).toEqual(['gauri'])
    expect(pr.ciStatus).toBe('unknown')
  })

  it('derives CI status from related workflow runs', () => {
    expect(
      deriveCiStatus(
        { number: 21, head: 'feat/prod' },
        [
          {
            id: 1,
            name: 'CI',
            status: 'completed',
            conclusion: 'failure',
            headBranch: 'feat/prod',
            event: 'pull_request',
            htmlUrl: '',
            createdAt: '',
            pullRequestNumbers: [21],
          },
        ],
      ),
    ).toBe('fail')
  })
})
