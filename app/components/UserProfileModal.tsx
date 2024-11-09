'use client'

import { useRouter } from 'next/navigation'
import { CardContent } from "./ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"

interface UserProfileModalProps {
  user: {
    id: string;
    name?: string;
    photoUrl?: string;
    college?: string;
    role?: string;
    skills?: string;
    bio?: string;
  }
}

export default function UserProfileModal({ user }: UserProfileModalProps) {
  const router = useRouter()

  const handleViewProfile = () => {
    router.push(`/user/${user.id}`)
  }

  return (
    <CardContent className="p-6">
      <div className="flex flex-col items-center text-center">
        <Avatar className="h-24 w-24 mb-4 ring-2 ring-purple-500/20">
          <AvatarImage src={user.photoUrl} alt={user.name} />
          <AvatarFallback className="bg-purple-500/20">{user.name?.[0]}</AvatarFallback>
        </Avatar>
        <h3 className="text-xl font-semibold mb-2 text-white">{user.name}</h3>
        {user.role && (
          <Badge className="mb-2 bg-purple-500/10 text-purple-200 border-purple-500/30">
            {user.role}
          </Badge>
        )}
        {user.college && (
          <p className="text-sm text-gray-400 mb-2">{user.college}</p>
        )}
        {user.bio && (
          <p className="text-sm text-gray-300 mb-4 line-clamp-2">{user.bio}</p>
        )}
        {user.skills && (
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {user.skills.split(',').slice(0, 3).map((skill, index) => (
              <Badge 
                key={index} 
                variant="outline"
                className="border-purple-500/30 text-purple-200"
              >
                {skill.trim()}
              </Badge>
            ))}
            {user.skills.split(',').length > 3 && (
              <Badge 
                variant="outline"
                className="border-purple-500/30 text-purple-200"
              >
                +{user.skills.split(',').length - 3} more
              </Badge>
            )}
          </div>
        )}
        <Button 
          onClick={handleViewProfile} 
          className="w-full bg-gradient-to-r from-[#52057B] to-[#892CDC] hover:from-[#892CDC] hover:to-[#BC6FF1] text-white"
        >
          View Profile
        </Button>
      </div>
    </CardContent>
  )
} 