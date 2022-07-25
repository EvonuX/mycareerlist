import { AppShell, Container } from '@mantine/core'
import { FC, ReactNode } from 'react'
import Footer from './Footer'
import Header from './Header'

interface IProps {
  children: ReactNode
}

const Layout: FC<IProps> = ({ children }) => {
  return (
    <AppShell fixed={false} header={<Header />} footer={<Footer />} padding={0}>
      <Container size="xl">{children}</Container>
    </AppShell>
  )
}

export default Layout
