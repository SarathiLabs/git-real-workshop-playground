import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { features } from '@/config/features'
import { calculateCollaborationScore } from '@/utils/collaboration-score'
import type { ParticipantStats } from '@/types'

export function MostCollaborative({ participants }: { participants: ParticipantStats[] }) {
  if (!features.collaborationScore) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Most Collaborative</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Implement Most Collaborative calculation. Enable `features.collaborationScore` and rank by reviews
            and cross-team work — not only commits.
          </p>
        </CardContent>
      </Card>
    )
  }

  const ranked = [...participants]
    .map((participant) => ({
      participant,
      score: calculateCollaborationScore({
        commits: participant.commits,
        pullRequests: participant.pullRequests,
        reviews: participant.reviews,
        crossTeamReviews: participant.crossTeamReviews,
        issuesClosed: participant.issuesClosed,
      }),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Most Collaborative</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {ranked.map(({ participant, score }, index) => (
          <div key={participant.student.github} className="flex items-center justify-between text-sm">
            <span>
              {index + 1}. @{participant.student.github}
            </span>
            <span className="tabular text-muted-foreground">{score}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
