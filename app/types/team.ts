export interface UserProfile {
  id: string;
  name: string;
  bio: string;
  skills: string;
  college: string;
  course: string;
  semester: string;
  branch: string;
  linkedIn: string;
  github: string;
  role: string;
  photoUrl?: string;
  teamStatus: string;
  projectInterests: string[];
  experienceLevel: string;
  availabilityPreference: string;
  communicationPreference: string[];
  preferredTeamSize: string;
  hackathonInterests: string[];
  projects: {
    description: string;
    github: string;
    deployed: string;
  }[];
}

export interface TeamConnection {
  id?: string;
  fromUserId: string;
  toUserId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  timestamp: Date;
  message?: string;
  projectIdea?: string;
}

export interface TeamFilters {
  projectInterest: string;
  teamStatus: string;
  experienceLevel: string;
} 