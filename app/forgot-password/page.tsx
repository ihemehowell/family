'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Home, Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { requestPasswordReset } from '@/app/actions';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await requestPasswordReset(email);
    
    setLoading(false);
    
    if (result?.error) {
      toast.error(result.error);
    } else {
      setSent(true);
      toast.success('Password reset link sent to your email');
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex flex-col">
        <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
          <Link href="/" className="flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700 transition">
            <Home size={24} /> Family Dashboard
          </Link>
        </nav>

        <div className="flex-1 flex items-center justify-center bg-gradient-to-tr from-blue-50 to-gray-50 p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 md:p-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Check Your Email</h1>
            <p className="text-gray-500 mb-6">
              We&apos;ve sent a password reset link to <span className="font-medium text-gray-700">{email}</span>
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              <ArrowLeft size={18} /> Back to Login
            </Link>
          </div>
        </div>
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
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10 md:p-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h1>
          <p className="text-gray-500 mb-6">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft size={18} /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}