'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn } from '@/lib/auth-service';
import { useAuth } from '@/lib/auth-context';
import { Mail, Lock, Loader2, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: authError } = await signIn(email, password);

       // 👇 Add these logs — check browser DevTools console
console.log('Auth response:', { data, error: authError });
console.log('data.user:', (data as any)?.user);
console.log('data.session.user:', (data as any)?.session?.user);

      if (authError) {
        setError(authError.message || 'Invalid email or password');
        return;
      }

      console.log('before refreshUser');
      await refreshUser();
      console.log('after refreshUser');

      console.log('pushing to dashboard');
      router.push('/dashboard');

    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-6 shadow-md">
            <span className="text-white text-4xl">📋</span>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">TaskMaster</h1>
          <p className="text-slate-600">Sign in to manage your tasks</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl p-10 border border-slate-100">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <button
                type="button"
                  className="text-sm text-blue-600 hover:text-blue-700 transition"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3.5 rounded-2xl transition flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center text-slate-600">
            Don't have an account?{' '}
            <Link
              href="/auth/signup"
              className="text-blue-600 hover:text-blue-700 font-semibold transition"
            >
              Create one free
            </Link>
          </div>
        </div>

        <p className="text-center text-slate-500 text-xs mt-8">
          By signing in, you agree to our Terms and Privacy Policy
        </p>
      </div>
    </div>
  );
}