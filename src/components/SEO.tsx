import { useMantineColorScheme } from '@mantine/core'
import Head from 'next/head'
import { stripHtml } from '~/utils/helpers'

interface IProps {
  title: string
  description?: string
  url?: string
  image?: string
  noindex?: any
}

const structuredDataWebSite = {
  '@context': 'http://schema.org',
  '@type': 'WebSite',
  name: 'My Career List - The Global Job Posting Platform',
  url: process.env.NEXT_PUBLIC_BASE_URL
}

const SEO = ({
  title = 'My Career List - The Global Job Posting Platform',
  description = 'Easiest way to find your next job.',
  url = process.env.NEXT_PUBLIC_BASE_URL,
  image = 'https://secure.gravatar.com/avatar/16468e56307e475c543a356a7f42814d?s=30',
  noindex
}: IProps) => {
  const seoTitle = `${title} - My Career List`.slice(0, 59)

  const { colorScheme } = useMantineColorScheme()

  return (
    <Head>
      <title>{seoTitle}</title>
      <meta name="description" content={stripHtml(description).slice(0, 159)} />

      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={seoTitle} />
      <meta
        property="og:description"
        content={stripHtml(description).slice(0, 159)}
      />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />

      <meta property="twitter:domain" content={url} />
      <meta property="twitter:url" content={url} />
      <meta name="twitter:title" content={seoTitle} />
      <meta
        name="twitter:description"
        content={stripHtml(description).slice(0, 159)}
      />
      <meta name="twitter:image" content={image} />

      {noindex && <meta name="robots" content="noindex" />}

      <meta name="color-scheme" content="light dark" />
      <meta
        name="theme-color"
        content={colorScheme === 'dark' ? '#ffffff' : '#171717'}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredDataWebSite)
        }}
      />
    </Head>
  )
}

export default SEO
