// app/auth/logout/page.tsx
'use client'; // Mark this as a Client Component

import { signOut } from 'next-auth/react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function LogoutPage() {
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const handleLogout = async () => {
      const result = await signOut({ redirect: false, callbackUrl: '/signin' });

      if (result?.url) {
        toast({
          title: 'Logged out',
          description: 'You have been successfully logged out.',
          variant: 'default',
        });
        router.push(result.url);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to log out. Please try again.',
          variant: 'destructive',
        });
      }
    };

    handleLogout();
  }, [router, toast]);

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <p className="text-lg font-semibold">Logging out...</p>
    </div>
  );
}