import {
  Box,
  Container,
  SimpleGrid,
  Tabs,
  Text,
  ThemeIcon,
  Title
} from '@mantine/core'

const userFeatures = [
  {
    icon: (
      <Box
        component="svg"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        width="20"
        height="20"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </Box>
    ),
    title: 'Your personal job feed',
    description: 'Find positions that match your skills and interests'
  },
  {
    icon: (
      <Box
        component="svg"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        width="20"
        height="20"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </Box>
    ),
    title: 'Save jobs, apply later',
    description:
      'Want to prepare before you apply? You can save a job post and find it at any time'
  },
  {
    icon: (
      <Box
        component="svg"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        width="20"
        height="20"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </Box>
    ),
    title: 'Powerful search',
    description:
      'You can search for jobs by title, location, category, and type'
  },
  {
    icon: (
      <Box
        component="svg"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        width="20"
        height="20"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </Box>
    ),
    title: 'Get company insight',
    description:
      'Find out about the company, its interview experience, salaries, and more'
  }
]

const employerFeatures = [
  {
    icon: (
      <Box
        component="svg"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        width="20"
        height="20"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </Box>
    ),
    title: 'Enhanced visibility',
    description:
      'Make your job featured and be seen on Slack, Twitter, and our newsletter! Your posting will also be outlined on our website'
  },
  {
    icon: (
      <Box
        component="svg"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        width="20"
        height="20"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </Box>
    ),
    title: 'Insights',
    description: 'Receive daily updates for each job posting'
  },
  {
    icon: (
      <Box
        component="svg"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        width="20"
        height="20"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
        />
      </Box>
    ),
    title: 'Too busy? We can do the heavy lifting',
    description:
      "Filter out candidates that don't match your job requirements, automatically"
  },
  {
    icon: (
      <Box
        component="svg"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        width="20"
        height="20"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </Box>
    ),
    title: 'Stand out and receive even more applicants',
    description:
      'Feeling confident? Users can submit company reviews, interview experiences, and salaries'
  }
]

const Features = () => {
  return (
    <Container my={60}>
      <Title order={2} align="center" mb="xl">
        Why choose My Career List?
      </Title>

      <Tabs variant="pills" position="center">
        <Tabs.Tab label="Job seekers">
          <SimpleGrid
            my="xl"
            cols={3}
            spacing="xl"
            breakpoints={[
              { maxWidth: 980, cols: 2 },
              { maxWidth: 755, cols: 1 }
            ]}
          >
            {userFeatures.map(feature => {
              return (
                <Box key={feature.title}>
                  <ThemeIcon variant="light" size={40} radius={50} mb="sm">
                    {feature.icon}
                  </ThemeIcon>

                  <Text mb="sm">{feature.title}</Text>

                  <Text size="sm" color="dimmed" style={{ lineHeight: 1.6 }}>
                    {feature.description}
                  </Text>
                </Box>
              )
            })}
          </SimpleGrid>
        </Tabs.Tab>

        <Tabs.Tab label="Employers">
          <SimpleGrid
            my="xl"
            cols={3}
            spacing="xl"
            breakpoints={[
              { maxWidth: 980, cols: 2 },
              { maxWidth: 755, cols: 1 }
            ]}
          >
            {employerFeatures.map(feature => {
              return (
                <Box key={feature.title}>
                  <ThemeIcon variant="light" size={40} radius={50} mb="sm">
                    {feature.icon}
                  </ThemeIcon>

                  <Text mb="sm">{feature.title}</Text>

                  <Text size="sm" color="dimmed" style={{ lineHeight: 1.6 }}>
                    {feature.description}
                  </Text>
                </Box>
              )
            })}
          </SimpleGrid>
        </Tabs.Tab>
      </Tabs>
    </Container>
  )
}

export default Features
