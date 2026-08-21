export const features = {
  darkMode: false,
  participantSearch: true,
  teamFilter: false,
  collaborationScore: false,
  activityFilters: true,
}

/**
 * Dark mode is implemented. The UI toggle stays hidden until BOTH
 * `features.darkMode` is true AND this constant is true.
 * Workshop Issue: enable the theme switcher without only flipping one flag.
 */
export const ENABLE_THEME_SWITCHER = false
