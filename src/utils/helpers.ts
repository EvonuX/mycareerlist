import axios from 'axios'

export const fetcher = (url: string) => axios.get(url).then(res => res.data)

export const stripHtml = (html: string) =>
  html.replace(/<[^>]+>/gm, '').replace(/([\r\n]+ +)+/gm, '')
