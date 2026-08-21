import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useInstructorStore } from '@/stores/instructor-store'

export function useKeyboardShortcuts() {
  const navigate = useNavigate()
  const togglePresentationMode = useInstructorStore((state) => state.togglePresentationMode)
  const toggleInstructorMode = useInstructorStore((state) => state.toggleInstructorMode)
  const requestFit = useInstructorStore((state) => state.requestFit)

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null
      if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return
      if (event.metaKey || event.ctrlKey || event.altKey) return

      if (event.key === 'p' || event.key === 'P') {
        event.preventDefault()
        togglePresentationMode()
      }
      if (event.key === 'f' || event.key === 'F') {
        event.preventDefault()
        requestFit()
      }
      if (event.key === 'n' || event.key === 'N') {
        event.preventDefault()
        navigate('/network')
      }
      if (event.key === 'a' || event.key === 'A') {
        event.preventDefault()
        navigate('/activity')
      }
      if (event.key === 'i' || event.key === 'I') {
        event.preventDefault()
        toggleInstructorMode()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate, requestFit, toggleInstructorMode, togglePresentationMode])
}
