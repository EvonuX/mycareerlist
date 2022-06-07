import {
  Alert,
  Box,
  List,
  Paper,
  SimpleGrid,
  Switch,
  Text,
  Title
} from '@mantine/core'
import { showNotification } from '@mantine/notifications'
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import axios from 'axios'
import type { GetServerSideProps, NextPage } from 'next'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Layout from '~/components/Layout'
import SEO from '~/components/SEO'
import type { Job } from '~/types/types'
import prisma from '~/utils/prisma'

interface IProps {
  job: Job
}

const Tokens: NextPage<IProps> = ({ job }) => {
  const router = useRouter()

  const [total, setTotal] = useState('0')
  const [checked, setChecked] = useState(false)

  return (
    <Layout>
      <SEO title="Payment" noindex />

      <Title order={1} mb="xl" align="center">
        Complete the payment in order to make the job posting live
      </Title>

      <SimpleGrid
        cols={2}
        breakpoints={[{ maxWidth: 768, cols: 1 }]}
        spacing="xl"
        sx={{ alignItems: 'flex-start' }}
      >
        <Paper p="xs" shadow="sm">
          <Text mb="sm">
            After the payment is complete the job will be visible to everyone
            and you&lsquo;ll start receiving applicants.
          </Text>

          <Alert
            title="Want to boost visibility and receive more candidates?"
            mb="md"
            styles={{
              title: {
                fontSize: 16
              }
            }}
          >
            <Text mb="xs">
              Make the job featured{' '}
              <Text component="span" sx={{ textDecoration: 'line-through' }}>
                , for an extra $50
              </Text>
              !
            </Text>

            <List>
              <List.Item>
                Highlighted post on the homepage and the job listing page
              </List.Item>

              <List.Item>
                Be featured in our weekly newsletter, Slack and Twitter
              </List.Item>
            </List>
          </Alert>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Switch
              checked={checked}
              size="md"
              label="Make job featured?"
              onChange={event => {
                setChecked(event.currentTarget.checked)

                if (event.currentTarget.checked) {
                  setTotal('0')
                } else {
                  setTotal('0')
                }
              }}
            />
          </Box>

          <Box mt="xl" sx={{ display: 'flex', alignItems: 'center' }}>
            <Text mr="sm">Total:</Text>

            <Text weight="bold" size="lg">
              ${total}
            </Text>
          </Box>
        </Paper>

        <PayPalScriptProvider
          options={{
            'client-id': process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
            components: 'buttons',
            currency: 'USD'
          }}
        >
          <PayPalButtons
            style={{ layout: 'vertical', color: 'black' }}
            forceReRender={[total]}
            createOrder={async (_data, actions) => {
              return await actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      currency_code: 'USD',
                      value: total
                    }
                  }
                ]
              })
            }}
            onApprove={async (_data, actions) => {
              if (!actions.order) {
                throw new Error('No order')
              }

              try {
                const details = await actions.order.capture()

                await axios.post('/api/payment', {
                  ...details,
                  job,
                  total,
                  featured: checked
                })

                showNotification({
                  title: 'Success!',
                  message: 'Job post is now live',
                  color: 'green'
                })

                router.push(`/jobs/${job.slug}`)
              } catch (err: any) {
                showNotification({
                  title: 'Payment failed',
                  message:
                    'The job has been saved as a draft and can be viewed in your account page.',
                  color: 'red'
                })
              }
            }}
          />
        </PayPalScriptProvider>
      </SimpleGrid>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req
}) => {
  const session = await getSession({ req })

  if (!session || session.userRole !== 'EMPLOYER') {
    return {
      redirect: {
        destination: '/?noPermissions=true',
        permanent: false
      }
    }
  }

  const job = await prisma.job.findUnique({
    where: {
      slug: params?.slug as string
    },
    select: {
      id: true,
      slug: true,
      draft: true,
      featured: true,
      userId: true
    }
  })

  if (!job) {
    return {
      notFound: true
    }
  }

  if (job.userId !== session.userId) {
    return {
      redirect: {
        destination: '/?noPermissions=true',
        permanent: false
      }
    }
  }

  if (!job.draft && process.env.NODE_ENV === 'production') {
    return {
      redirect: {
        destination: `/job/${job.slug}?draft=false`,
        permanent: false
      }
    }
  }

  return {
    props: {
      job
    }
  }
}

export default Tokens
