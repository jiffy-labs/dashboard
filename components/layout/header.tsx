'use client'
import ThemeToggle from '@/components/layout/ThemeToggle/theme-toggle';
import { cn } from '@/lib/utils';
import { MobileSidebar } from './mobile-sidebar';
import { UserNav } from './user-nav';
import Link from 'next/link';
import { SignOutButton } from '@clerk/nextjs';
import { useTheme } from 'next-themes';
import { useEffect,useState } from 'react';
export default function Header() {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])



  const [imageSrc, setImageSrc] = useState('/loadinglight.gif');

  useEffect(() => {
    if (theme === 'dark') {
      setImageSrc('/logodark.svg');
    } else {
      setImageSrc('/logolight.svg');
    }
  }, [theme]);
  if(!mounted) return null
  return (
    <div className="supports-backdrop-blur:bg-background/60 fixed left-0 right-0 top-0 z-20 border-b bg-background/95 backdrop-blur">
      <nav className="flex h-14 items-center justify-between px-4">
        <div className="hidden lg:block">
          <Link
            href={'/'}
          
          >
             <img src={imageSrc} className='h-[40px] w-[180px]' />
          </Link>
        </div>
        <div className={cn('block lg:!hidden')}>
          <MobileSidebar />
        </div>

        <div className="flex items-center gap-2">
          <UserNav />
          <ThemeToggle />
          <SignOutButton/>
        </div>
      </nav>
    </div>
  );
}
