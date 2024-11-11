'use client'
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { db, storage } from '@/app/lib/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Card } from "@/app/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Badge } from "@/app/components/ui/badge";
import { Github, Linkedin } from 'lucide-react';
import { useToast } from "@/app/components/ui/use-toast";
import { TEAM_STATUS, EXPERIENCE_LEVELS, PROJECT_INTERESTS, HACKATHON_INTERESTS } from '@/app/constants';
import { getDownloadURL, uploadBytes, ref } from 'firebase/storage';
import { useRouter } from 'next/navigation';

interface ProfileData {
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
  followers?: number;
  following?: number;
  projects: {
    description: string;
    github: string;
    deployed: string;
  }[];
  teamStatus: string;
  projectInterests: string[];
  experienceLevel: string;
  availabilityPreference: string;
  communicationPreference: string[];
  preferredTeamSize: string;
  hackathonInterests: string[];
}

interface ProfileViewProps {
  profile: ProfileData;
  user: {
    uid: string;
    displayName: string | null;
  };
  onEdit: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({ profile, user, onEdit }) => {
  return (
    <>
      {/* Left Column - Profile Info */}
      <div className="lg:col-span-1 space-y-6">
        <Card className="p-6 bg-black/30 backdrop-blur-lg border-[#52057B]/20 hover:border-[#BC6FF1]/40 transition-colors">
          <div className="flex flex-col items-center text-center">
            <Avatar className="w-48 h-48 mb-6 ring-4 ring-purple-500/30">
              <AvatarImage src={profile.photoUrl} alt="Profile" />
              <AvatarFallback className="text-4xl">{profile.name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <h1 className="text-3xl font-bold gradient-text mb-2">
              {profile.name || user.displayName || 'Anonymous User'}
            </h1>
            <p className="text-xl text-gray-400 mb-4">{profile.role || 'Role not specified'}</p>
            <p className="text-gray-500">{profile.college || 'College not specified'}</p>
            
            <div className="flex gap-4 mt-6">
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors">
                  <Github className="w-6 h-6" />
                </a>
              )}
              {profile.linkedIn && (
                <a href={profile.linkedIn} target="_blank" rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="w-6 h-6" />
                </a>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-black/50 backdrop-blur-lg border-white/10">
          <h2 className="text-xl font-semibold mb-4 gradient-text">Education</h2>
          <div className="space-y-3">
            <div>
              <p className="text-gray-400">Course</p>
              <p className="font-medium text-white">{profile.course || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-gray-400">Semester</p>
              <p className="font-medium text-white">{profile.semester || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-gray-400">Branch</p>
              <p className="font-medium text-white">{profile.branch || 'Not specified'}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Right Column - Details */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="p-6 bg-black/30 backdrop-blur-lg border-[#52057B]/20 hover:border-[#BC6FF1]/40 transition-colors">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold gradient-text">About Me</h2>
            <Button onClick={onEdit} className="primary-button">
              Edit Profile
            </Button>
          </div>
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
            {profile.bio || 'No bio provided'}
          </p>
        </Card>

        <Card className="p-6 bg-black/50 backdrop-blur-lg border-white/10">
          <h2 className="text-xl font-semibold mb-4 gradient-text">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.split(',').map((skill, index) => (
              <Badge key={index} variant="secondary" className="bg-purple-500/20 text-purple-200">
                {skill.trim()}
              </Badge>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-black/50 backdrop-blur-lg border-white/10">
          <h2 className="text-xl font-semibold mb-4 gradient-text">Projects</h2>
          <div className="space-y-6">
            {profile.projects.map((project, index) => (
              <div key={index} className="p-4 bg-white/5 rounded-lg">
                <p className="text-gray-300 mb-3">{project.description}</p>
                <div className="flex gap-4">
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer"
                      className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1">
                      <Github className="w-4 h-4" /> Repository
                    </a>
                  )}
                  {project.deployed && (
                    <a href={project.deployed} target="_blank" rel="noopener noreferrer"
                      className="text-sm text-purple-400 hover:text-purple-300">
                      Live Demo →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-black/50 backdrop-blur-lg border-white/10">
          <h2 className="text-xl font-semibold mb-4 gradient-text">Hackathon Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-gray-400 mb-2">Team Status</p>
              <Badge variant="outline" className="text-purple-200">
                {profile.teamStatus ? profile.teamStatus.replace(/_/g, ' ').toLowerCase() : 'Not specified'}
              </Badge>
            </div>
            <div>
              <p className="text-gray-400 mb-2">Experience Level</p>
              <Badge variant="outline" className="text-purple-200">
                {profile.experienceLevel || 'Not specified'}
              </Badge>
            </div>
            <div>
              <p className="text-gray-400 mb-2">Project Interests</p>
              <div className="flex flex-wrap gap-2">
                {profile.projectInterests?.map((interest, index) => (
                  <Badge key={index} variant="outline" className="text-purple-200">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <p className="text-gray-400 mb-2">Hackathon Interests</p>
              <div className="flex flex-wrap gap-2">
                {profile.hackathonInterests?.map((interest, index) => (
                  <Badge key={index} variant="outline" className="text-purple-200">
                    {interest}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

const IncompleteProfile: React.FC = () => {
  const router = useRouter();
  
  return (
    <div className="min-h-screen relative">
      <div className="gradient-dark-bg" />
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-36">
          <Card className="max-w-2xl mx-auto p-8 bg-black/30 backdrop-blur-lg border-[#52057B]/20">
            <div className="text-center space-y-6">
              <h1 className="text-4xl font-bold gradient-text">Complete Your Profile</h1>
              <p className="text-gray-400 text-lg">
                Hey there, fellow hacker! 👋 Your profile is looking a bit empty. 
                Let&apos;s fix that and help you connect with amazing teammates!
              </p>
              <div className="space-y-4">
                <Button 
                  onClick={() => router.push('/onboarding')}
                  className="primary-button text-lg px-8 py-6"
                >
                  Get Started
                </Button>
                <p className="text-sm text-gray-500">
                  This will only take a few minutes
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default function ProfilePage() {
  const { user, loading } = useAuth();
  // const router = useRouter();
  const { toast } = useToast();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => prev ? ({ ...prev, [name]: value }) : null);
  };

  const handleSelectChange = (field: keyof ProfileData, value: string) => {
    setProfile(prev => prev ? ({ ...prev, [field]: value }) : null);
  };

  const handleProjectChange = (index: number, field: string, value: string) => {
    setProfile(prev => {
      if (!prev) return null;
      const newProjects = [...prev.projects];
      newProjects[index] = { ...newProjects[index], [field]: value };
      return { ...prev, projects: newProjects };
    });
  };

  const addProject = () => {
    setProfile(prev => {
      if (!prev) return null;
      return {
        ...prev,
        projects: [...prev.projects, { description: '', github: '', deployed: '' }]
      };
    });
  };

  const toggleArrayField = (field: keyof ProfileData, value: string) => {
    setProfile(prev => {
      if (!prev) return null;
      const array = prev[field] as string[];
      return {
        ...prev,
        [field]: array.includes(value)
          ? array.filter(item => item !== value)
          : [...array, value]
      };
    });
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    
    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast({
        title: "Error",
        description: "Image size should be less than 5MB",
        variant: "destructive"
      });
      return;
    }

    try {
      const photoRef = ref(storage, `profile-photos/${user!.uid}`);
      await uploadBytes(photoRef, file);
      const photoUrl = await getDownloadURL(photoRef);
      setProfile(prev => prev ? ({ ...prev, photoUrl }) : null);
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast({
        title: "Error",
        description: "Failed to upload photo",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async () => {
    if (!user || !profile) return;
    setIsSubmitting(true);

    try {
      await setDoc(doc(db, 'users', user.uid), {
        ...profile,
        onboardingCompleted: true
      });
      
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().onboardingCompleted) {
          setProfile(docSnap.data() as ProfileData);
        }
      }
      setIsLoading(false);
    };

    fetchProfile();
  }, [user]);

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto" />
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <IncompleteProfile />;
  }

  return (
    <div className="min-h-screen relative">
      {/* Add the gradient background */}
      <div className="gradient-dark-bg" />
      
      {/* Main content with relative positioning */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 py-36"> {/* Changed py-16 to py-24 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {isEditing ? (
              <div className="lg:col-span-3 space-y-6">
                {/* Left Column - Basic Info */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-1 space-y-6">
                    <Card className="p-6 bg-black/30 backdrop-blur-lg border-[#52057B]/20 hover:border-[#BC6FF1]/40 transition-colors">
                      <div className="flex flex-col items-center text-center">
                        <div className="relative group">
                          <Avatar className="w-48 h-48 mb-6 ring-4 ring-purple-500/30">
                            <AvatarImage src={profile.photoUrl} alt="Profile" />
                            <AvatarFallback className="text-4xl">{profile.name?.[0] || 'U'}</AvatarFallback>
                          </Avatar>
                          <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full">
                            <Input 
                              type="file" 
                              onChange={handlePhotoChange} 
                              accept="image/*" 
                              className="hidden"
                            />
                            <span className="text-white text-sm">Change Photo</span>
                          </label>
                        </div>
                        <Input
                          type="text"
                          name="name"
                          value={profile.name}
                          onChange={handleChange}
                          className="text-center bg-transparent border-b border-purple-500/30 focus:border-purple-500"
                          placeholder="Your Name"
                        />
                        <div className="mt-4 w-full">
                          <Select 
                            onValueChange={(value) => handleSelectChange('role', value)} 
                            value={profile.role}
                          >
                            <SelectTrigger className="w-full bg-transparent border-purple-500/30 text-white">
                              <SelectValue placeholder="Select your primary role" />
                            </SelectTrigger>
                            <SelectContent className="bg-gray-900 border-purple-500/30">
                              <SelectItem value="frontend" className="text-white hover:bg-purple-500/20">Frontend</SelectItem>
                              <SelectItem value="backend" className="text-white hover:bg-purple-500/20">Backend</SelectItem>
                              <SelectItem value="fullstack" className="text-white hover:bg-purple-500/20">Full Stack</SelectItem>
                              <SelectItem value="devops" className="text-white hover:bg-purple-500/20">DevOps</SelectItem>
                              <SelectItem value="ml" className="text-white hover:bg-purple-500/20">Machine Learning</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex gap-4 mt-6">
                          <div className="flex-1">
                            <Input
                              type="url"
                              name="github"
                              value={profile.github}
                              onChange={handleChange}
                              className="bg-transparent"
                              placeholder="GitHub URL"
                            />
                          </div>
                          <div className="flex-1">
                            <Input
                              type="url"
                              name="linkedIn"
                              value={profile.linkedIn}
                              onChange={handleChange}
                              className="bg-transparent"
                              placeholder="LinkedIn URL"
                            />
                          </div>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-6 bg-black/50 backdrop-blur-lg border-white/10">
                      <h2 className="text-xl font-semibold mb-4 gradient-text">Education</h2>
                      <div className="space-y-4">
                        <Input
                          type="text"
                          name="college"
                          value={profile.college}
                          onChange={handleChange}
                          className="bg-transparent"
                          placeholder="College"
                        />
                        <Input
                          type="text"
                          name="course"
                          value={profile.course}
                          onChange={handleChange}
                          className="bg-transparent"
                          placeholder="Course"
                        />
                        <Input
                          type="text"
                          name="semester"
                          value={profile.semester}
                          onChange={handleChange}
                          className="bg-transparent"
                          placeholder="Semester"
                        />
                        <Input
                          type="text"
                          name="branch"
                          value={profile.branch}
                          onChange={handleChange}
                          className="bg-transparent"
                          placeholder="Branch"
                        />
                      </div>
                    </Card>
                  </div>

                  {/* Right Column - Details */}
                  <div className="lg:col-span-2 space-y-6">
                    <Card className="p-6 bg-black/30 backdrop-blur-lg border-[#52057B]/20 hover:border-[#BC6FF1]/40 transition-colors">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold gradient-text">About Me</h2>
                        <div className="flex space-x-4">
                          <Button onClick={() => setIsEditing(false)} className="primary-button">
                            Cancel
                          </Button>
                          <Button onClick={handleSubmit} disabled={isSubmitting} className="primary-button">
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                          </Button>
                        </div>
                      </div>
                      <Textarea
                        name="bio"
                        value={profile.bio}
                        onChange={handleChange}
                        className="bg-transparent min-h-[150px]"
                        placeholder="Tell us about yourself..."
                      />
                    </Card>

                    <Card className="p-6 bg-black/50 backdrop-blur-lg border-white/10">
                      <h2 className="text-xl font-semibold mb-4 gradient-text">Skills</h2>
                      <Input
                        type="text"
                        name="skills"
                        value={profile.skills}
                        onChange={handleChange}
                        className="bg-transparent"
                        placeholder="Enter skills (comma-separated)"
                      />
                      {profile.skills && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {profile.skills.split(',').map((skill, index) => (
                            <Badge key={index} variant="secondary" className="bg-purple-500/20 text-purple-200">
                              {skill.trim()}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </Card>

                    <Card className="p-6 bg-black/50 backdrop-blur-lg border-white/10">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold gradient-text">Projects</h2>
                        <Button onClick={addProject} variant="outline" size="sm">
                          Add Project
                        </Button>
                      </div>
                      <div className="space-y-6">
                        {profile.projects.map((project, index) => (
                          <div key={index} className="p-4 bg-black/30 rounded-lg space-y-4">
                            <Textarea
                              value={project.description}
                              onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                              placeholder="Project Description"
                              className="bg-transparent"
                            />
                            <Input
                              value={project.github}
                              onChange={(e) => handleProjectChange(index, 'github', e.target.value)}
                              placeholder="GitHub Repository URL"
                              className="bg-transparent"
                            />
                            <Input
                              value={project.deployed}
                              onChange={(e) => handleProjectChange(index, 'deployed', e.target.value)}
                              placeholder="Deployed Project URL"
                              className="bg-transparent"
                            />
                          </div>
                        ))}
                      </div>
                    </Card>
                    <Card className="p-6 bg-black/50 backdrop-blur-lg border-white/10">
                      <h2 className="text-xl font-semibold mb-4 gradient-text">Hackathon Preferences</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">Team Status</label>
                            <Select 
                              value={profile.teamStatus} 
                              onValueChange={(value) => handleSelectChange('teamStatus', value)}
                            >
                              <SelectTrigger className="w-full bg-black/30 text-white border-gray-600">
                                <SelectValue placeholder="Select Team Status" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 text-white">
                                {Object.entries(TEAM_STATUS).map(([key]) => (
                                  <SelectItem key={key} value={key} className="hover:bg-purple-500/20">
                                    {key.charAt(0) + key.slice(1).toLowerCase().replace('_', ' ')}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-200 mb-2">Experience Level</label>
                            <Select 
                              value={profile.experienceLevel} 
                              onValueChange={(value) => handleSelectChange('experienceLevel', value)}
                            >
                              <SelectTrigger className="w-full bg-black/30 text-white border-gray-600">
                                <SelectValue placeholder="Select Experience Level" />
                              </SelectTrigger>
                              <SelectContent className="bg-gray-800 text-white">
                                {EXPERIENCE_LEVELS.map((level) => (
                                  <SelectItem key={level} value={level.toLowerCase()} className="hover:bg-purple-500/20">
                                    {level}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Project Interests</label>
                            <div className="flex flex-wrap gap-2 p-4 bg-black/30 rounded-lg">
                              {PROJECT_INTERESTS.map((interest) => (
                                <Badge
                                  key={interest}
                                  variant={profile.projectInterests?.includes(interest) ? "default" : "outline"}
                                  className={`cursor-pointer hover:bg-purple-500/20 ${
                                    profile.projectInterests?.includes(interest) ? 'text-purple-200' : 'text-white'
                                  }`}
                                  onClick={() => toggleArrayField('projectInterests', interest)}
                                >
                                  {interest}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">Hackathon Interests</label>
                            <div className="flex flex-wrap gap-2 p-4 bg-black/30 rounded-lg">
                              {HACKATHON_INTERESTS.map((interest) => (
                                <Badge
                                  key={interest}
                                  variant={profile.hackathonInterests?.includes(interest) ? "default" : "outline"}
                                  className={`cursor-pointer hover:bg-purple-500/20 ${
                                    profile.hackathonInterests?.includes(interest) ? 'text-purple-200' : 'text-white'
                                  }`}
                                  onClick={() => toggleArrayField('hackathonInterests', interest)}
                                >
                                  {interest}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            ) : (
              user && (
                <ProfileView profile={profile} user={user} onEdit={() => setIsEditing(true)} />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
