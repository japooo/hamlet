export interface DevScreen {
  label: string
  path: string
  description?: string
}

export interface DevGroup {
  group: string
  screens: DevScreen[]
}

export const DEV_SCREENS: DevGroup[] = [
  {
    group: '',
    screens: [
      { label: 'Landing', path: '/' },
      { label: 'Dashboard', path: '/app/dashboard' },
      { label: 'New Audition', path: '/app/auditions/new' },
      { label: 'Practice', path: '/app/auditions/dev-001/practice' },
      { label: 'Audition State', path: '/app/auditions/dev-001/state' },
    ],
  },
]
