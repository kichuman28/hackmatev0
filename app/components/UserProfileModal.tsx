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
        <Avatar className="h-24 w-24 mb-4">
          <AvatarImage src={user.photoUrl} alt={user.name} />
          <AvatarFallback>{user.name?.[0]}</AvatarFallback>
        </Avatar>
        <h3 className="text-lg font-semibold mb-2">{user.name}</h3>
        {user.role && <Badge className="mb-2">{user.role}</Badge>}
        {user.college && <p className="text-sm text-gray-500 mb-2">{user.college}</p>}
        {user.bio && <p className="text-sm mb-4">{user.bio}</p>}
        {user.skills && (
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {user.skills.split(',').map((skill, index) => (
              <Badge key={index} variant="secondary">{skill.trim()}</Badge>
            ))}
          </div>
        )}
        <Button onClick={handleViewProfile} className="w-full">
          View Profile
        </Button>
      </div>
    </CardContent>
  )
} 