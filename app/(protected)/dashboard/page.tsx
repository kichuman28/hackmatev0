'use client'

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { motion } from 'framer-motion';
import { db, storage } from '@/app/lib/firebaseConfig';
import { Sparkles, Users, Filter } from 'lucide-react';
import { Button } from "@/app/components/ui/button";
import { TeamCard } from "@/app/components/TeamCard";
import { TeamFiltersSection } from "@/app/components/TeamFilters";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/components/ui/sheet";
import { Skeleton } from "@/app/components/ui/skeleton";
import { collection } from 'firebase/firestore';
import { useToast } from "@/app/components/ui/use-toast";
import { TeamFilters, UserProfile } from '@/app/types/team';
import { getDocs, where, query } from 'firebase/firestore';

export default function Dashboard() {
  const router = useRouter();
  const { user } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TeamFilters>({
    projectInterest: 'all',
    teamStatus: 'all',
    experienceLevel: 'all'
  });
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const usersRef = collection(db, 'users');
      const constraints = [];
      
      if (filters.teamStatus !== 'all') {
        constraints.push(where('teamStatus', '==', filters.teamStatus));
      }
      
      if (filters.experienceLevel !== 'all') {
        constraints.push(where('experienceLevel', '==', filters.experienceLevel.toLowerCase()));
      }
      
      if (filters.projectInterest !== 'all') {
        constraints.push(where('projectInterests', 'array-contains', filters.projectInterest));
      }
      
      const baseQuery = constraints.length > 0 
        ? query(usersRef, ...constraints)
        : query(usersRef);
      
      const querySnapshot = await getDocs(baseQuery);
      
      const usersList = querySnapshot.docs
        .map(doc => ({
          ...doc.data(),
          id: doc.id,
        } as UserProfile))
        .filter(profile => profile.id !== user.uid);
      
      setUsers(usersList);
      
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, filters, toast]);

  useEffect(() => {
    if (user) {
      fetchUsers();
    }
  }, [user, filters, fetchUsers]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <div className="gradient-dark-bg" />
        <div className="relative z-10 pt-24 px-4">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-4 rounded-xl border border-purple-500/20 bg-black/30">
                <div className="flex items-center space-x-4 mb-4">
                  <Skeleton className="h-12 w-12 rounded-full bg-purple-500/20" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[200px] bg-purple-500/20" />
                    <Skeleton className="h-4 w-[150px] bg-purple-500/20" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full bg-purple-500/20" />
                  <Skeleton className="h-4 w-2/3 bg-purple-500/20" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div className="gradient-dark-bg" />
      
      <motion.div 
        className="absolute inset-0 -z-10 overflow-hidden pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-[#52057B] rounded-full mix-blend-multiply filter blur-[64px] sm:blur-[128px] opacity-50" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-[#892CDC] rounded-full mix-blend-multiply filter blur-[64px] sm:blur-[128px] opacity-50" />
        <div className="absolute bottom-1/4 left-1/3 w-48 h-48 sm:w-96 sm:h-96 bg-[#BC6FF1] rounded-full mix-blend-multiply filter blur-[64px] sm:blur-[128px] opacity-50" />
      </motion.div>

      <main className="relative z-10 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6 mb-8"
          >
            <div className="max-w-4xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text flex items-center gap-2">
                <Sparkles className="h-6 w-6 sm:h-8 sm:w-8" />
                Find Your Dream Team
              </h1>
              <p className="text-gray-400 mt-2 text-base sm:text-lg">
                Connect with other hackers and build something amazing together
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Sheet>
                <SheetTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-full sm:w-auto border-purple-500/30 hover:border-purple-500/50 text-white"
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent 
                  side="right" 
                  className="w-full sm:w-[400px] bg-black/95 border-purple-500/30"
                >
                  <SheetHeader>
                    <SheetTitle className="text-white">Filter Hackers</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <TeamFiltersSection 
                      filters={filters}
                      onFilterChange={setFilters}
                    />
                  </div>
                </SheetContent>
              </Sheet>

              <Button
                variant="outline"
                className="w-full sm:w-auto border-purple-500/30 hover:border-purple-500/50 text-white"
                onClick={() => router.push('/my-connections')}
              >
                <Users className="mr-2 h-4 w-4" />
                Connections
              </Button>
            </div>
          </motion.div>

          {error ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <p className="text-red-400">Error: {error}</p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setError(null);
                  fetchUsers();
                }}
                className="mt-4 border-purple-500/30 hover:border-purple-500/50"
              >
                Try Again
              </Button>
            </motion.div>
          ) : users.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <p className="text-gray-400">No users found matching your criteria</p>
            </motion.div>
          ) : (
            <motion.div 
              variants={container}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {users.map((profile) => (
                <motion.div key={profile.id} variants={item}>
                  <TeamCard
                    profile={profile}
                    currentUserId={user?.uid || ''}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
