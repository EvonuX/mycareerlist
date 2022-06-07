import { PrismaClient } from '@prisma/client/edge'

declare global {
  var prisma: PrismaClient | undefined
}

const prisma =
  global.prisma ||
  new PrismaClient({
    log: ['error']
  })

if (process.env.NODE_ENV !== 'production') global.prisma = prisma

export default prisma
