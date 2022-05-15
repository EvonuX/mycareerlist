import { Badge, Box, Group, Paper, Text } from '@mantine/core'
import Image from 'next/image'
import Link from 'next/link'
import type { FC } from 'react'
import type { Job } from '~/types/types'
import { getCategory, getLocation, getType } from '~/utils/helpers'

interface IProps {
  job: Job
}

const JobCard: FC<IProps> = ({ job }) => {
  return (
    <Paper p="xs" shadow="xs" sx={{ position: 'relative' }}>
      <Link href={`/jobs/${job.slug}`} passHref>
        <Box
          component="a"
          sx={{
            display: 'flex',
            cursor: 'pointer',
            alignItems: 'center',
            textDecoration: 'none',
            color: 'inherit'
          }}
        >
          <Box
            sx={{
              height: 75,
              width: 75,
              position: 'relative',
              borderRadius: 5,
              overflow: 'hidden',
              backgroundColor: '#fff'
            }}
          >
            <Image
              src={job.company.logo || 'https://picsum.photos/700/700'}
              alt={job.company.name}
              layout="fixed"
              width={75}
              height={75}
              objectFit="contain"
            />
          </Box>

          <Box
            p={0}
            ml="sm"
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              flexDirection: 'column'
            }}
          >
            <Box>
              <Text size="lg" weight="bold">
                {job.title}
              </Text>

              <Text mb="xs">
                at {job.company.name} &bull;{' '}
                {getLocation(job.city, job.location)}
              </Text>
            </Box>

            <Group>
              <Badge radius="xs">{getType(job.type)}</Badge>

              <Badge radius="xs">{getCategory(job.category)}</Badge>
            </Group>
          </Box>
        </Box>
      </Link>

      {job.featured && (
        <Badge
          variant="filled"
          radius={0}
          sx={{ position: 'absolute', right: 0, top: 0 }}
        >
          Featured
        </Badge>
      )}
    </Paper>
  )
}

export default JobCard
