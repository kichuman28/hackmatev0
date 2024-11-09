'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { db } from '@/app/lib/firebaseConfig';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  doc,
  getDoc
} from 'firebase/firestore';
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { format } from 'date-fns';
import Link from 'next/link';
import { Badge } from "@/app/components/ui/badge";
import { MessageSquare, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ChatUser {
  id: string;
  name: string;
  photoUrl?: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
}

export default function ChatsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const fetchChatUsers = async () => {
      if (!user) return;

      try {
        const messagesRef = collection(db, 'messages');
        const q = query(
          messagesRef,
          where('participants', 'array-contains', user.uid),
          orderBy('timestamp', 'desc')
        );

        unsubscribe = onSnapshot(q, async (snapshot) => {
          const userMap = new Map<string, ChatUser>();
          
          for (const docSnapshot of snapshot.docs) {
            const message = docSnapshot.data();
            const otherUserId = message.senderId === user.uid ? 
              message.receiverId : message.senderId;

            if (!userMap.has(otherUserId)) {
              // Fetch user profile
              const userDoc = await getDoc(doc(db, 'users', otherUserId));
              const userData = userDoc.data();
              
              if (userData) {
                userMap.set(otherUserId, {
                  id: otherUserId,
                  name: userData.name || userData.displayName || 'Anonymous',
                  photoUrl: userData.photoUrl || userData.photoURL,
                  lastMessage: message.content,
                  lastMessageTime: message.timestamp.toDate(),
                  unreadCount: 0
                });
              }
            }
          }

          setChatUsers(Array.from(userMap.values()));
          setIsLoading(false);
        });
      } catch (error) {
        console.error("Error setting up chat listener:", error);
      }
    };

    fetchChatUsers();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user]);

  const formatLastMessageTime = (date: Date) => {
    const now = new Date();
    const messageDate = new Date(date);
    
    if (messageDate.toDateString() === now.toDateString()) {
      return format(messageDate, 'h:mm a');
    }
    
    if (messageDate.getFullYear() === now.getFullYear()) {
      return format(messageDate, 'MMM d');
    }
    
    return format(messageDate, 'MMM d, yyyy');
  };

  const handleChatSelect = (userId: string) => {
    router.push(`/chats/${userId}`);  // Updated route path
  };

  if (!user) {
    return (
      <div className="min-h-screen relative">
        <div className="gradient-dark-bg" />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center p-8 rounded-xl border border-purple-500/20 bg-black/30 backdrop-blur-lg">
            <p className="text-gray-300 text-lg mb-6">Please sign in to view your messages</p>
            <Link 
              href="/login"
              className="primary-button inline-flex items-center"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen relative">
        <div className="gradient-dark-bg" />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <div className="text-center p-8 rounded-xl border border-purple-500/20 bg-black/30 backdrop-blur-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
            <p className="mt-4 text-gray-300 text-lg">Loading conversations...</p>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-purple-500/20 bg-black/30 backdrop-blur-lg overflow-hidden"
          >
            <div className="p-6 border-b border-purple-500/20 bg-black/40">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold gradient-text flex items-center gap-2">
                  <MessageSquare className="h-6 w-6" />
                  Messages
                </h1>
                <Badge variant="outline" className="border-purple-500/30 text-purple-200">
                  {chatUsers.length} conversations
                </Badge>
              </div>
            </div>
            
            <div className="divide-y divide-purple-500/10">
              {chatUsers.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-12 text-center"
                >
                  <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare className="w-8 h-8 text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No messages yet</h3>
                  <p className="text-gray-400 mb-6">
                    Start a conversation by discovering other hackers!
                  </p>
                  <Link 
                    href="/discover"
                    className="primary-button inline-flex items-center gap-2"
                  >
                    Discover Hackers
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              ) : (
                chatUsers.map((chatUser) => (
                  <motion.div
                    key={chatUser.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
                    onClick={() => handleChatSelect(chatUser.id)}
                    className="p-4 cursor-pointer transition-all duration-300 group"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12 ring-2 ring-purple-500/20 group-hover:ring-purple-500/40 transition-all">
                        <AvatarImage src={chatUser.photoUrl} />
                        <AvatarFallback className="bg-purple-500/20 text-purple-200">
                          {chatUser.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline">
                          <h3 className="text-base font-semibold text-white truncate group-hover:text-purple-400 transition-colors">
                            {chatUser.name}
                          </h3>
                          {chatUser.lastMessageTime && (
                            <span className="text-xs text-gray-400 flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatLastMessageTime(chatUser.lastMessageTime)}
                            </span>
                          )}
                        </div>
                        {chatUser.lastMessage && (
                          <p className="text-sm text-gray-400 truncate mt-1">
                            {chatUser.lastMessage}
                          </p>
                        )}
                      </div>
                      {chatUser.unreadCount ? (
                        <Badge className="bg-purple-500 hover:bg-purple-600">
                          {chatUser.unreadCount}
                        </Badge>
                      ) : null}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
} 