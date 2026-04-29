'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { Home, Mail, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function VerifyEmailPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const checkVerification = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user?.email_confirmed_at) {
        toast.success('Email verified successfully!');
        router.push('/dashboard');
      } else {
        setLoading(false);
      }
    };

    checkVerification();

    // Poll for verification every 5 seconds
    const interval = setInterval(checkVerification, 5000);
    return () => clearInterval(interval);
  }, [router]);

  const handleResend = async () => {
    setResending(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email!,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Verification email resent!');
      }
    }
    
    setResending(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={40} className="animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 transition">
          <Home size={24} /> Family Dashboard
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center bg-gradient-to-tr from-blue-50 to-gray-50 p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 md:p-12 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="w-8 h-8 text-yellow-600" />
          </div>
          
          <div className="flex items-center justify-center gap-2 text-yellow-600 mb-4">
            <AlertCircle size={20} />
            <span className="font-medium">Email Not Verified</span>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h1>
          <p className="text-gray-500 mb-6">
            We&apos;ve sent a verification link to your email address. 
            Please click the link to verify your account.
          </p>

          <div className="space-y-4">
            <button
              onClick={handleResend}
              disabled={resending}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resending ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> Sending...
                </>
              ) : (
                'Resend Verification Email'
              )}
            </button>

            <Link
              href="/login"
              className="block w-full py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}