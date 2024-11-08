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
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
          <p className="text-gray-600 text-lg">Please sign in to view your messages</p>
          <Link 
            href="/login"
            className="mt-4 inline-block px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="container mx-auto pt-24 px-4 pb-12">
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="p-6 border-b bg-white/90">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
              <span className="text-sm text-gray-500">{chatUsers.length} conversations</span>
            </div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {chatUsers.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg mb-4">No messages yet</p>
                <p className="text-sm text-gray-400 mb-6">
                  Start a conversation by discovering other hackers!
                </p>
                <Link 
                  href="/discover"
                  className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-all transform hover:scale-105"
                >
                  <span>Discover Hackers</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            ) : (
              chatUsers.map((chatUser) => (
                <div
                  key={chatUser.id}
                  onClick={() => handleChatSelect(chatUser.id)}
                  className="p-4 hover:bg-white/60 cursor-pointer transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12 ring-2 ring-offset-2 ring-transparent group-hover:ring-indigo-600 transition-all">
                      <AvatarImage src={chatUser.photoUrl} />
                      <AvatarFallback className="bg-indigo-100 text-indigo-600 font-medium">
                        {chatUser.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                          {chatUser.name}
                        </h3>
                        {chatUser.lastMessageTime && (
                          <span className="text-xs text-gray-500 flex items-center">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formatLastMessageTime(chatUser.lastMessageTime)}
                          </span>
                        )}
                      </div>
                      {chatUser.lastMessage && (
                        <p className="text-sm text-gray-500 truncate mt-1">
                          {chatUser.lastMessage}
                        </p>
                      )}
                    </div>
                    {chatUser.unreadCount ? (
                      <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-600 text-white text-xs font-medium">
                        {chatUser.unreadCount}
                      </span>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 