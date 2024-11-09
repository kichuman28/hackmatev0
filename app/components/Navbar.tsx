"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { HoveredLink, Menu, MenuItem } from "./ui/navbar-menu";
import { cn } from "@/app/lib/utils";
import { Button } from './ui/button';
import { Menu as MenuIcon, X } from 'lucide-react';

const Navbar = ({ className }: { className?: string }) => {
  const router = useRouter();
  const { user, signInWithGoogle, logout } = useAuth();
  const [active, setActive] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      router.push('/');
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 py-3 transition-all duration-300">
      <nav className={cn(
        "transition-all duration-300 w-full",
        isScrolled
          ? "mx-auto max-w-6xl bg-black/50 backdrop-blur-lg border border-white/10 rounded-2xl px-4 py-2"
          : "bg-transparent px-4 py-2",
        className
      )}>
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold gradient-text tracking-tight">
                hackmate
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-10">
              <Menu setActive={setActive}>
                <MenuItem setActive={setActive} active={active} item="Explore">
                  <div className="flex flex-col space-y-4 text-base">
                    <HoveredLink href="/hackathons">Hackathons</HoveredLink>
                    <HoveredLink href="/teams">Teams</HoveredLink>
                    <HoveredLink href="/projects">Projects</HoveredLink>
                  </div>
                </MenuItem>
                {user && (
                  <MenuItem setActive={setActive} active={active} item="Dashboard">
                    <div className="flex flex-col space-y-4 text-base">
                      <HoveredLink href="/profile">Profile</HoveredLink>
                      <HoveredLink href="/dashboard">Find hackers!</HoveredLink>
                      <HoveredLink href="/discover">Discover</HoveredLink>
                      <HoveredLink href="/chats">Messages</HoveredLink>
                    </div>
                  </MenuItem>
                )}
                <MenuItem setActive={setActive} active={active} item="Resources">
                  <div className="flex flex-col space-y-4 text-base">
                    <HoveredLink href="/guides">Guides</HoveredLink>
                    <HoveredLink href="/faq">FAQ</HoveredLink>
                    <HoveredLink href="/contact">Contact</HoveredLink>
                  </div>
                </MenuItem>
              </Menu>

              {user ? (
                <Button 
                  onClick={handleLogout}
                  className="primary-button text-base px-8 py-2.5"
                >
                  Logout
                </Button>
              ) : (
                <Button 
                  onClick={signInWithGoogle}
                  className="primary-button text-base px-8 py-2.5"
                >
                  Sign In
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white p-2"
              >
                {isMobileMenuOpen ? (
                  <X className="h-7 w-7" />
                ) : (
                  <MenuIcon className="h-7 w-7" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu - Updated to match new styling */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-2 bg-black/90 backdrop-blur-lg border border-white/10 rounded-xl">
            <div className="px-6 pt-4 pb-6 space-y-4">
              <Link href="/hackathons" 
                className="block px-4 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg">
                Hackathons
              </Link>
              <Link href="/teams"
                className="block px-4 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg">
                Teams
              </Link>
              <Link href="/projects"
                className="block px-4 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg">
                Projects
              </Link>
              {user && (
                <>
                  <Link href="/profile"
                    className="block px-4 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg">
                    Profile
                  </Link>
                  <Link href="/dashboard"
                    className="block px-4 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg">
                    Dashboard
                  </Link>
                  <Link href="/chats"
                    className="block px-4 py-3 text-base font-medium text-gray-300 hover:text-white hover:bg-white/10 rounded-lg">
                    Messages
                  </Link>
                </>
              )}
              <div className="pt-4">
                {user ? (
                  <Button 
                    onClick={handleLogout}
                    className="w-full primary-button text-sm"
                  >
                    Logout
                  </Button>
                ) : (
                  <Button 
                    onClick={signInWithGoogle}
                    className="w-full primary-button text-sm"
                  >
                    Sign In
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
