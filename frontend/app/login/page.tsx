'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context';
import { DEMO_CREDENTIALS, DemoCredential } from '@/lib/api/auth';
import { UserRole } from '@/types';
import {
  GovBanner,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Badge,
  LanguageSelector,
} from '@/components/shared';
import {
  ShieldIcon,
  NationalEmblemMotif,
  UserIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
  ChevronRightIcon,
  ActivityIcon,
  AlertIcon,
  FarmIcon,
  MapIcon,
  CpuIcon,
} from '@/components/shared/ui/Icons';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const { login, isAuthenticated, user } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('FARMER');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect to portal
  useEffect(() => {
    if (isAuthenticated && user) {
      if (redirectUrl) {
        router.replace(redirectUrl);
      } else {
        router.replace(`/${user.role.toLowerCase()}`);
      }
    }
  }, [isAuthenticated, user, redirectUrl, router]);

  const handleSelectDemo = (demo: DemoCredential) => {
    setIdentifier(demo.email);
    setPassword(demo.password);
    setSelectedRole(demo.role);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!identifier.trim()) {
      setErrorMessage('Please enter your email address or registered mobile number.');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Please enter your account password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await login({
        email: identifier.includes('@') ? identifier.trim() : undefined,
        phone: !identifier.includes('@') ? identifier.trim() : undefined,
        username: identifier.trim(),
        password: password.trim(),
        portal: selectedRole,
      });

      if (result.success && result.role) {
        if (redirectUrl) {
          router.push(redirectUrl);
        } else {
          router.push(`/${result.role.toLowerCase()}`);
        }
      } else {
        setErrorMessage(
          result.error ||
            'Authentication failed. Please check your credentials or select a demo role below.'
        );
        setIsSubmitting(false);
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : 'An error occurred during authentication.'
      );
      setIsSubmitting(false);
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return <CpuIcon className="w-4 h-4 text-purple-700" />;
      case 'OFFICER':
        return <MapIcon className="w-4 h-4 text-blue-700" />;
      case 'FARMER':
        return <FarmIcon className="w-4 h-4 text-emerald-700" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <GovBanner />

      {/* Main Container */}
      <main className="flex-1 flex flex-col justify-center items-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-4xl w-full space-y-6">
          {/* Header Branding */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center p-2.5 rounded-xl bg-emerald-800 text-white shadow-md">
              <ShieldIcon className="w-8 h-8 text-emerald-200" />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                  KrishiRakshak AI
                </h1>
                <span className="text-xl sm:text-2xl font-bold font-serif text-emerald-700">
                  कृषि रक्षक
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono text-xs font-bold border border-emerald-300">
                  DEMO AUTH
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
                National Crop Disease Early Warning, Epidemic Surveillance & Advisory Grid
              </p>
            </div>

            {/* Language Selector Header */}
            <div className="pt-2 flex items-center justify-center">
              <LanguageSelector variant="header" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Login Box */}
            <div className="lg:col-span-7">
              <Card className="bg-white border-2 border-slate-200 shadow-md">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold text-slate-950">
                        Sign In to Portal Gateway
                      </CardTitle>
                      <CardDescription>
                        Enter your registered credentials or choose a demonstration profile.
                      </CardDescription>
                    </div>
                    <NationalEmblemMotif className="w-8 h-8 text-slate-600 hidden sm:block" />
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {errorMessage && (
                    <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2 animate-fadeIn">
                      <AlertIcon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold">Authentication Error</p>
                        <p className="text-[11px] text-rose-700">{errorMessage}</p>
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Identifier Input */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        Email Address or Mobile Number
                      </label>
                      <div className="relative flex items-center">
                        <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                        <input
                          type="text"
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          placeholder="e.g. farmer@krishirakshak.gov.in or 9876543210"
                          required
                          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 text-slate-900 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                          Password
                        </label>
                        <span className="text-[11px] text-slate-400">Case-sensitive</span>
                      </div>
                      <div className="relative flex items-center">
                        <LockIcon className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter account password"
                          required
                          className="w-full pl-9 pr-10 py-2 text-xs bg-slate-50 border border-slate-300 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-emerald-700 text-slate-900 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 text-slate-400 hover:text-slate-600 focus:outline-none"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? (
                            <EyeOffIcon className="w-4 h-4" />
                          ) : (
                            <EyeIcon className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Sign In Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs tracking-wide rounded-md transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                    >
                      {isSubmitting ? (
                        <>
                          <ActivityIcon className="w-4 h-4 animate-spin" />
                          <span>Verifying Credentials...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In to KrishiRakshak</span>
                          <ChevronRightIcon className="w-4 h-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>

                <CardFooter className="bg-slate-50 border-t border-slate-100 p-3.5 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>SIH 2026 Prototype Authentication Active</span>
                  </div>
                  <Link
                    href="/"
                    className="text-emerald-700 hover:text-emerald-800 font-semibold text-[11px] hover:underline"
                  >
                    Public Home
                  </Link>
                </CardFooter>
              </Card>
            </div>

            {/* Right: One-Click Demo Accounts Selector */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between px-1">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  One-Click Demo Accounts
                </p>
                <Badge variant="warning" size="sm">
                  SIH Demo
                </Badge>
              </div>

              <div className="space-y-2.5">
                {DEMO_CREDENTIALS.map((demo) => {
                  const isSelected = selectedRole === demo.role && identifier === demo.email;

                  return (
                    <div
                      key={demo.role}
                      onClick={() => handleSelectDemo(demo)}
                      className={`p-3.5 rounded-lg border-2 transition-all cursor-pointer bg-white text-left space-y-2 ${
                        isSelected
                          ? 'border-emerald-600 shadow-md bg-emerald-50/20 ring-1 ring-emerald-600'
                          : 'border-slate-200 hover:border-slate-400 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-md bg-slate-100">
                            {getRoleIcon(demo.role)}
                          </div>
                          <div>
                            <h3 className="text-xs font-bold text-slate-900">{demo.title}</h3>
                            <p className="text-[11px] text-slate-500 font-medium">{demo.name}</p>
                          </div>
                        </div>

                        <Badge
                          variant={
                            demo.role === 'ADMIN'
                              ? 'neutral'
                              : demo.role === 'OFFICER'
                              ? 'primary'
                              : 'success'
                          }
                          size="sm"
                        >
                          {demo.role}
                        </Badge>
                      </div>

                      <p className="text-[11px] text-slate-600 leading-snug">
                        {demo.description}
                      </p>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-500">
                        <span>Email: <strong className="text-slate-800">{demo.email}</strong></span>
                        <span>Pass: <strong className="text-slate-800">{demo.password}</strong></span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900 space-y-1">
                <p className="font-bold flex items-center gap-1">
                  <span>ℹ️ Demo Environment Notice</span>
                </p>
                <p className="text-[10px] text-amber-800 leading-relaxed">
                  These accounts are configured exclusively for Smart India Hackathon jury evaluations. No live government credentials are required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Official Footer */}
      <footer className="bg-slate-900 text-slate-400 py-4 px-6 text-center text-xs border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 KrishiRakshak AI — Ministry of Agriculture & Farmers Welfare, Govt. of India.</p>
          <p className="text-[11px] text-slate-400">Smart India Hackathon 2026</p>
        </div>
      </footer>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <div className="flex items-center gap-2 text-slate-600 text-sm">
            <ActivityIcon className="w-5 h-5 animate-spin text-emerald-700" />
            <span>Loading KrishiRakshak Authentication...</span>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
