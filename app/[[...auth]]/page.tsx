"use client";
import { useState } from 'react';
import { SignIn, SignUp } from '@clerk/nextjs';
import Link from 'next/link';
import Image from 'next/image';

export default function AuthenticationPage() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
        <Image alt="" src={`/logo.svg`} height={40} width={180} />
      
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;Seamless UserOp Indexing and Analysis&rdquo;
            </p>
            <footer className="text-sm">Jiffyscan Team</footer>
          </blockquote>
        </div>
      </div>
      <div className="flex h-full items-center p-4 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {isSignUp ? 'Sign Up for Your Account' : 'Sign In to Your Account'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isSignUp ? 'Enter your details to create your account' : 'Enter your details to access your account'}
            </p>
          </div>
          {isSignUp ? (
            <SignUp routing="hash" fallbackRedirectUrl="/dashboard" />
          ) : (
            <SignIn routing="hash" fallbackRedirectUrl="/dashboard" />
          )}
          <p className="px-8 text-center text-sm text-muted-foreground">
            {isSignUp ? (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => setIsSignUp(false)}
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => setIsSignUp(true)}
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Sign up
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
