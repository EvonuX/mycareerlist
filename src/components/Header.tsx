import {
  Button,
  Container,
  Grid,
  Menu,
  Header as MantineHeader,
  Divider,
  Box,
  useMantineColorScheme
} from '@mantine/core'
import { useRouter } from 'next/router'
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
  const { colorScheme } = useMantineColorScheme()

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
        <Grid columns={2} align="center" py="md" grow>
          <Grid.Col span={1} py={0}>
            <Button
              variant="subtle"
              component={NextLink}
              href="/"
              color={colorScheme === 'dark' ? 'gray' : 'dark'}
              title="Home"
            >
              My Career List
            </Button>
          </Grid.Col>

          <Grid.Col span={1} py={0} sx={{ textAlign: 'right' }}>
            <Box
              sx={{
                '@media screen and (max-width: 768px)': {
                  display: 'none'
                }
              }}
            >
              <Button
                color="white"
                variant={router.pathname === '/jobs' ? 'light' : 'subtle'}
                component={NextLink}
                href="/jobs"
              >
                View all jobs
              </Button>

              <Button
                color="white"
                variant={router.pathname === '/companies' ? 'light' : 'subtle'}
                component={NextLink}
                href="/companies"
                ml="sm"
              >
                View all companies
              </Button>

              {data ? (
                <Menu
                  title="menu"
                  menuButtonLabel="menu"
                  placement="end"
                  control={<Button variant="default">Menu</Button>}
                  ml="sm"
                >
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
                </Menu>
              ) : (
                <Button
                  variant="default"
                  ml="sm"
                  onClick={() => setOpened(true)}
                >
                  Log in
                </Button>
              )}
            </Box>

            <Menu
              title="menu"
              menuButtonLabel="menu"
              placement="end"
              control={<Button variant="default">Menu</Button>}
              sx={{
                '@media screen and (min-width: 768px)': {
                  display: 'none'
                }
              }}
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
