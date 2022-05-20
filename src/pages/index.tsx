import {
  Box,
  Button,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { NextLink } from '@mantine/next'
import type { GetServerSideProps, NextPage } from 'next'
import dynamic from 'next/dynamic'
import CompanyCard from '~/components/CompanyCard'
import JobCard from '~/components/JobCard'
import ReviewItem from '~/components/ReviewItem'
import SEO from '~/components/SEO'
import type { Company, Job, Review } from '~/types/types'
import prisma from '~/utils/prisma'
import Layout from '~/components/Layout'

const Newsletter = dynamic(() => import('~/components/Newsletter'), {
  ssr: false
})

interface IProps {
  jobs: Job[]
  companies: Company[]
  reviews: Review[]
}

const Home: NextPage<IProps> = ({ jobs, companies, reviews }) => {
  const matches = useMediaQuery('(max-width: 768px)')

  return (
    <Layout>
      <SEO title="My Career List" />

      <SimpleGrid
        cols={2}
        breakpoints={[{ maxWidth: 480, cols: 1 }]}
        sx={{ alignItems: 'center' }}
        mb="xl"
      >
        <Box
          sx={{
            '@media screen and (max-width: 480px)': { textAlign: 'center' }
          }}
        >
          <Title order={1} mb="md" sx={{ maxWidth: 500 }}>
            The top modern job board for careers all over the globe.
          </Title>

          <Text mb="lg">
            We help companies find their perfect candidate, in a few quick and
            easy steps.
          </Text>

          <Group grow={matches}>
            <Button component={NextLink} href="/jobs/new">
              Post a job for $100
            </Button>

            <Button variant="light" component={NextLink} href="/jobs">
              View all jobs
            </Button>
          </Group>
        </Box>

        <Box
          component="svg"
          xmlns="http://www.w3.org/2000/svg"
          width="400"
          height="400"
          viewBox="0 0 833.22212 633.11008"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          sx={{
            marginInline: 'auto',
            '@media screen and (max-width: 480px)': {
              display: 'none'
            }
          }}
        >
          <rect
            x="159.66474"
            y="466.77221"
            width="145"
            height="51"
            rx="25.49997"
            fill="#3f3d56"
          />
          <path
            d="M434.05368,638.21717v42.43a125.55316,125.55316,0,0,1-29-.56v-41.87Z"
            transform="translate(-183.38894 -133.44496)"
            fill="#3f3d56"
          />
          <path
            d="M531.67368,653.81715c-.79.11-1.57.22-2.36.35-31.6,5.06-60.44,22.12-92.18,26.14-1.03.13-2.05.25-3.08.34-.44.04-.88.09-1.32.12-7.75-7.59-15.5-15.67-22.78-24.04-3.95-4.53-7.77-9.15-11.36005-13.83-9.32-12.08-17.22-24.5-22.44-36.7.53-5.85-3.11-19.38-4.85-29.74l-.01-.01c-.74-4.35-1.14-8.13-.77-10.56,2.12006-14.02,13.57-12.41,17.09-26.15a77.49954,77.49954,0,0,1,10.11-7.11c.59-.35,1.19-.7,1.81-1.05l38.2-26.4,14.6,14.32,22.22,21.8,24.08,23.61005-20.44,20.65s17.07995,19.69,37.05,45.94C520.60367,638.54713,526.17368,646.07716,531.67368,653.81715Z"
            transform="translate(-183.38894 -133.44496)"
            fill="#2f2e41"
          />
          <path
            d="M861.05368,638.21717v122.47a132.151,132.151,0,0,1-29,5.61v-128.08Z"
            transform="translate(-183.38894 -133.44496)"
            fill="#3f3d56"
          />
          <rect
            x="595.66474"
            y="494.77221"
            width="145"
            height="51"
            rx="25.49997"
            fill="#3f3d56"
          />
          <path
            d="M669.89371,693.97718q-7.57508-4.59-15.41-8.97c-.64-.35-1.28-.71-1.92-1.06l3.44-1.47,9.28-3.99.09-.04.1.34Z"
            transform="translate(-183.38894 -133.44496)"
            fill="#ffb6b6"
          />
          <path
            d="M684.2637,702.87715c-1.65-1.05-3.29-2.08-4.94-3.1h-.01q-3.99-2.505-8-4.94c-.47-.29-.94-.57-1.42-.86q-7.57508-4.59-15.41-8.97c-.64-.35-1.28-.71-1.92-1.06a337.75842,337.75842,0,0,0-31.12-15.23c-6.98005-2.94-14.05-5.59-21.19-7.85h-.01l-5.61-9.39-25.25-42.29-5.55-9.29s-18.93005,5.6-45.72,10.97c-9.75,1.96-20.53,3.88-31.84,5.5-12.09,1.72-24.77,3.09-37.37,3.75-6.01.32-12,.48-17.9.43-15.25-.1-29.9-1.53-42.73-4.93-4.28-4.02-17.18-9.49-26.42-14.5h-.01c-3.88-2.1-7.1-4.11-8.79-5.9-9.74-10.3-1.42-18.33-10.08-29.57a78.01753,78.01753,0,0,1,.63-12.34c.09-.68.18-1.37.29-2.07l2.73-46.36,20.28-2.68,30.86-4.08,33.43-4.42,3.68,28.82s26.03-1.32,59.01-.88c52.97.72,123.85,6,133.45,28.66.9,2.13,1.8,4.28,2.7,6.43q3.21,7.70994,6.36005,15.5c7.61,18.8,14.87,37.78,21.5,55.72,4.12,11.16,8,21.92,11.56994,31.99,2.87006,8.1,5.53,15.76,7.96,22.81,2.22,6.44,4.23,12.37,6.02,17.69C683.72366,701.26716,683.99368,702.08717,684.2637,702.87715Z"
            transform="translate(-183.38894 -133.44496)"
            fill="#2f2e41"
          />
          <path
            d="M497.708,421.98972l-64.05525-54.40133,41.675-42.17691,29.075,47.62305,107.774,21.36695a20.90017,20.90017,0,1,1-2.96957,30.67819Z"
            transform="translate(-183.38894 -133.44496)"
            fill="#a0616a"
          />
          <path
            d="M377.04235,296.09186c-7.40272,24.08263,63.09957,81.52,63.09957,81.52.78339-5.78164,40.75579,44.07344,43.4754,39.55842,7.72908-12.83228,16.2337-44.55195,25.15668-48.606,5.10285-2.31848-24.17069-34.54346-24.17069-34.54346s-14.93261-19.756-34.6486-44.79433a53.41188,53.41188,0,0,0-47.084-20.96122S384.44509,272.00927,377.04235,296.09186Z"
            transform="translate(-183.38894 -133.44496)"
            fill="#3f3d56"
          />
          <circle cx="224.82523" cy="66.00911" r="43.32403" fill="#a0616a" />
          <path
            d="M429.87619,271.41226c9.33357,5.54889,14.91693,15.74413,18.122,26.1187a247.51563,247.51563,0,0,1,10.63632,59.137l3.3853,60.08943,41.92648,127.94729c-36.3363,30.746-172.919,6.98768-172.919,6.98768s-4.19264-1.3974,0-5.59019,8.27421-.47818,4.08162-4.67087-1.3024.47819.0952-3.7145,0-1.3974-1.39755-2.79509,10.81911-13.97556,10.81911-13.97556L333.44532,447.5033,319.46986,299.36313c16.77065-20.96323,50.49849-33.3209,50.49849-33.3209l8.71485-15.68672,43.57423,3.48593Z"
            transform="translate(-183.38894 -133.44496)"
            fill="#3f3d56"
          />
          <path
            d="M443.928,176.43671a20.07763,20.07763,0,0,1,7.13274,10.01951,141.01837,141.01837,0,0,0,.09279-19.65944c-.51064-4.60083-3.74974-5.63572-7.50039-6.83487-3.38718-1.0834-7.21783-2.30721-8.24844-6.77356-13.61863-13.24844-37.32575-12.58037-53.55037-7.95911-8.9276,2.543-14.0646,5.81022-14.52418,7.7242l-.09529.394-.36256.18128c-6.88167,3.44083-8.22124,14.30631-8.13272,22.8152.16765,16.03141,5.70292,34.239,8.8212,35.7181.1651.07829.20679.04764.27828-.0119h0c4.6953-3.75234,10.4238.28515,12.94119,2.48a45.05892,45.05892,0,0,1,40.34614-38.21931,70.7027,70.7027,0,0,0,9.72421-1.63058,20.47249,20.47249,0,0,1,4.96762-.6519A14.13716,14.13716,0,0,1,443.928,176.43671Z"
            transform="translate(-183.38894 -133.44496)"
            fill="#2f2e41"
          />
          <path
            d="M389.33783,487.26235,376.085,480.475a3.63228,3.63228,0,0,1,3.27636-6.39728l13.25279,6.78739a3.63228,3.63228,0,0,1-3.27636,6.39728Z"
            transform="translate(-183.38894 -133.44496)"
            fill="#6c63ff"
          />
          <path
            d="M344.735,469.078l-21.80115-81.16214,58.25865-11.0284-3.13289,55.7091,76.54694,78.81836A20.90017,20.90017,0,1,1,434.732,534.97276Z"
            transform="translate(-183.38894 -133.44496)"
            fill="#a0616a"
          />
          <path
            d="M316.97223,296.91613c-19.77507,15.61152,5.60629,102.93512,5.60629,102.93512,3.9297-4.31264,8.49619,59.425,13.29948,57.25472,13.65136-6.16814,38.67257-27.43807,48.3187-25.70436,5.51648.99153-.26308-42.15927-.26308-42.15927s-1.063-24.74173-3.06092-56.54811a53.412,53.412,0,0,0-26.83569-44.0014S336.74735,281.3047,316.97223,296.91613Z"
            transform="translate(-183.38894 -133.44496)"
            fill="#3f3d56"
          />
          <path
            d="M1002.3837,520.45716l-791.42-.9a297.4536,297.4536,0,0,1-11.82995-28.93l784.47.83A127.18525,127.18525,0,0,1,1002.3837,520.45716Z"
            transform="translate(-183.38894 -133.44496)"
            fill="#3f3d56"
          />
          <path
            d="M750.31369,730.27717q-6.135,2.97-12.38,5.73c-6.92-3.93-13.76-8.04-20.56-12.24l25.22-11.08Z"
            transform="translate(-183.38894 -133.44496)"
            fill="#ffb6b6"
          />
          <path
            d="M934.1937,592.47718q-6.15006,8.25-12.69,16.17-6.03,7.305-12.38,14.33c-1.75,1.94-3.52,3.87-5.33,5.78q-4.995,5.355-10.21,10.53c-6.26,1.97-18.94,5.44-32.53,8.68-9.89,2.35-20.26,4.58-29,6a104.48641,104.48641,0,0,1-14.81,1.58c-5.9.05-11.89-.11-17.9-.43-6.78-.36-13.57-.92-20.28-1.64-17.45-1.83-34.35-4.68-48.93-7.61-5.34-1.06-10.36005-2.14-14.98-3.19-8.75-1.97-16.06995-3.81-21.37-5.21-5.97-1.56-9.37-2.57-9.37-2.57l-14.95,25.04-7.75994,12.99-5.7,9.55-1.52,2.53c-.64-.35-1.28-.71-1.92-1.06a337.75842,337.75842,0,0,0-31.12-15.23c-6.98005-2.94-14.05-5.59-21.19-7.85h-.01c-2.73-.86-5.47-1.67-8.22-2.41q1.29008-3.465,2.61005-6.98,2.45992-6.555,5.02-13.23c3.69-9.63995,7.51-19.42,11.44-29.15,3.22-7.99,6.5-15.95,9.82-23.8,1.53-3.62,4.64-6.8,8.99-9.59a52.32312,52.32312,0,0,1,6.49005-3.48c12.44995-5.67,30.79-9.36,51-11.73,1.67-.19,3.35-.38,5.04-.56,16.73-1.76,34.48-2.67,51.08-3.09,8.31-.21,16.33-.29,23.79-.3q3.615,0,7.03.02h.01c6.15.03,11.81.12,16.79.22.97.02,1.91.05,2.83.07h.01c.62.01,1.23005.03,1.83.04,10.89.28,17.57.62,17.57.62l2.59-20.32.53-4.1.5-3.9v-.01l.06-.49.41-.01,7.2-.14,60.52-1.18,33.06-.65-5.24,22.46-8.65,37.06C905.23367,592.09718,934.49368,587.50715,934.1937,592.47718Z"
            transform="translate(-183.38894 -133.44496)"
            fill="#2f2e41"
          />
          <path
            d="M757.77365,726.57716c-2.47,1.26-4.96,2.5-7.46,3.7q-6.135,2.97-12.38,5.73c-6.92-3.93-13.76-8.04-20.56-12.24-11.1-6.86-22.09-13.96-33.11-20.89-1.65-1.05-3.29-2.08-4.94-3.1h-.01c-4.54-6.74-9.17-13.76-13.84-20.99-.07-.1-.13-.2-.19-.30005q-1.79993-2.75994-3.58-5.56c-7.47-11.7-14.98005-23.9-22.27-36.36l18.46-8.62,34.31994-16.02,5.92-2.75994,17.02,33.50994,15.18005,29.89,3.37994,6.65Z"
            transform="translate(-183.38894 -133.44496)"
            fill="#2f2e41"
          />
          <path
            d="M762.94619,565.69478l87.50055-84.38371,24.25231-68.66967L838.92615,397.086c-18.37452,17.6014-38.23657,72.42429-38.23657,72.42429L740.4768,546.11471c-.4692.1607-.93718.33133-1.39933.53544a17.23112,17.23112,0,1,0,23.86872,19.04463Z"
            transform="translate(-183.38894 -133.44496)"
            fill="#ffb8b8"
          />
          <path
            d="M828.86025,404.75323l45.37541,14.40513.171-.02847c16.88869-2.829,30.9027-30.41247,39.68439-53.05389a31.59624,31.59624,0,0,0-16.08739-40.02451h0a31.66589,31.66589,0,0,0-33.1649,4.18441l-23.30057,19.03929Z"
            transform="translate(-183.38894 -133.44496)"
            fill="#6c63ff"
          />
          <path
            d="M934.01154,593.48992l.26505-.35223c14.15727-18.77628-5.2058-65.27339-8.13309-72.01689l13.16362-3.89925-2.29443-25.06377-1.10513-11.1761L946.1425,471.262l.03447-.24807,7.03885-50.09245,9.20992-33.1538A73.28485,73.28485,0,0,0,943.465,316.23291L924.63751,297.54l-22.5563-35.30637-37.8193-.97639-13.59975,24.15893a55.14122,55.14122,0,0,0-44.103,55.17854l1.28036,64.31568L794.26928,484.5975l-.3807,14.47486-13.31921,14.05527,2.46244,14.20951-9.963,3.9686-4.87538,20.19138c-1.862,2.32956-14.15633,17.87008-14.26818,22.20243-.01679.65043.44707,1.29151,1.45938,2.01562,7.958,5.69367,52.43741,18.031,72.456,10.61389,21.32343-7.894,104.89466,6.93176,105.7366,7.08256Z"
            transform="translate(-183.38894 -133.44496)"
            fill="#6c63ff"
          />
          <circle cx="696.47956" cy="66.8854" r="50.1036" fill="#ffb8b8" />
          <path
            d="M873.75623,251.10436a136.26665,136.26665,0,0,0,23.18064-1.62c7.59922-1.54533,24.59947-14.00321,29.33857-21.4998h0c3.52093-5.56989,5.77245-14.26768,7.04151-20.583a60.91432,60.91432,0,0,0-10.65371-48.35812,19.24494,19.24494,0,0,0-7.77317-6.63435c-.27844-.10888-.565-.20537-.85454-.28786a23.74464,23.74464,0,0,1-11.81175-7.30889,19.58589,19.58589,0,0,0-1.96357-2.02086,29.2483,29.2483,0,0,0-12.20276-6.12728c-7.25394-1.94141-17.752-.01431-31.20184,5.73333-6.75724,2.88773-14.14724,1.84266-19.83226.60946a1.86014,1.86014,0,0,0-1.75136.6,13.13152,13.13152,0,0,1-8.92485,3.55766c-2.032.08923-4.16392,2.90278-6.74081,6.57174-.5847.83285-1.267,1.80487-1.75914,2.39607l-.06607-1.13583-1.14927,1.26711a15.93481,15.93481,0,0,0,7.19417,25.96108,31.07641,31.07641,0,0,0,6.2501.996c1.27917.11508,2.60233.23413,3.87032.45413a24.02454,24.02454,0,0,1,17.8528,15.59016,6.28282,6.28282,0,0,0,9.483,3.05031,10.3807,10.3807,0,0,1,9.459-1.72243,6.89123,6.89123,0,0,1,3.04595,3.455,8.98031,8.98031,0,0,0,3.40768,3.97567c5.14968,2.65506,5.50461,14.41709,3.6551,24.22217-1.78279,9.45123-5.307,16.28835-8.57,16.62634-2.512.25986-2.79926.43831-2.98114.88257l-.16246.3977.28218.372A10.2608,10.2608,0,0,0,873.75623,251.10436Z"
            transform="translate(-183.38894 -133.44496)"
            fill="#2f2e41"
          />
          <path
            d="M841.30225,389.605l-19.31863-38.5155c-28.04093,1.91544-83.6946,34.33734-83.6946,34.33734L632.99029,407.75242a19.02347,19.02347,0,1,0,5.18645,32.5081L772.123,430.65926Z"
            transform="translate(-183.38894 -133.44496)"
            fill="#ffb8b8"
          />
          <path
            d="M833.5105,395.92917l50.45383-37.49451,8.88732-32.02709a34.982,34.982,0,0,0-10.52129-35.39425h0a34.89929,34.89929,0,0,0-47.624,1.53654c-18.98656,18.95124-40.64185,45.39-35.99009,63.72324l.04709.18584Z"
            transform="translate(-183.38894 -133.44496)"
            fill="#6c63ff"
          />
          <rect
            x="452.66474"
            y="362.77221"
            width="135"
            height="18"
            fill="#fff"
          />
          <rect
            x="107.66474"
            y="362.77221"
            width="135"
            height="18"
            fill="#fff"
          />
          <path
            d="M441.81766,409.65536v85.704a4.12233,4.12233,0,0,0,4.11906,4.11906H572.94121a4.12231,4.12231,0,0,0,4.11906-4.11906v-85.704a4.12431,4.12431,0,0,0-4.11906-4.11451H445.93672A4.12433,4.12433,0,0,0,441.81766,409.65536Z"
            transform="translate(-183.38894 -133.44496)"
            fill="#3f3d56"
          />
          <path
            d="M444.79712,410.72172v83.58039a2.20522,2.20522,0,0,0,2.20141,2.20141H571.884a2.2052,2.2052,0,0,0,2.20141-2.20141V410.72172a2.2062,2.2062,0,0,0-2.20141-2.206H446.99853A2.20622,2.20622,0,0,0,444.79712,410.72172Z"
            transform="translate(-183.38894 -133.44496)"
            fill="#6c63ff"
          />
          <path
            d="M439.16149,512.0739a2.46987,2.46987,0,0,0,1.94346.92983h135.992A2.5024,2.5024,0,0,0,579.543,509.988l-2.111-10.02722a2.50692,2.50692,0,0,0-1.55811-1.81784,2.42467,2.42467,0,0,0-.888-.1675H443.20758a2.42455,2.42455,0,0,0-.888.1675,2.5067,2.5067,0,0,0-1.5581,1.81784l-2.111,10.02722A2.50046,2.50046,0,0,0,439.16149,512.0739Z"
            transform="translate(-183.38894 -133.44496)"
            fill="#2f2e41"
          />
          <rect
            x="569.83152"
            y="499.78134"
            width="4.18849"
            height="2.51309"
            rx="0.48819"
            transform="translate(960.46258 868.63082) rotate(-180)"
            fill="#3f3d56"
          />
          <rect
            x="561.45453"
            y="499.78134"
            width="4.18849"
            height="2.51309"
            rx="0.48819"
            transform="translate(943.70862 868.63082) rotate(-180)"
            fill="#3f3d56"
          />
          <rect
            x="553.07755"
            y="499.78134"
            width="4.18849"
            height="2.51309"
            rx="0.48819"
            transform="translate(926.95465 868.63082) rotate(-180)"
            fill="#3f3d56"
          />
          <rect
            x="544.70057"
            y="499.78134"
            width="4.18849"
            height="2.51309"
            rx="0.48819"
            transform="translate(910.20069 868.63082) rotate(-180)"
            fill="#3f3d56"
          />
          <rect
            x="536.32359"
            y="499.78134"
            width="4.18849"
            height="2.51309"
            rx="0.48819"
            transform="translate(893.44673 868.63082) rotate(-180)"
            fill="#3f3d56"
          />
          <rect
            x="527.94661"
            y="499.78134"
            width="4.18849"
            height="2.51309"
            rx="0.48819"
            transform="translate(876.69276 868.63082) rotate(-180)"
            fill="#3f3d56"
          />
          <rect
            x="519.56962"
            y="499.78134"
            width="4.18849"
            height="2.51309"
            rx="0.48819"
            transform="translate(859.9388 868.63082) rotate(-180)"
            fill="#3f3d56"
          />
          <rect
            x="511.19264"
            y="499.78134"
            width="4.18849"
            height="2.51309"
            rx="0.48819"
            transform="translate(843.18483 868.63082) rotate(-180)"
            fill="#3f3d56"
          />
          <rect
            x="502.81566"
            y="499.78134"
            width="4.18849"
            height="2.51309"
            rx="0.48819"
            transform="translate(826.43087 868.63082) rotate(-180)"
            fill="#3f3d56"
          />
          <rect
            x="494.43868"
            y="499.78134"
            width="4.18849"
            height="2.51309"
            rx="0.48819"
            transform="translate(809.67691 868.63082) rotate(-180)"
            fill="#3f3d56"
          />
          <rect
            x="486.0617"
            y="499.78134"
            width="4.18849"
            height="2.51309"
            rx="0.48819"
            transform="translate(792.92294 868.63082) rotate(-180)"
            fill="#3f3d56"
          />
          <rect
            x="477.68471"
            y="499.78134"
            width="4.18849"
            height="2.51309"
            rx="0.48819"
            transform="translate(776.16898 868.63082) rotate(-180)"
            fill="#3f3d56"
          />
          <rect
            x="469.30773"
            y="499.78134"
            width="4.18849"
            height="2.51309"
            rx="0.48819"
            transform="translate(759.41502 868.63082) rotate(-180)"
            fill="#3f3d56"
          />
          <rect
            x="460.93075"
            y="499.78134"
            width="4.18849"
            height="2.51309"
            rx="0.48819"
            transform="translate(742.66105 868.63082) rotate(-180)"
            fill="#3f3d56"
          />
          <rect
            x="452.55377"
            y="499.78134"
            width="4.18849"
            height="2.51309"
            rx="0.48819"
            transform="translate(725.90709 868.63082) rotate(-180)"
            fill="#3f3d56"
          />
          <rect
            x="444.17679"
            y="499.78134"
            width="4.18849"
            height="2.51309"
            rx="0.48819"
            transform="translate(709.15312 868.63082) rotate(-180)"
            fill="#3f3d56"
          />
          <rect
            x="569.9305"
            y="503.96984"
            width="4.18849"
            height="2.51309"
            rx="0.48819"
            transform="translate(960.66055 877.00781) rotate(-180)"
            fill="#3f3d56"
          />
          <rect
            x="561.55352"
            y="503.96984"
            width="4.18849"
            height="2.51309"
            rx="0.48819"
            transform="translate(943.90659 877.00781) rotate(-180)"
            fill="#3f3d56"
          />
          <rect
            x="553.17654"
            y="503.96984"
            width="4.18849"
            height="2.51309"
            rx="0.48819"
            transform="translate(927.15262 877.00781) rotate(-180)"
            fill="#3f3d56"
          />
          <rect
            x="544.79956"
            y="503.96984"
            width="4.18849"
            height="2.51309"
            rx="0.48819"
            transform="translate(910.39866 877.00781) rotate(-180)"
            fill="#3f3d56"
          />
          <rect
            x="536.42257"
            y="503.96984"
            width="4.18849"
            height="2.51309"
            rx="0.48819"
            transform="translate(893.6447 877.00781) rotate(-180)"
            fill="#3f3d56"
          />
          <rect
            x="528.04559"
            y="503.96984"
            width="4.18849"
            height="2.51309"
            rx="0.48819"
            transform="translate(876.89073 877.00781) rotate(-180)"
            fill="#3f3d56"
          />
          <rect
            x="519.66861"
            y="503.96984"
            width="4.18849"
            height="2.51309"
            rx="0.48819"
            transform="translate(860.13677 877.00781) rotate(-180)"
            fill="#3f3d56"
          />
          <rect
            x="511.29163"
            y="503.96984"
            width="4.18849"
            height="2.51309"
            rx="0.48819"
            transform="translate(843.38281 877.00781) rotate(-180)"
            fill="#3f3d56"
          />
          <rect
            x="502.91465"
            y="503.96984"
            width="4.18849"
            height="2.51309"
            rx="0.48819"
            transform="translate(826.62884 877.00781) rotate(-180)"
            fill="#3f3d56"
          />
          <rect
            x="494.53766"
            y="503.96984"
            width="4.18849"
            height="2.51309"
            rx="0.48819"
            transform="translate(809.87488 877.00781) rotate(-180)"
            fill="#3f3d56"
          />
          <rect
            x="486.16068"
            y="503.96984"
            width="4.18849"
            height="2.51309"
            rx="0.48819"
            transform="translate(793.12091 877.00781) rotate(-180)"
            fill="#3f3d56"
          />
          <rect
            x="477.7837"
            y="503.96984"
            width="4.18849"
            height="2.51309"
            rx="0.48819"
            transform="translate(776.36695 877.00781) rotate(-180)"
            fill="#3f3d56"
          />
          <rect
            x="469.40672"
            y="503.96984"
            width="4.18849"
            height="2.51309"
            rx="0.48819"
            transform="translate(759.61299 877.00781) rotate(-180)"
            fill="#3f3d56"
          />
          <rect
            x="461.02974"
            y="503.96984"
            width="4.18849"
            height="2.51309"
            rx="0.48819"
            transform="translate(742.85902 877.00781) rotate(-180)"
            fill="#3f3d56"
          />
          <rect
            x="452.65276"
            y="503.96984"
            width="4.18849"
            height="2.51309"
            rx="0.48819"
            transform="translate(726.10506 877.00781) rotate(-180)"
            fill="#3f3d56"
          />
          <rect
            x="444.27577"
            y="503.96984"
            width="4.18849"
            height="2.51309"
            rx="0.48819"
            transform="translate(709.3511 877.00781) rotate(-180)"
            fill="#3f3d56"
          />
          <rect
            x="500.40155"
            y="508.99602"
            width="33.50793"
            height="2.51309"
            rx="0.48819"
            transform="translate(850.92209 887.06018) rotate(-180)"
            fill="#3f3d56"
          />
        </Box>
      </SimpleGrid>

      <SimpleGrid cols={1} breakpoints={[{ minWidth: 480, cols: 2 }]} mb="xl">
        <Title order={2}>Latest featured jobs</Title>

        <Button
          component={NextLink}
          href="/jobs"
          variant="default"
          sx={{
            width: 'fit-content',
            alignSelf: 'center',
            justifySelf: 'flex-end',

            '@media (max-width: 768px)': {
              justifySelf: 'flex-start'
            }
          }}
        >
          View all
        </Button>
      </SimpleGrid>

      <SimpleGrid
        breakpoints={[
          { minWidth: 'xs', cols: 1 },
          { minWidth: 'md', cols: 2 }
        ]}
      >
        {jobs.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
      </SimpleGrid>

      <SimpleGrid
        cols={1}
        breakpoints={[{ minWidth: 480, cols: 2 }]}
        mb="md"
        mt="xl"
      >
        <Title order={2}>Latest companies</Title>

        <Button
          component={NextLink}
          href="/companies"
          variant="default"
          sx={{
            width: 'fit-content',
            alignSelf: 'center',
            justifySelf: 'flex-end',

            '@media (max-width: 768px)': {
              justifySelf: 'flex-start'
            }
          }}
        >
          View all
        </Button>
      </SimpleGrid>

      <SimpleGrid
        breakpoints={[
          { maxWidth: 'xs', cols: 2 },
          { minWidth: 'md', cols: 4 }
        ]}
      >
        {companies.map(company => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </SimpleGrid>

      {reviews.length > 0 && (
        <>
          <Title order={2} mb="md" mt="xl">
            Latest company reviews
          </Title>

          <Stack>
            {reviews.map(review => (
              <ReviewItem
                key={review.id}
                review={review}
                showCompanyInfo={true}
              />
            ))}
          </Stack>
        </>
      )}

      <Newsletter />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const jobs = await prisma.job.findMany({
    take: 6,
    select: {
      id: true,
      title: true,
      description: true,
      slug: true,
      category: true,
      type: true,
      applyLink: true,
      location: true,
      city: true,
      featured: true,
      company: {
        select: {
          name: true,
          logo: true
        }
      }
    },
    where: {
      expired: {
        not: true
      },
      draft: {
        not: true
      },
      featured: {
        not: false
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  const companies = await prisma.company.findMany({
    take: 8,
    select: {
      id: true,
      name: true,
      logo: true,
      slug: true,
      _count: true
    },
    orderBy: {
      createdAt: 'desc'
    },
    where: {
      jobs: {
        none: {
          expired: true,
          draft: true
        }
      }
    }
  })

  const reviews = await prisma.review.findMany({
    take: 5,
    select: {
      id: true,
      title: true,
      content: true,
      rating: true,
      pros: true,
      cons: true,
      status: true,
      company: {
        select: {
          name: true,
          slug: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return {
    props: {
      jobs,
      companies,
      reviews
    }
  }
}

export default Home
