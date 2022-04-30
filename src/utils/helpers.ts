import axios from 'axios'

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
