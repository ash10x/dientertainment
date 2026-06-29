export type Package = {
  id: number
  slug: string
  name: string
  tagline: string | null
  description: string | null
  price: string
  deposit: string | null
  duration: string | null
  features: string[]
  deliverables: string[] | null
  addOns: string[] | null
  processSteps: string[] | null
  bestFor: string[] | null
  heroVideoUrl: string | null
  demoVideoUrls: string[] | null
  aiTeamRoles: string[] | null
  outcomeStats: string[] | null
  category: string
  highlight: boolean
  sortOrder: number
}
