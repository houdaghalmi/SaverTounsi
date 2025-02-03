import { Metadata } from "next"
import { Inter } from "next/font/google"
import { getServerSession } from "next-auth"
import { Toaster } from "@/components/ui/toaster"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { authOptions } from "@/lib/auth"
import Footer from '@/components/layout/footer'
import { NavigationProvider } from "@/providers/navigation-provider"
import "../styles/globals.css"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Saver Tounsi',
  description: 'Your personal finance companion',
  icons: {
    icon: './images/logo/logo.png',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NavigationProvider>
          <main className="min-h-screen transition-opacity duration-300">
            {children}
          </main>
          <Toaster />
          {!session && <Footer />}
          <SpeedInsights />
        </NavigationProvider>
      </body>
    </html>
  )
}