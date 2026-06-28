export type Package = {
  id: number
  slug: string
  name: string
  tagline: string | null
  description: string | null
  monthlyPrice: string
  annualPrice: string
  features: string[]
  category: string
  deposit: string | null
  duration: string | null
  bestFor: string[] | null
  highlight: boolean
  sortOrder: number
}
