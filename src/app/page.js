'use client'
import {useEffect} from 'react';
import { useRouter } from 'next/navigation';

const STRIPE_URL = 'https://buy.stripe.com/cN23fI3WwgvK1XO28b';

export default function Home() {
  const router = useRouter();

  // Get the user ID
  useEffect(() => {
    const localCode = localStorage.getItem('code');
    
    if (localCode) {
      router.push('/account');
    } else {
      window.location.href = STRIPE_URL;
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center gap-3 animate-pulse pt-6">
      <div className="rounded-lg bg-slate-700 h-14 w-48 opacity-10 mt-1.5"></div>
      <div className="rounded-lg bg-slate-700 h-3 w-2/3 opacity-10"></div>
      <div className="rounded-lg bg-slate-700 h-3 w-2/3 opacity-10"></div>
      <div className="rounded-lg bg-slate-700 h-48 w-full opacity-10"></div>
    </div>
  );
}
