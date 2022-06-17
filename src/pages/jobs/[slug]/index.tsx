import {
  Badge,
  Box,
  Button,
  Grid,
  Group,
  Paper,
  SimpleGrid,
  Text,
  Title,
  TypographyStylesProvider
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import axios from 'axios'
import type { GetServerSideProps, NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { usePlausible } from 'next-plausible'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import JobCard from '~/components/JobCard'
import Layout from '~/components/Layout'
import SEO from '~/components/SEO'
import ShareButtons from '~/components/ShareButtons'
import type { Job } from '~/types/types'
import { formatDate, getCategory, getLocation, getType } from '~/utils/helpers'
import prisma from '~/utils/prisma'

const Newsletter = dynamic(() => import('~/components/Newsletter'), {
  ssr: false
})

interface IProps {
  job: Job
  relatedJobs: Job[]
}

const JobPage: NextPage<IProps> = ({ job, relatedJobs }) => {
  const plausible = usePlausible()

  const { data: user } = useSession()
  const [jobSaved, setJobSaved] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      setJobSaved(false)
      return
    }

    const isSaved = !!!job.savedBy.find(
      (s: { id: string }) => s.id === user.userId
    )

    setJobSaved(isSaved)
  }, [job, user])

  const handleSave = async () => {
    if (!user) {
      showNotification({
        title: 'You need to be logged in to save jobs',
        message:
          'Only logged in users can save jobs, log in to save this job post'
      })

      return
    }

    if (user?.userRole !== 'USER') {
      showNotification({
        title: 'Employers cannot save jobs',
        message: ''
      })

      return
    }

    setLoading(true)

    try {
      await axios.put('/api/job', {
        slug: job.slug,
        save: jobSaved
      })

      plausible('job-save', {
        props: {
          job: `${job.title} - ${job.company.name}`
        }
      })

      const title = jobSaved ? 'Job saved' : 'Job no longer saved'
      const message = jobSaved ? 'You can now find it in your account' : ''

      showNotification({
        title,
        message,
        color: jobSaved ? 'green' : 'blue',
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )
      })

      setJobSaved(!jobSaved)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const applicationLink = `${job.applyLink}?ref=mycareerlist`

  return (
    <Layout>
      <SEO
        title={`${job.title} at ${job.company.name}`}
        description={job.description ?? ''}
        image={job.company.logo ?? ''}
        url={`/jobs/${job.slug}`}
      />

      <Grid>
        <Grid.Col md={9}>
          <Title order={1} mb="lg">
            {job.title}
          </Title>

          <Group mb="sm">
            <Badge radius="xs">{getLocation(job.city, job.location)}</Badge>
            <Badge radius="xs">{getType(job.type)}</Badge>
            <Badge radius="xs">{getCategory(job.category)}</Badge>

            {job.salaryRange && job.salaryRange !== '0' && (
              <Badge color="green" radius="xs">
                {job.salaryRange}
              </Badge>
            )}
          </Group>

          {job.createdAt && (
            <Text color="dimmed" size="xs">
              Posted on: {job.createdAt}
            </Text>
          )}

          <TypographyStylesProvider
            sx={theme => ({
              a: {
                color: `${theme.colors.blue[6]} !important`
              }
            })}
          >
            <Text
              dangerouslySetInnerHTML={{ __html: job.description as string }}
              sx={{ wordBreak: 'break-word' }}
            />
          </TypographyStylesProvider>

          <Button
            component="a"
            href={applicationLink}
            target="_blank"
            mb="xl"
            size="md"
            onClick={(e: any) => {
              e.preventDefault()

              plausible('job-application', {
                props: {
                  title: `${job.title} - ${job.company.name}`
                }
              })

              // @ts-ignore
              window.open(e.currentTarget.href, '_blank').focus()
            }}
          >
            Apply for this job
          </Button>

          <Title mb="sm" order={3}>
            Share this job
          </Title>

          <ShareButtons
            title={`${job.title} at ${job.company.name}`}
            url={`/jobs/${job.slug}`}
          />
        </Grid.Col>

        <Grid.Col md={3}>
          <Box
            sx={{
              textAlign: 'center',
              position: 'sticky',
              top: 20
            }}
          >
            <Paper shadow="xs" p="md">
              <Box
                sx={{
                  backgroundColor: '#fff',
                  width: 100,
                  height: 100,
                  overflow: 'hidden',
                  borderRadius: 5
                }}
                mx="auto"
                mb="md"
              >
                <Image
                  src={job.company.logo || '/no-image.png'}
                  alt={job.title}
                  layout="fixed"
                  width={100}
                  height={100}
                  objectFit="contain"
                />
              </Box>

              <Title order={2} mb="md">
                {job.company.name}
              </Title>

              <Group align="center" direction="column" mb="md">
                <Badge radius="xs" variant="outline">
                  {job.company._count.jobs} active jobs
                </Badge>
                <Badge radius="xs" variant="outline">
                  {job.company._count.reviews} reviews
                </Badge>
              </Group>

              <Group direction="column" grow mx="xl">
                <Link href={`/companies/${job.company.slug}`} passHref>
                  <Button variant="light">View Company Profile</Button>
                </Link>

                {job.company.website && (
                  <Button
                    variant="light"
                    component="a"
                    href={job.company.website}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Website
                  </Button>
                )}
              </Group>
            </Paper>

            <Group mt="md" grow>
              <Button
                component="a"
                href={applicationLink}
                target="_blank"
                onClick={(e: any) => {
                  e.preventDefault()

                  plausible('job-application', {
                    props: {
                      title: `${job.title} - ${job.company.name}`
                    }
                  })

                  // @ts-ignore
                  window.open(e.currentTarget.href, '_blank').focus()
                }}
              >
                Apply for job
              </Button>

              <Button variant="outline" loading={loading} onClick={handleSave}>
                {!user ? 'Save job' : jobSaved ? 'Save job' : 'Unsave job'}
              </Button>
            </Group>
          </Box>
        </Grid.Col>
      </Grid>

      <Title order={3} mb={15} mt={25}>
        Related jobs
      </Title>

      <SimpleGrid cols={1} breakpoints={[{ minWidth: 480, cols: 2 }]}>
        {relatedJobs.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
      </SimpleGrid>

      <Newsletter />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  res,
  params
}) => {
  if (!params || !params.slug) {
    return {
      notFound: true
    }
  }

  const job = await prisma.job.findUnique({
    where: {
      slug: params.slug as string
    },
    select: {
      title: true,
      description: true,
      slug: true,
      category: true,
      type: true,
      applyLink: true,
      location: true,
      city: true,
      expired: true,
      salaryRange: true,
      createdAt: true,
      savedBy: {
        select: {
          id: true
        }
      },
      company: {
        select: {
          id: true,
          name: true,
          logo: true,
          website: true,
          slug: true,
          _count: true
        }
      }
    }
  })

  if (!job || job.expired) {
    return {
      notFound: true
    }
  }

  const relatedJobs = await prisma.job.findMany({
    take: 6,
    where: {
      category: {
        equals: job.category
      },
      slug: {
        not: {
          equals: job.slug
        }
      },
      expired: {
        not: true
      },
      draft: {
        not: true
      }
    },
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      type: true,
      location: true,
      city: true,
      company: {
        select: {
          id: true,
          name: true,
          logo: true
        }
      }
    }
  })

  res.setHeader('Cache-Control', `s-maxage=1000000, stale-while-revalidate`)

  return {
    props: {
      job: {
        ...job,
        createdAt: formatDate(job.createdAt)
      },
      relatedJobs
    }
  }
}

export default JobPage
