
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google" 
import prisma from "../../../lib/prisma"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { WEB_URL } from "../../../util/keys";


export default async function auth(req, res) {
  

    return await NextAuth(req, res, {
      adapter: PrismaAdapter(prisma),
      
      session: {
        strategy: "jwt",
      },

      providers: [
        CredentialsProvider({
          name: "Credentials",
          async authorize(credentials, req) {
            
            const response = await fetch(`${WEB_URL}/api/auth/check-credentials`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                username: credentials.username,
                password: credentials.password
              })
            });

           // console.log("RES", response)

            const user = await response.json()
            if (user)
              return user.user;

            return null
            

        }}),

        GoogleProvider({
          clientId: process.env['GOOGLE_CLIENT_ID'],
          clientSecret: process.env['GOOGLE_CLIENT_SECRET']
        }),

      ],
      secret: process.env['NEXTAUTH_SECRET'],
      pages: {
        signIn: '/auth/login',
      },
      callbacks: {
        async session({ session, token }) {
          session.user = token.user;
          return session;
        },
        async jwt({ token, user }) {
          if (user) {
            token.user = user;
          }
          return token;
        },
      },

  })
}


