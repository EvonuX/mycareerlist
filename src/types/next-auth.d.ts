import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    userId: string
    userRole: string
  }

  interface User {
    userId: string
    role: string
  }
}
