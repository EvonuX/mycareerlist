import axios from 'axios'
import {
  categories,
  interviewOffers,
  locations,
  types
} from '~/constants/general'

export const fetcher = (url: string) => axios.get(url).then(res => res.data)

export const stripHtml = (html: string) => {
  return html
    .replace(/<[^>]+>/gm, '')
    .replace(/([\r\n]+ +)+/gm, '')
    .trim()
}

export const formatDate = (date: any) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit'
  })
}

export const getCategory = (category: string) => {
  return categories.find(c => c.value === category)?.label
}

export const getType = (type: string) => {
  return types.find(c => c.value === type)?.label
}

export const getLocation = (city: string, location: string) => {
  const loc = locations.find(c => c.value === location)
  return city ? `${loc?.label}, ${city}` : loc?.label
}

export const getInterviewOffer = (offer: string) => {
  return interviewOffers.find(d => d.value === offer)?.label
}

export const getInterviewDifficulty = (difficulty: number) => {
  switch (difficulty) {
    case 1:
      return 'Easy'
    case 2:
      return 'Medium'
    case 3:
      return 'Hard'
    default:
      return 'Easy'
  }
}
