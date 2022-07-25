import NextAuth, { NextAuthOptions } from 'next-auth'
import EmailProvider from 'next-auth/providers/email'
import GoogleProvider from 'next-auth/providers/google'
// import FacebookProvider from 'next-auth/providers/facebook'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '~/utils/prisma'
import sendVerificationRequest from '~/utils/verify-email'

export const authOptions: NextAuthOptions = {
  providers: [
    EmailProvider({
      from: process.env.EMAIL_FROM,
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD
        }
      },
      sendVerificationRequest: ({ identifier, url }) =>
        sendVerificationRequest({ identifier, url })
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    })
    // FacebookProvider({
    //   clientId: process.env.FACEBOOK_CLIENT_ID,
    //   clientSecret: process.env.FACEBOOK_SECRET
    // })
  ],

  adapter: PrismaAdapter(prisma),

  callbacks: {
    async session({ session, user }) {
      return {
        ...session,
        userId: user.id,
        userRole: user.role
      }
    }
  },

  pages: {
    verifyRequest: '/account/verify'
  },

  secret: process.env.NEXTAUTH_SECRET
}

export default NextAuth(authOptions)
