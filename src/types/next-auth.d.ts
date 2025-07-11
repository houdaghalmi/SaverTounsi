import NextAuth from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      isOnboarded: boolean;
    }
  }
  interface JWT {
    id: string;
    name: string;
    email: string;
    isOnboarded: boolean;
  }
}


