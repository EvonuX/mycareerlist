import { Badge, Box, Group, Paper, Title } from '@mantine/core'
import Image from 'next/image'
import Link from 'next/link'
import type { FC } from 'react'
import type { Company } from '~/types/types'

interface IProps {
  company: Company
}

const CompanyCard: FC<IProps> = ({ company }) => {
  return (
    <Paper key={company.id} sx={{ textAlign: 'center' }} shadow="xs" p="md">
      <Link href={`/companies/${company.slug}`}>
        <a style={{ textDecoration: 'none', color: 'inherit' }}>
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: 5,
              overflow: 'hidden'
            }}
            mx="auto"
            mb={5}
          >
            <Image
              src={company.logo || 'https://picsum.photos/700/700'}
              alt={company.name}
              layout="fixed"
              width={80}
              height={80}
            />
          </Box>

          <Title
            order={2}
            mb={15}
            sx={{ fontSize: 20, '@media (max-width: 768px)': { fontSize: 18 } }}
          >
            {company.name}
          </Title>

          <Group
            grow
            sx={{
              flexDirection: 'column',

              '@media (min-width: 768px)': {
                margin: '0 24px 0 24px',
                flexDirection: 'row'
              }
            }}
          >
            <Badge
              radius="xs"
              sx={{
                '@media (max-width: 768px)': {
                  maxWidth: '100%',
                  width: '100%'
                }
              }}
            >
              {company._count.jobs} active jobs
            </Badge>

            <Badge
              radius="xs"
              sx={{
                '@media (max-width: 768px)': {
                  maxWidth: '100%',
                  width: '100%'
                }
              }}
            >
              {company._count.reviews} reviews
            </Badge>
          </Group>
        </a>
      </Link>
    </Paper>
  )
}

export default CompanyCard
