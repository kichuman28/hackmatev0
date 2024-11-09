'use client'

import { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { db } from '@/app/lib/firebaseConfig';
import { 
  doc, getDoc, collection, addDoc, query, 
  where, orderBy, onSnapshot, Timestamp, or, and 
} from 'firebase/firestore';
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Smile, Send, ArrowLeft, MoreVertical, Image, Paperclip } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";

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

interface MessageGroup {
  date: string;
  messages: Message[];
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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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

  const onEmojiSelect = (emoji: any) => {
    setNewMessage(prev => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  // Group messages by date
  const groupedMessages = useMemo(() => {
    return messages.reduce((groups: MessageGroup[], message) => {
      const date = format(message.timestamp.toDate(), 'MMMM d, yyyy');
      
      const existingGroup = groups.find(group => group.date === date);
      if (existingGroup) {
        existingGroup.messages.push(message);
      } else {
        groups.push({ date, messages: [message] });
      }
      
      return groups;
    }, []);
  }, [messages]);

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
    <div className="min-h-screen relative pt-32 pb-8">
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
        <div className="max-w-4xl mx-auto h-[calc(100vh-4rem)] flex flex-col rounded-lg overflow-hidden border border-purple-500/20">
          {/* Chat Header */}
          <div className="p-4 border-b border-purple-500/20 bg-black/40 backdrop-blur-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-white hover:bg-purple-500/20"
                  onClick={() => router.push('/chats')}
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
                <Avatar className="h-10 w-10 ring-2 ring-purple-500/20">
                  <AvatarImage src={receiverProfile?.photoUrl} />
                  <AvatarFallback className="bg-purple-500/20 text-purple-200">
                    {receiverProfile?.name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-semibold text-white">{receiverProfile?.name}</h2>
                  <p className="text-sm text-gray-400 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Online
                  </p>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-purple-500/20">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-black/90 border-purple-500/20">
                  <DropdownMenuItem className="text-white hover:bg-purple-500/20">
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-purple-500/20">
                    Clear Chat
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-400 hover:bg-red-500/20">
                    Block User
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-black/20 backdrop-blur-lg">
            {groupedMessages.map((group, groupIndex) => (
              <div key={group.date} className="space-y-4">
                <div className="sticky top-2 flex justify-center">
                  <span className="px-3 py-1 text-xs text-purple-200 bg-black/40 rounded-full border border-purple-500/20 backdrop-blur-sm">
                    {group.date}
                  </span>
                </div>
                
                {group.messages.map((message, messageIndex) => {
                  const isCurrentUser = message.senderId === user?.uid;
                  const profile = isCurrentUser ? senderProfile : receiverProfile;
                  const showAvatar = messageIndex === group.messages.length - 1 || 
                    group.messages[messageIndex + 1]?.senderId !== message.senderId;

                  return (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-end space-x-2 ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}
                    >
                      {showAvatar ? (
                        <Avatar className="h-8 w-8 mb-4">
                          <AvatarImage src={profile?.photoUrl} />
                          <AvatarFallback className="bg-purple-500/20 text-purple-200">
                            {profile?.name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div className="w-8" /> // Placeholder for alignment
                      )}
                      <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                            isCurrentUser
                              ? 'bg-gradient-to-r from-[#52057B] to-[#892CDC] text-white'
                              : 'bg-black/40 text-white'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <span className="text-xs text-gray-400 mt-1 px-2">
                          {format(message.timestamp.toDate(), 'h:mm a')}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-purple-500/20 bg-black/40 backdrop-blur-lg">
            <form onSubmit={sendMessage} className="relative">
              <div className="flex items-center space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        className="text-white hover:bg-purple-500/20"
                      >
                        <Paperclip className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Attach file</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-black/20 border-purple-500/20 text-white placeholder:text-gray-400"
                />

                <div className="relative">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="icon"
                          className="text-white hover:bg-purple-500/20"
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        >
                          <Smile className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add emoji</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {showEmojiPicker && (
                    <div className="absolute bottom-full right-0 mb-2">
                      <Picker 
                        data={data} 
                        onEmojiSelect={onEmojiSelect}
                        theme="dark"
                      />
                    </div>
                  )}
                </div>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        type="submit" 
                        size="icon"
                        disabled={!newMessage.trim()}
                        className="bg-gradient-to-r from-[#52057B] to-[#892CDC] hover:from-[#892CDC] hover:to-[#BC6FF1] text-white"
                      >
                        <Send className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Send message</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
} 