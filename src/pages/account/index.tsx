import { Center, Loader } from '@mantine/core'
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'

const EmployerAccountPage = dynamic(
  () => import('~/components/EmployerAccountPage')
)
const UserAccountPage = dynamic(() => import('~/components/UserAccountPage'))

const AccountPage = () => {
  const router = useRouter()

  const { data, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/')
    }
  })

  if (status === 'loading') {
    return (
      <Center mt="xl">
        <Loader variant="bars" />
      </Center>
    )
  }

  if (data.userRole === 'USER') {
    return <UserAccountPage />
  } else if (data.userRole === 'EMPLOYER') {
    return <EmployerAccountPage />
  } else {
    return null
  }
}

export default AccountPage
