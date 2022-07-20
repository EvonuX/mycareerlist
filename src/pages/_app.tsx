import {
  ColorScheme,
  ColorSchemeProvider,
  Global,
  MantineProvider
} from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import { NotificationsProvider } from '@mantine/notifications'
import { SessionProvider } from 'next-auth/react'
import PlausibleProvider from 'next-plausible'
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import { useState } from 'react'
import {
  Hydrate,
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query'

const NextProgress = dynamic(() => import('next-progress'), {
  ssr: false
})

export default function App(props: AppProps) {
  const {
    Component,
    pageProps: { session, ...pageProps }
  } = props

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false
          }
        }
      })
  )

  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'mcl-color-scheme',
    defaultValue: 'light',
    getInitialValueInEffect: true
  })

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark'))

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <SessionProvider session={session}>
          <ColorSchemeProvider
            colorScheme={colorScheme}
            toggleColorScheme={toggleColorScheme}
          >
            <MantineProvider
              withGlobalStyles
              withNormalizeCSS
              theme={{
                colorScheme,
                colors: {
                  google: ['#DB4437'],
                  facebook: ['#4267B2'],
                  twitter: ['#1DA1F2'],
                  linkedin: ['#0077B5']
                }
              }}
              styles={{
                AppShell: () => ({
                  body: {
                    minHeight: 'calc(100vh - 138px)'
                  }
                })
              }}
            >
              <Global
                styles={theme => ({
                  body: {
                    overflowY: 'scroll',
                    backgroundColor:
                      theme.colorScheme === 'dark'
                        ? theme.colors.dark[8]
                        : theme.fn.lighten(theme.colors.gray[1], 0.7),
                    color:
                      theme.colorScheme === 'dark'
                        ? theme.colors.gray[2]
                        : theme.black
                  }
                })}
              />

              <NotificationsProvider>
                <PlausibleProvider
                  domain="mycareerlist.com"
                  enabled={process.env.NODE_ENV === 'production'}
                  trackLocalhost={false}
                >
                  <NextProgress options={{ showSpinner: false }} />
                  <Component {...pageProps} />
                </PlausibleProvider>
              </NotificationsProvider>
            </MantineProvider>
          </ColorSchemeProvider>
        </SessionProvider>
      </Hydrate>
    </QueryClientProvider>
  )
}
