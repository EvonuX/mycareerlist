import {
  ActionIcon,
  Box,
  Button,
  Footer as MantineFooter,
  SimpleGrid,
  useMantineColorScheme
} from '@mantine/core'
import { NextLink } from '@mantine/next'

const Footer = () => {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme()
  const isDarkTheme = colorScheme === 'dark'

  return (
    <MantineFooter height="auto" p="sm" mt="md">
      <SimpleGrid cols={2} sx={{ alignItems: 'center' }}>
        <ActionIcon
          variant="transparent"
          onClick={() => toggleColorScheme()}
          title="Toggle color scheme"
        >
          {isDarkTheme ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
        </ActionIcon>

        <Box sx={{ justifySelf: 'flex-end' }}>
          <Button component={NextLink} href="/contact" variant="subtle" compact>
            Contact
          </Button>
        </Box>
      </SimpleGrid>
    </MantineFooter>
  )
}

export default Footer
