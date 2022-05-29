import { User } from '@prisma/client'

export interface Company {
  id: string
  name: string
  slug: string | null
  description: string | null
  website: string | null
  logo: string | null
  region: string
  city: string | null
  userId: string
  reviews: Review[]
  interviews: Interview[]
  jobs: Job[]
  createdAt: Date
  updatedAt: Date
  _count: {
    jobs: number
    reviews: number
  }
}

export interface Job {
  id: string
  slug: string | null
  title: string
  description: string | null
  type: string
  category: string
  location: string
  city: string
  applyLink: string
  draft: boolean
  featured: boolean
  expired: boolean
  salaryRange: string | null
  companyId: string
  savedBy: User[]
  company: Company
  createdAt: Date
  updatedAt: Date
}

export interface Review {
  id: string
  title: string
  content: string
  pros: string | null
  cons: string | null
  rating: number
  status: string
  company: Company
  userId: string
  companyId: string
  createdAt: Date
  updatedAt: Date
}

export interface Interview {
  id: string
  title: string
  position: string
  year: string
  hr: string
  technical: string
  duration: number
  difficulty: number
  offer: string
  rating: number
  companyId: string
  company: Company
  userId: string
  user: User
  createdAt: Date
  updatedAt: Date
}
