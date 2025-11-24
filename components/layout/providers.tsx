'use client';
import React from 'react';
import ThemeProvider from './ThemeToggle/theme-provider';
export default function Providers({
  children
}: {
  children: React.ReactNode;
}) {
  console.log("Client-side Clerk Key Check:", process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  return (
    <>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </>
  );
}
