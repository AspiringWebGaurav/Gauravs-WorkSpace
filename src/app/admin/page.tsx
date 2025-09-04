'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';

export default function AdminRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page immediately
    router.replace('/admin/login');
  }, [router]);

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Redirecting to admin login...</p>
        </div>
      </div>
    </Layout>
  );
}