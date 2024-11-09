'use client'

import { motion } from 'framer-motion';
import { useAuth } from '@/app/hooks/useAuth';
import { db } from '@/app/lib/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { Card } from "@/app/components/ui/card";
import { Search, Users, Filter } from 'lucide-react';
import { Input } from "@/app/components/ui/input";
import UserProfileModal from "@/app/components/UserProfileModal";
import { Button } from '@/app/components/ui/button';
import { useState, useEffect } from 'react';

interface UserProfile {
  id: string;
  name?: string;
  photoUrl?: string;
  college?: string;
  role?: string;
  skills?: string;
  bio?: string;
  course?: string;
  semester?: string;
  branch?: string;
}

export default function DiscoverPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Animation variants
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

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;

      try {
        const usersCollection = collection(db, 'users');
        const userSnapshot = await getDocs(usersCollection);
        const userList = userSnapshot.docs
          .filter(doc => doc.id !== user.uid)
          .map(doc => ({
            id: doc.id,
            ...doc.data()
          } as UserProfile));
        setUsers(userList);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.college?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.skills?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <div className="gradient-dark-bg" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="p-6 border-purple-500/20 bg-black/30 animate-pulse">
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-purple-500/20 mb-4" />
                  <div className="h-4 w-2/3 bg-purple-500/20 rounded mb-2" />
                  <div className="h-4 w-1/2 bg-purple-500/20 rounded" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <div className="gradient-dark-bg" />
      
      {/* Abstract Gradient Shapes */}
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

      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6 mb-8"
          >
            <div className="max-w-2xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text flex items-center gap-2 mb-4">
                <Users className="h-8 w-8 sm:h-10 sm:w-10" />
                Discover Hackers
              </h1>
              <p className="text-gray-400 text-lg">
                Find and connect with talented developers from your college
              </p>
            </div>

            <div className="relative max-w-xl">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search by name, college, or skills..."
                className="pl-10 bg-black/30 border-purple-500/30 focus:border-purple-500/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </motion.div>

          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {filteredUsers.map((user) => (
              <motion.div key={user.id} variants={item}>
                <Card className="border-purple-500/20 bg-black/30 backdrop-blur-lg hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
                  <UserProfileModal user={user} />
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {filteredUsers.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-gray-400 text-lg">No users found matching your search criteria</p>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
