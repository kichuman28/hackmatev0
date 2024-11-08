'use client'
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/app/hooks/useAuth';
import { db } from '@/app/lib/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import "@/app/globals.css";
import { Badge } from "@/app/components/ui/badge";
import { 
  TEAM_STATUS, 
  EXPERIENCE_LEVELS, 
  PROJECT_INTERESTS, 
  TEAM_SIZES,
  HACKATHON_INTERESTS,
  COMMUNICATION_PREFERENCES 
} from '@/app/constants';
import { toast } from '@/app/components/ui/use-toast';
import { useRouter } from 'next/navigation'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/app/lib/firebaseConfig';

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
    <div className="max-w-4xl mx-auto mt-24 p-4">
      <div className="relative">
        <div className="h-64 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg shadow-lg"></div>
        <Avatar className="w-40 h-40 absolute bottom-0 left-8 transform translate-y-1/2 border-4 border-white rounded-full shadow-xl">
          <AvatarImage src={profile.photoUrl} alt="Profile" />
          <AvatarFallback className="text-2xl">{profile.name?.[0] || 'U'}</AvatarFallback>
        </Avatar>
      </div>
      <div className="mt-24 px-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{profile.name || user.displayName || 'Anonymous User'}</h1>
            <p className="text-gray-600 text-lg mt-2">{profile.college || 'College not specified'}</p>
          </div>
          <Button onClick={onEdit} className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 transition-colors">
            Edit Profile
          </Button>
        </div>
        
        <div className="flex gap-4 mt-6">
          <div className="bg-white rounded-lg shadow-md p-4 flex-1 text-center">
            <p className="text-2xl font-bold text-indigo-600">{profile.followers || 0}</p>
            <p className="text-gray-600">Followers</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4 flex-1 text-center">
            <p className="text-2xl font-bold text-indigo-600">{profile.following || 0}</p>
            <p className="text-gray-600">Following</p>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <p className="text-gray-700 leading-relaxed">{profile.bio || 'No bio provided'}</p>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Education</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Course</p>
              <p className="font-medium">{profile.course || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-gray-600">Semester</p>
              <p className="font-medium">{profile.semester || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-gray-600">Branch</p>
              <p className="font-medium">{profile.branch || 'Not specified'}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {profile.skills.split(',').map((skill, index) => (
              <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                {skill.trim()}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Role</h2>
          <span className="px-4 py-2 bg-indigo-600 text-white rounded-full text-sm uppercase">
            {profile.role || 'Not specified'}
          </span>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Team Preferences</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-600">Team Status</p>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                {profile.teamStatus ? profile.teamStatus.replace(/_/g, ' ').toLowerCase() : 'Not specified'}
              </span>
            </div>

            <div>
              <p className="text-gray-600">Experience Level</p>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                {profile.experienceLevel || 'Not specified'}
              </span>
            </div>

            <div>
              <p className="text-gray-600">Project Interests</p>
              <div className="flex flex-wrap gap-2">
                {profile.projectInterests?.map((interest, index) => (
                  <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                    {interest}
                  </span>
                )) || <span className="text-gray-500">No interests specified</span>}
              </div>
            </div>

            <div>
              <p className="text-gray-600">Preferred Team Size</p>
              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                {profile.preferredTeamSize || 'Not specified'}
              </span>
            </div>

            <div>
              <p className="text-gray-600">Hackathon Interests</p>
              <div className="flex flex-wrap gap-2">
                {profile.hackathonInterests?.map((interest, index) => (
                  <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                    {interest}
                  </span>
                )) || <span className="text-gray-500">No interests specified</span>}
              </div>
            </div>

            <div>
              <p className="text-gray-600">Communication Preferences</p>
              <div className="flex flex-wrap gap-2">
                {profile.communicationPreference?.map((pref, index) => (
                  <span key={index} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                    {pref}
                  </span>
                )) || <span className="text-gray-500">Not specified</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profile.projects && profile.projects.length > 0 ? (
              profile.projects.map((project, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <p className="font-medium mb-3">{project.description}</p>
                  <div className="flex flex-col space-y-2">
                    <a href={project.github} target="_blank" rel="noopener noreferrer" 
                       className="flex items-center text-indigo-600 hover:text-indigo-800">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                      </svg>
                      GitHub Repository
                    </a>
                    <a href={project.deployed} target="_blank" rel="noopener noreferrer" 
                       className="flex items-center text-indigo-600 hover:text-indigo-800">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Live Demo
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No projects added yet.</p>
            )}
          </div>
        </div>

        <div className="mt-8 flex space-x-4">
          {profile.linkedIn && (
            <a href={profile.linkedIn} target="_blank" rel="noopener noreferrer" 
               className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <span className="mr-2">LinkedIn</span>
            </a>
          )}
          {profile.github && (
            <a href={profile.github} target="_blank" rel="noopener noreferrer" 
               className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors">
              <span className="mr-2">GitHub</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    bio: '',
    skills: '',
    college: '',
    course: '',
    semester: '',
    branch: '',
    linkedIn: '',
    github: '',
    role: '',
    followers: 0,
    following: 0,
    projects: [],
    teamStatus: '',
    projectInterests: [],
    experienceLevel: '',
    availabilityPreference: '',
    communicationPreference: [],
    preferredTeamSize: '',
    hackathonInterests: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      const getProfile = async () => {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as ProfileData;
          setProfile({
            ...data,
            name: data.name || user.displayName || 'Anonymous User',
            projects: data.projects || [],
          });
        } else {
          setProfile(prev => ({ 
            ...prev, 
            name: user.displayName || 'Anonymous User',
            projects: [],
          }));
        }
      };

      getProfile();
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProjectChange = (index: number, field: string, value: string) => {
    const updatedProjects = [...profile.projects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    setProfile({ ...profile, projects: updatedProjects });
  };

  const addProject = () => {
    setProfile({ ...profile, projects: [...profile.projects, { description: '', github: '', deployed: '' }] });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const userDocRef = doc(db, 'users', user!.uid);
      await setDoc(userDocRef, {
        ...profile,
        projectInterests: profile.projectInterests || [],
        hackathonInterests: profile.hackathonInterests || [],
        communicationPreference: profile.communicationPreference || [],
      }, { merge: true });

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleArrayField = (field: keyof ProfileData, itemValue: string) => {
    setProfile(prev => {
      const array = prev[field] as string[] || [];
      return {
        ...prev,
        [field]: array.includes(itemValue)
          ? array.filter(item => item !== itemValue)
          : [...array, itemValue]
      };
    });
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Error",
          description: "Please upload a valid image file (JPEG, JPG, or PNG)",
          variant: "destructive",
        });
        return;
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast({
          title: "Error",
          description: "Image size should be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      try {
        // Upload to Firebase Storage
        const storageRef = ref(storage, `profile-photos/${user!.uid}`);
        await uploadBytes(storageRef, file);
        const photoUrl = await getDownloadURL(storageRef);

        // Update profile with new photo URL
        setProfile(prev => ({
          ...prev,
          photoUrl
        }));

        // Update Firestore
        const userDocRef = doc(db, 'users', user!.uid);
        await setDoc(userDocRef, { photoUrl }, { merge: true });

        toast({
          title: "Success",
          description: "Profile photo updated successfully",
        });
      } catch (error) {
        console.error("Error uploading photo:", error);
        toast({
          title: "Error",
          description: "Failed to upload profile photo",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto pt-24 px-4">
        {isEditing ? (
          <div className="container mx-auto mt-10 p-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Edit Your Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={profile.photoUrl} alt={profile.name || 'User'} />
                      <AvatarFallback>{profile.name?.[0] || 'U'}</AvatarFallback>
                    </Avatar>
                    <Input type="file" onChange={handlePhotoChange} accept="image/*" />
                  </div>
                  <div>
                    <label className="block mb-1">Name</label>
                    <Input
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Bio</label>
                    <Textarea
                      name="bio"
                      value={profile.bio}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">College</label>
                    <Input
                      type="text"
                      name="college"
                      value={profile.college}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Course</label>
                    <Input
                      type="text"
                      name="course"
                      value={profile.course}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Semester</label>
                    <Input
                      type="text"
                      name="semester"
                      value={profile.semester}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Branch</label>
                    <Input
                      type="text"
                      name="branch"
                      value={profile.branch}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Skills (comma-separated)</label>
                    <Input
                      type="text"
                      name="skills"
                      value={profile.skills}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Role</label>
                    <Select onValueChange={(value) => handleSelectChange('role', value)} value={profile.role}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select your primary role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="frontend">Frontend</SelectItem>
                        <SelectItem value="backend">Backend</SelectItem>
                        <SelectItem value="fullstack">Full Stack</SelectItem>
                        <SelectItem value="devops">DevOps</SelectItem>
                        <SelectItem value="ml">Machine Learning</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block mb-1">LinkedIn</label>
                    <Input
                      type="url"
                      name="linkedIn"
                      value={profile.linkedIn}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">GitHub</label>
                    <Input
                      type="url"
                      name="github"
                      value={profile.github}
                      onChange={handleChange}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Projects</label>
                    {profile.projects.map((project, index) => (
                      <div key={index} className="mb-4">
                        <Textarea
                          value={project.description}
                          onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                          placeholder="Project Description"
                          className="mb-2 w-full"
                        />
                        <Input
                          value={project.github}
                          onChange={(e) => handleProjectChange(index, 'github', e.target.value)}
                          placeholder="GitHub Repository URL"
                          className="mb-2 w-full"
                        />
                        <Input
                          value={project.deployed}
                          onChange={(e) => handleProjectChange(index, 'deployed', e.target.value)}
                          placeholder="Deployed Project URL"
                          className="mb-2 w-full"
                        />
                      </div>
                    ))}
                    <Button onClick={addProject} type="button" variant="outline" className="mb-4">Add Another Project</Button>
                  </div>
                  <div className="space-y-6 mt-6">
                    <h3 className="text-xl font-semibold">Team Preferences</h3>
                    
                    <div>
                      <label className="block mb-1">Team Status</label>
                      <Select 
                        value={profile.teamStatus} 
                        onValueChange={(value) => handleSelectChange('teamStatus', value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Team Status" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(TEAM_STATUS).map(([key]) => (
                            <SelectItem key={key} value={key}>
                              {key.charAt(0) + key.slice(1).toLowerCase().replace('_', ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block mb-1">Experience Level</label>
                      <Select 
                        value={profile.experienceLevel} 
                        onValueChange={(value) => handleSelectChange('experienceLevel', value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Experience Level" />
                        </SelectTrigger>
                        <SelectContent>
                          {EXPERIENCE_LEVELS.map((level: string) => (
                            <SelectItem key={level} value={level.toLowerCase()}>
                              {level}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block mb-1">Project Interests</label>
                      <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-md">
                        {PROJECT_INTERESTS.map((interest: string) => (
                          <Badge
                            key={interest}
                            variant={profile.projectInterests?.includes(interest) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => toggleArrayField('projectInterests', interest)}
                          >
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block mb-1">Preferred Team Size</label>
                      <Select 
                        value={profile.preferredTeamSize} 
                        onValueChange={(value) => handleSelectChange('preferredTeamSize', value)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Team Size" />
                        </SelectTrigger>
                        <SelectContent>
                          {TEAM_SIZES.map((size: { value: string; label: string }) => (
                            <SelectItem key={size.value} value={size.value}>
                              {size.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block mb-1">Hackathon Interests</label>
                      <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-md">
                        {HACKATHON_INTERESTS.map((interest: string) => (
                          <Badge
                            key={interest}
                            variant={profile.hackathonInterests?.includes(interest) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => toggleArrayField('hackathonInterests', interest)}
                          >
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block mb-1">Communication Preferences</label>
                      <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-md">
                        {COMMUNICATION_PREFERENCES.map((pref: string) => (
                          <Badge
                            key={pref}
                            variant={profile.communicationPreference?.includes(pref) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => toggleArrayField('communicationPreference', pref)}
                          >
                            {pref}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-4">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? 'Updating...' : 'Update Profile'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        ) : (
          <ProfileView profile={profile} user={user} onEdit={() => setIsEditing(true)} />
        )}
      </div>
    </div>
  );
}
