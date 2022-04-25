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
import { FC, useState } from 'react'
import dynamic from 'next/dynamic'
import { signOut, useSession } from 'next-auth/react'

const AuthModal = dynamic(() => import('./AuthModal'), {
  ssr: false
})

const Header: FC = () => {
  const router = useRouter()
  const [opened, setOpened] = useState(false)

  const { data } = useSession()

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
              <Menu.Item onClick={() => router.push('/jobs')}>
                View all jobs
              </Menu.Item>

              <Divider />

              {data ? (
                <>
                  <Menu.Item onClick={() => router.push('/account')}>
                    Your account
                  </Menu.Item>

                  {data.userRole === 'EMPLOYER' && (
                    <>
                      <Menu.Item onClick={() => router.push('/jobs/new')}>
                        Create new job post
                      </Menu.Item>

                      <Menu.Item onClick={() => router.push('/companies/new')}>
                        Create new company
                      </Menu.Item>
                    </>
                  )}

                  <Divider />

                  <Menu.Item
                    onClick={() =>
                      signOut({
                        callbackUrl: '/',
                        redirect: true
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
