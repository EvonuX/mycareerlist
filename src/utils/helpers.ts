import axios from 'axios'
import { categories, locations, types } from '~/constants/general'

export const fetcher = (url: string) => axios.get(url).then(res => res.data)

export const stripHtml = (html: string) => {
  return html.replace(/<[^>]+>/gm, '').replace(/([\r\n]+ +)+/gm, '')
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
