import {
  Button,
  Container,
  Grid,
  Menu,
  Header as MantineHeader,
  Divider
} from '@mantine/core'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { FC, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { signOut, useSession } from 'next-auth/react'
import { showNotification } from '@mantine/notifications'
import { NextLink } from '@mantine/next'

const AuthModal = dynamic(() => import('./AuthModal'), {
  ssr: false
})

const Header: FC = () => {
  const router = useRouter()
  const [opened, setOpened] = useState(false)

  const { data } = useSession()

  useEffect(() => {
    if (router.query.noPermissions) {
      showNotification({
        title: "You don't have access to this page",
        message:
          'Only employers can post new jobs. Create an account to start posting jobs.',
        color: 'yellow'
      })
    }

    if (router.query.notFound) {
      showNotification({
        title: 'This page was not found',
        message: 'Make sure to check your URL',
        color: 'yellow'
      })
    }
  }, [router.query])

  return (
    <MantineHeader
      height="auto"
      mb="md"
      sx={theme => ({ boxShadow: theme.shadows.xs })}
    >
      <Container size="xl">
        <Grid columns={2} justify="space-between" align="center" py="md">
          <Grid.Col span={1} py={0}>
            <Link href="/" passHref>
              <Button variant="default" component="a">
                Logo
              </Button>
            </Link>
          </Grid.Col>

          <Grid.Col span={1} py={0} sx={{ textAlign: 'right' }}>
            <Menu
              title="menu"
              menuButtonLabel="menu"
              placement="end"
              control={<Button variant="default">Menu</Button>}
            >
              <Menu.Item component={NextLink} href="/jobs">
                View all jobs
              </Menu.Item>

              <Menu.Item component={NextLink} href="/companies">
                View all companies
              </Menu.Item>

              <Divider />

              {data ? (
                <>
                  <Menu.Item component={NextLink} href="/account">
                    Your account
                  </Menu.Item>

                  {data.userRole === 'EMPLOYER' && (
                    <>
                      <Menu.Item component={NextLink} href="/jobs/new">
                        Create new job post
                      </Menu.Item>

                      <Menu.Item component={NextLink} href="/companies/new">
                        Create new company
                      </Menu.Item>
                    </>
                  )}

                  <Divider />

                  <Menu.Item
                    onClick={() =>
                      signOut({
                        callbackUrl: '/'
                      })
                    }
                  >
                    Logout
                  </Menu.Item>
                </>
              ) : (
                <Menu.Item onClick={() => setOpened(true)}>Log in</Menu.Item>
              )}
            </Menu>
          </Grid.Col>
        </Grid>
      </Container>

      <AuthModal opened={opened} setOpened={setOpened} />
    </MantineHeader>
  )
}

export default Header
