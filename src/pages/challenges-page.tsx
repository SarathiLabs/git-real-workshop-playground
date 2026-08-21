import { challenges } from '@/data/load'
import { env } from '@/config/env'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useInstructorStore } from '@/stores/instructor-store'
import { cn } from '@/lib/utils'

function exerciseUrl(path: string) {
  return `https://github.com/${env.githubOwner}/${env.githubRepo}/blob/main/${path}`
}

export function ChallengesPage() {
  const phase = useInstructorStore((state) => state.phase)
  const activeChallengeId = useInstructorStore((state) => state.activeChallengeId)

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {challenges.map((challenge) => (
        <Card
          key={challenge.id}
          className={cn(
            challenge.phase === phase && 'border-primary/40',
            activeChallengeId === challenge.id && 'ring-2 ring-primary/40',
          )}
        >
          <CardHeader>
            <div className="flex items-center justify-between gap-2">
              <CardTitle>{challenge.title}</CardTitle>
              <Badge variant="outline">{challenge.phase}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{challenge.summary}</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {challenge.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
            {challenge.exercise ? (
              <a
                href={exerciseUrl(challenge.exercise)}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-sm text-primary underline-offset-4 hover:underline"
              >
                Open {challenge.exercise}
              </a>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
