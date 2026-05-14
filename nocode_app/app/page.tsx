'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function Home() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

useEffect(() => {
  if (!isLoading) {
    if (user) {
      router.replace('/dashboard');
    } else {
      router.replace('/auth/login');
    }
  }
}, [user, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="animate-spin">
        <div className="w-12 h-12 border-4 border-slate-300 border-t-blue-500 rounded-full"></div>
      </div>
    </div>
  );
}
