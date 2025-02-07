// lib/auth.ts
import { NextAuthOptions, Session } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcrypt';
import prisma from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/signin',
    signOut: '/auth/logout', // Add signOut page
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });
        if (!user) {
          throw new Error('Email does not exist');
        }
        const isPasswordValid = await compare(credentials.password, user.password);
        if (!isPasswordValid) {
          throw new Error('Invalid password');
        }
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          isOnboarded: user.isOnboarded,
        };
      },
    }),
  ],
  callbacks: {
    async session({ token, session }: {token: any, session: Session}) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.isOnboarded = token.isOnboarded;
      }
      return session;
    },
    async jwt({ token, user }:{ token: any, user: any} ) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.isOnboarded = user.isOnboarded;
      }
      return token;
    },
  },
};