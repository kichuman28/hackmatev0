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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={profile.photoUrl} alt={profile.name} />
          <AvatarFallback>{profile.name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <CardTitle className="text-xl">
            <Link href={`/profile/${profile.id}`} className="hover:underline">
              {profile.name}
            </Link>
          </CardTitle>
          <p className="text-sm text-muted-foreground">{profile.college}</p>
        </div>
        <Badge variant="outline">{profile.experienceLevel}</Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium mb-2">Role</p>
            <Badge variant="secondary">{profile.role}</Badge>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Skills</p>
            <div className="flex flex-wrap gap-2">
              {skillsArray.map((skill, i) => (
                <Badge key={i} variant="outline">{skill}</Badge>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Project Interests</p>
            <div className="flex flex-wrap gap-2">
              {profile.projectInterests?.map((interest, i) => (
                <Badge key={i} variant="secondary">{interest}</Badge>
              ))}
            </div>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="w-full" disabled={isLoading}>
                Connect
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Connect with {profile.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  placeholder="Write a message introducing yourself and why you'd like to team up..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button 
                  onClick={handleConnect} 
                  className="w-full"
                  disabled={isLoading || !message.trim()}
                >
                  {isLoading ? "Sending..." : "Send Request"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}; 