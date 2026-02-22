'use client';

import { Navbar } from './Navbar';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  isAuthenticated?: boolean;
  user?: {
    name?: string;
    email?: string;
    image?: string;
    role?: 'user' | 'owner' | 'admin';
  };
  hideNavbar?: boolean;
  hideFooter?: boolean;
}

export function Layout({ 
  children, 
  isAuthenticated = false, 
  user,
  hideNavbar = false,
  hideFooter = false 
}: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#121212]">
      {!hideNavbar && <Navbar isAuthenticated={isAuthenticated} user={user} />}
      <main className={`flex-1 ${!hideNavbar ? 'pt-16' : ''}`}>
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}
