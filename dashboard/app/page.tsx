import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import RedirectIfAuthenticated from "@/components/RedirectIfAuthenticated";

export default async function Home() {
  const { userId } = await auth();

  // Redirect to dashboard if already authenticated (server-side)
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Client-side redirect after Clerk login */}
      <RedirectIfAuthenticated />
      {/* Header */}
      <header className="border-b bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="font-bold text-xl text-slate-900 dark:text-white">
                Bitroot
              </div>
              <span className="text-slate-500 dark:text-slate-400">Student Portal</span>
            </div>

            <div className="flex items-center gap-4">
              <SignedOut>
                <SignInButton mode="modal" forceRedirectUrl="/dashboard">
                  <button className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal" forceRedirectUrl="/dashboard">
                  <button className="px-4 py-2 text-sm font-medium text-white bg-slate-900 dark:bg-slate-700 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors">
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SignedOut>
          <div className="text-center py-20">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Welcome to Bitroot Student Portal
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
              Sign in with your university email to access your projects, track timelines, and collaborate with your team.
            </p>
            <SignInButton mode="modal" forceRedirectUrl="/dashboard">
              <button className="px-6 py-3 text-base font-medium text-white bg-slate-900 dark:bg-slate-700 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors">
                Get Started
              </button>
            </SignInButton>
          </div>
        </SignedOut>

      </main>
    </div>
  );
}