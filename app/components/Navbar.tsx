"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { HoveredLink, Menu, MenuItem} from "./ui/navbar-menu";
import { cn } from "@/app/lib/utils";

const Navbar = ({ className }: { className?: string }) => {
  const router = useRouter();
  const { user, signInWithGoogle, logout } = useAuth();
  const [active, setActive] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      // First navigate away from protected routes
      router.push('/');
      
      // Then perform logout
      await logout();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <nav className={cn(
      "fixed top-0 inset-x-0 z-50 transition-all duration-300",
      isScrolled
        ? "max-w-3xl mx-auto mt-4 rounded-full bg-white/80 dark:bg-zinc-800/80 shadow-lg backdrop-blur-md"
        : "w-full bg-transparent",
      className
    )}>
      <div className={cn(
        "flex justify-between items-center",
        isScrolled ? "p-2" : "p-4"
      )}>
        <Link href="/" className="text-xl font-bold text-black dark:text-white">
          hackmate
        </Link>
        <div className="flex items-center space-x-4">
          <Menu setActive={setActive}>
            <MenuItem setActive={setActive} active={active} item="Explore">
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/hackathons">Hackathons</HoveredLink>
                <HoveredLink href="/teams">Teams</HoveredLink>
                <HoveredLink href="/projects">Projects</HoveredLink>
              </div>
            </MenuItem>
            {user && (
              <MenuItem setActive={setActive} active={active} item="My Account">
                <div className="flex flex-col space-y-4 text-sm">
                  <HoveredLink href="/profile">Profile</HoveredLink>
                  <HoveredLink href="/dashboard">Find hackers!</HoveredLink>
                  <HoveredLink href="/discover">Discover</HoveredLink>
                  <HoveredLink href="/chats">Messages</HoveredLink>
                </div>
              </MenuItem>
            )}
            <MenuItem setActive={setActive} active={active} item="Resources">
              <div className="flex flex-col space-y-4 text-sm">
                <HoveredLink href="/guides">Guides</HoveredLink>
                <HoveredLink href="/faq">FAQ</HoveredLink>
                <HoveredLink href="/contact">Contact Us</HoveredLink>
              </div>
            </MenuItem>
          </Menu>
          {user ? (
            <button 
              onClick={handleLogout} 
              className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          ) : (
            <button 
              onClick={signInWithGoogle} 
              className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors"
            >
              Sign In with Google
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
