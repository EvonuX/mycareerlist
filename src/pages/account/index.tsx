import { Center, Loader } from '@mantine/core'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import EmployerAccountPage from '~/components/EmployerAccountPage'
import UserAccountPage from '~/components/UserAccountPage'

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
      <Center>
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
