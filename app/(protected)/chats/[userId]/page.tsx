'use client'

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { db } from '@/app/lib/firebaseConfig';
import { 
  doc, 
  getDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  Timestamp,
  or,
  and 
} from 'firebase/firestore';
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { format } from 'date-fns';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Timestamp;
}

interface UserProfile {
  id: string;
  name: string;
  photoUrl?: string;
}

export default function ChatPage() {
  const params = useParams();
  const userId = params.userId as string;
  const router = useRouter();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [receiverProfile, setReceiverProfile] = useState<UserProfile | null>(null);
  const [senderProfile, setSenderProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (userId && user) {
      // Fetch profiles
      const fetchProfiles = async () => {
        try {
          // Fetch receiver's profile
          const receiverDoc = await getDoc(doc(db, 'users', userId));
          if (receiverDoc.exists()) {
            setReceiverProfile({ 
              id: receiverDoc.id, 
              name: receiverDoc.data().name || 'Anonymous',
              photoUrl: receiverDoc.data().photoUrl 
            });
          }

          // Fetch sender's profile
          const senderDoc = await getDoc(doc(db, 'users', user.uid));
          if (senderDoc.exists()) {
            setSenderProfile({ 
              id: senderDoc.id, 
              name: senderDoc.data().name || 'Anonymous',
              photoUrl: senderDoc.data().photoUrl 
            });
          }
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching profiles:", error);
          setIsLoading(false);
        }
      };

      fetchProfiles();

      // Subscribe to messages
      const messagesRef = collection(db, 'messages');
      const q = query(
        messagesRef,
        or(
          and(
            where('senderId', '==', user.uid),
            where('receiverId', '==', userId)
          ),
          and(
            where('senderId', '==', userId),
            where('receiverId', '==', user.uid)
          )
        ),
        orderBy('timestamp', 'asc')
      );

      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          const newMessages = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Message));
          setMessages(newMessages);
          scrollToBottom();
        },
        (error) => {
          console.error("Error fetching messages:", error);
          if (error.code === 'permission-denied') {
            console.log("You don't have permission to access this chat");
          }
        }
      );

      return () => unsubscribe();
    }
  }, [userId, user]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !userId) return;

    try {
      const messagesRef = collection(db, 'messages');
      await addDoc(messagesRef, {
        content: newMessage,
        senderId: user.uid,
        receiverId: userId,
        timestamp: Timestamp.now(),
        participants: [user.uid, userId]
      });

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatMessageTime = (timestamp: Timestamp) => {
    if (!timestamp) return '';
    return format(timestamp.toDate(), 'h:mm a');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="container mx-auto pt-24 px-4 pb-12">
        <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          {/* Chat Header */}
          <div className="p-6 border-b bg-white/90 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12 ring-2 ring-offset-2 ring-indigo-600">
                  <AvatarImage src={receiverProfile?.photoUrl} />
                  <AvatarFallback className="bg-indigo-100 text-indigo-600 font-medium">
                    {receiverProfile?.name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{receiverProfile?.name}</h2>
                  <p className="text-sm text-gray-500 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Online
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                className="text-gray-500 hover:text-gray-700"
                onClick={() => router.push('/chats')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-[calc(100vh-320px)] overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50/50 to-white/30 backdrop-blur-sm">
            {messages.map((message) => {
              const isCurrentUser = message.senderId === user?.uid;
              const profile = isCurrentUser ? senderProfile : receiverProfile;

              return (
                <div
                  key={message.id}
                  className={`flex items-start space-x-2 ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}
                >
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={profile?.photoUrl} />
                    <AvatarFallback className="bg-indigo-100 text-indigo-600 text-sm font-medium">
                      {profile?.name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ${
                        isCurrentUser
                          ? 'bg-indigo-600 text-white'
                          : 'bg-white text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <span className="text-xs text-gray-500 mt-1 px-2">
                      {formatMessageTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <form onSubmit={sendMessage} className="p-4 border-t bg-white/90 backdrop-blur-sm">
            <div className="flex space-x-4">
              <Input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button type="submit" disabled={!newMessage.trim()}>
                Send
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 