import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { useToast } from "./ui/use-toast";
import { db } from '@/app/lib/firebaseConfig';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { UserProfile, TeamConnection } from '@/app/types/team';
import Link from 'next/link';

interface TeamCardProps {
  profile: UserProfile;
  currentUserId: string;
}

export const TeamCard = ({ profile, currentUserId }: TeamCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  // Convert the skills string to an array by splitting on commas
  const skillsArray = profile.skills ? profile.skills.split(',').map(skill => skill.trim()) : [];

  const checkExistingConnection = async () => {
    const q = query(
      collection(db, 'teamConnections'),
      where('fromUserId', '==', currentUserId),
      where('toUserId', '==', profile.id),
      where('status', 'in', ['pending', 'accepted'])
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  };

  const handleConnect = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const exists = await checkExistingConnection();
      if (exists) {
        toast({
          title: "Connection already exists",
          description: "You have already sent a connection request to this user.",
          variant: "destructive",
        });
        setIsOpen(false);
        return;
      }

      const connection: Omit<TeamConnection, 'id'> = {
        fromUserId: currentUserId,
        toUserId: profile.id,
        status: 'pending',
        timestamp: new Date(),
        message: message.trim(),
      };

      await addDoc(collection(db, 'teamConnections'), connection);

      toast({
        title: "Connection request sent!",
        description: "We'll notify you when they respond.",
      });

      setIsOpen(false);
      setMessage('');
    } catch (error) {
      console.error('Error sending connection request:', error);
      toast({
        title: "Error sending request",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden border-purple-500/20 bg-black/30 backdrop-blur-lg hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 h-[400px] flex flex-col">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-12 w-12 ring-2 ring-purple-500/20">
          <AvatarImage src={profile.photoUrl} alt={profile.name} />
          <AvatarFallback className="bg-purple-500/20">{profile.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <CardTitle className="text-xl text-white truncate">
            <Link href={`/profile/${profile.id}`} className="hover:text-purple-400 transition-colors">
              {profile.name}
            </Link>
          </CardTitle>
          <p className="text-sm text-gray-400 truncate">{profile.college}</p>
        </div>
        <Badge variant="outline" className="border-purple-500/30 text-purple-200 shrink-0">
          {profile.experienceLevel}
        </Badge>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="space-y-4 flex-1">
          <div>
            <p className="text-sm font-medium mb-2 text-gray-400">Role</p>
            <Badge variant="secondary" className="bg-purple-500/10 text-purple-200">
              {profile.role}
            </Badge>
          </div>

          <div>
            <p className="text-sm font-medium mb-2 text-gray-400">Skills</p>
            <div className="flex flex-wrap gap-2">
              {skillsArray.slice(0, 3).map((skill, i) => (
                <Badge 
                  key={i} 
                  variant="outline"
                  className="border-purple-500/30 text-purple-200 hover:bg-purple-500/10"
                >
                  {skill}
                </Badge>
              ))}
              {skillsArray.length > 3 && (
                <Badge variant="outline" className="border-purple-500/30 text-purple-200">
                  +{skillsArray.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2 text-gray-400">Project Interests</p>
            <div className="flex flex-wrap gap-2">
              {profile.projectInterests?.slice(0, 3).map((interest, i) => (
                <Badge 
                  key={i} 
                  variant="secondary"
                  className="bg-purple-500/10 text-purple-200"
                >
                  {interest}
                </Badge>
              ))}
              {(profile.projectInterests?.length || 0) > 3 && (
                <Badge variant="secondary" className="bg-purple-500/10 text-purple-200">
                  +{profile.projectInterests!.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button 
              className="w-full bg-gradient-to-r from-[#52057B] to-[#892CDC] hover:from-[#892CDC] hover:to-[#BC6FF1] text-white mt-4"
              disabled={isLoading}
            >
              Connect
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-black/95 border-purple-500/30">
            <DialogHeader>
              <DialogTitle className="text-white">Connect with {profile.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                placeholder="Write a message introducing yourself and why you'd like to team up..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[100px] bg-black/50 border-purple-500/30 focus:border-purple-500/50 placeholder:text-gray-500"
              />
              <Button 
                onClick={handleConnect} 
                className="w-full bg-gradient-to-r from-[#52057B] to-[#892CDC] hover:from-[#892CDC] hover:to-[#BC6FF1] text-white"
                disabled={isLoading || !message.trim()}
              >
                {isLoading ? "Sending..." : "Send Request"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}; 