"use client";

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from './ui/button';
import { Home, Search, MessageSquare, Wallet, User as UserIcon, LogOut, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    if (pathname !== '/') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    const sections = ['hero', 'how-it-works', 'explore-skills'];
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [pathname]);

  const isLanding = pathname === '/';

  return (
    <nav className="fixed top-0 w-full nav-frosted z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white group-hover:rotate-12 transition-transform">
            <Sparkles size={20} />
          </div>
          <span className="font-black text-2xl tracking-tight text-gray-900">
            KNowAI
          </span>
        </Link>

        {isLanding && !user ? (
          <div className="hidden md:flex items-center space-x-10">
            <LandingNavItem href="#hero" label="Home" active={activeSection === 'hero'} />
            <LandingNavItem href="#how-it-works" label="How it Works" active={activeSection === 'how-it-works'} />
            <LandingNavItem href="#explore-skills" label="Explore Skills" active={activeSection === 'explore-skills'} />
            <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-xl btn-hover-scale shadow-lg shadow-primary/20">
              Get Started
            </Button>
          </div>
        ) : user ? (
          <div className="flex items-center md:space-x-8">
            <div className="hidden md:flex items-center space-x-6 mr-6 border-r pr-6 border-gray-100">
              <AppNavItem href="/home" icon={<Home size={20} />} label="Home" active={pathname === '/home'} />
              <AppNavItem href="/match" icon={<Search size={20} />} label="Match" active={pathname === '/match'} />
              <AppNavItem href="/chat" icon={<MessageSquare size={20} />} label="Chat" active={pathname === '/chat'} />
              <AppNavItem href="/wallet" icon={<Wallet size={20} />} label="Wallet" active={pathname === '/wallet'} />
              <AppNavItem href="/profile" icon={<UserIcon size={20} />} label="Profile" active={pathname === '/profile'} />
            </div>
            <button 
              onClick={() => logout()} 
              className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
            >
              <LogOut size={20} />
              <span className="hidden md:inline font-semibold">Logout</span>
            </button>
          </div>
        ) : (
          <Button onClick={() => window.location.href = '/'} className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-xl btn-hover-scale">
            Sign In
          </Button>
        )}
      </div>

      {/* Mobile App Nav */}
      {user && (
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-100 px-6 py-3 flex items-center justify-between z-50">
          <MobileNavItem href="/home" icon={<Home size={24} />} active={pathname === '/home'} />
          <MobileNavItem href="/match" icon={<Search size={24} />} active={pathname === '/match'} />
          <MobileNavItem href="/chat" icon={<MessageSquare size={24} />} active={pathname === '/chat'} />
          <MobileNavItem href="/wallet" icon={<Wallet size={24} />} active={pathname === '/wallet'} />
          <MobileNavItem href="/profile" icon={<UserIcon size={24} />} active={pathname === '/profile'} />
        </div>
      )}
    </nav>
  );
};

const LandingNavItem = ({ href, label, active }: { href: string; label: string; active: boolean }) => (
  <a 
    href={href} 
    className={`font-bold text-sm transition-all duration-300 relative py-2 ${
      active ? 'text-primary' : 'text-gray-500 hover:text-gray-900'
    }`}
  >
    {label}
    {active && (
      <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-full" />
    )}
  </a>
);

const AppNavItem = ({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active: boolean }) => (
  <Link 
    href={href} 
    className={`flex items-center space-x-2 font-bold text-sm transition-colors ${
      active ? 'text-primary' : 'text-gray-500 hover:text-gray-900'
    }`}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

const MobileNavItem = ({ href, icon, active }: { href: string; icon: React.ReactNode; active: boolean }) => (
  <Link 
    href={href} 
    className={`p-2 rounded-xl transition-all ${
      active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-400'
    }`}
  >
    {icon}
  </Link>
);
