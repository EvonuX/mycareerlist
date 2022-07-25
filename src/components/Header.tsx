import {
  Button,
  Container,
  Grid,
  Menu,
  Header as MantineHeader,
  Divider,
  Box,
  useMantineColorScheme,
  Text
} from '@mantine/core'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { signOut, useSession } from 'next-auth/react'
import { showNotification } from '@mantine/notifications'
import { NextLink } from '@mantine/next'
import {
  NavigationProgress,
  resetNavigationProgress,
  startNavigationProgress
} from '@mantine/nprogress'

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
        message: (
          <Text
            size="sm"
            onClick={() => setOpened(true)}
            sx={{ cursor: 'pointer' }}
          >
            Only employers can post new jobs. Log in to begin.
          </Text>
        ),
        color: 'yellow'
      })
    }
  }, [router.query])

  useEffect(() => {
    const handleStart = (url: string) =>
      url !== router.asPath && startNavigationProgress()
    const handleComplete = () => resetNavigationProgress()

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.asPath])

  return (
    <MantineHeader
      height="auto"
      mb="md"
      sx={theme => ({ boxShadow: theme.shadows.xs })}
    >
      <NavigationProgress />

      <Container size="xl">
        <Grid columns={2} align="center" py={0} grow>
          <Grid.Col span={1} py="md">
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

          <Grid.Col span={1} py="md" sx={{ textAlign: 'right' }}>
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
                // @ts-ignore
                <Menu ml="sm" position="bottom-end">
                  <Menu.Target>
                    <Button variant="default">Menu</Button>
                  </Menu.Target>

                  <Menu.Dropdown>
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

                    <Menu.Divider />

                    <Menu.Item
                      onClick={() =>
                        signOut({
                          callbackUrl: '/'
                        })
                      }
                    >
                      Logout
                    </Menu.Item>
                  </Menu.Dropdown>
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
              // @ts-ignore
              sx={{
                '@media screen and (min-width: 768px)': {
                  display: 'none'
                }
              }}
            >
              <Menu.Target>
                <Button variant="default">Menu</Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item component={NextLink} href="/jobs">
                  View all jobs
                </Menu.Item>

                <Menu.Item component={NextLink} href="/companies">
                  View all companies
                </Menu.Item>

                <Menu.Divider />

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

                    <Menu.Divider />

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
              </Menu.Dropdown>
            </Menu>
          </Grid.Col>
        </Grid>
      </Container>

      <AuthModal opened={opened} setOpened={setOpened} />
    </MantineHeader>
  )
}

export default Header
