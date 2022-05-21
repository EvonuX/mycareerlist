import { Badge, Box, Group, Paper, Text } from '@mantine/core'
import Image from 'next/image'
import Link from 'next/link'
import type { FC } from 'react'
import type { Company } from '~/types/types'
import noImage from '../../public/no-image.png'

interface IProps {
  company: Company
}

const CompanyCard: FC<IProps> = ({ company }) => {
  return (
    <Link href={`/companies/${company.slug}`} passHref>
      <Paper component="a" sx={{ textAlign: 'center' }} shadow="xs" p="md">
        <Box
          sx={{
            backgroundColor: '#fff',
            width: 80,
            height: 80,
            borderRadius: 5,
            overflow: 'hidden'
          }}
          mx="auto"
          mb={5}
        >
          <Image
            src={company.logo || noImage}
            alt={company.name}
            layout="fixed"
            width={80}
            height={80}
            objectFit="contain"
          />
        </Box>

        <Text
          size="lg"
          weight="bold"
          mb="md"
          sx={{
            fontSize: 20,
            '@media (max-width: 768px)': { fontSize: 18 }
          }}
        >
          {company.name}
        </Text>

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
      </Paper>
    </Link>
  )
}

export default CompanyCard
