import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Inbox } from 'lucide-react'
import { EmptyState } from '@/components/ui/empty-state'

/**
 * WORKSHOP EXERCISE — shared empty state.
 *
 * These tests are skipped so `main` stays green while the component is a stub.
 * Unskip, watch them fail, then make the component look like the rest of
 * `src/components/ui/`. Two other teams import this the moment it works.
 */
describe.skip('EmptyState', () => {
  it('renders the title', () => {
    render(<EmptyState title="No pull requests yet" />)
    expect(screen.getByText('No pull requests yet')).toBeInTheDocument()
  })

  it('renders an optional description', () => {
    render(<EmptyState title="Nothing here" description="Open an issue to get started." />)
    expect(screen.getByText('Open an issue to get started.')).toBeInTheDocument()
  })

  it('renders an optional action slot', () => {
    render(<EmptyState title="Nothing here" action={<button type="button">Create one</button>} />)
    expect(screen.getByRole('button', { name: 'Create one' })).toBeInTheDocument()
  })

  it('renders an optional icon with an accessible name', () => {
    render(<EmptyState title="Inbox empty" icon={Inbox} />)
    expect(screen.getByText('Inbox empty')).toBeInTheDocument()
  })
})
