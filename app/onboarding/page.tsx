'use client'
import "@/app/globals.css";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/hooks/useAuth';
import { db, storage } from '@/app/lib/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { useToast } from "@/app/components/ui/use-toast";
import { Badge } from "@/app/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Alert, AlertDescription } from "@/app/components/ui/alert";
import { COLLEGES, COURSES, BRANCHES, SEMESTERS, SKILLS, TEAM_STATUS, EXPERIENCE_LEVELS, TEAM_SIZES, PROJECT_INTERESTS } from '@/app/constants';

// Types and Interfaces
interface Project {
  description: string;
  github: string;
  deployed: string;
}

interface OnboardingData {
  name: string;
  college: string;
  course: string;
  semester: string;
  branch: string;
  skills: string;
  github: string;
  linkedIn: string;
  role: string;
  bio: string;
  photoUrl?: string;
  projects: Project[];
  teamStatus: string;
  projectInterests: string[];
  experienceLevel: string;
  availabilityPreference: string;
  communicationPreference: string[];
  preferredTeamSize: string;
  hackathonInterests: string[];
}

interface ValidationErrors {
  name?: string;
  college?: string;
  course?: string;
  semester?: string;
  branch?: string;
  skills?: string;
  github?: string;
  linkedIn?: string;
  role?: string;
  bio?: string;
  photo?: string;
  projects?: { [key: number]: { [key: string]: string } };
}

// Constants
const MAX_BIO_LENGTH = 500;
const MIN_BIO_LENGTH = 0;
const MAX_PROJECT_DESCRIPTION_LENGTH = 300;
const MIN_PROJECT_DESCRIPTION_LENGTH = 0;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg'];

// Utility Functions
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

const isValidGithubUrl = (url: string): boolean => {
  return url === '' || (isValidUrl(url) && url.toLowerCase().includes('github.com'));
};

const isValidLinkedInUrl = (url: string): boolean => {
  return url === '' || (isValidUrl(url) && url.toLowerCase().includes('linkedin.com'));
};

const OnboardingPage: React.FC = () => {
  // State Management
  const { user, loading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [data, setData] = useState<OnboardingData>({
    name: user?.displayName || '',
    college: '',
    course: '',
    semester: '',
    branch: '',
    skills: '',
    github: '',
    linkedIn: '',
    role: '',
    bio: '',
    projects: [{ description: '', github: '', deployed: '' }],
    teamStatus: TEAM_STATUS.LOOKING,
    projectInterests: [],
    experienceLevel: '',
    availabilityPreference: '',
    communicationPreference: [],
    preferredTeamSize: '',
    hackathonInterests: [],
  });

  const [photo, setPhoto] = useState<File | null>(null);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [otherCollege, setOtherCollege] = useState('');
  const [isOtherSelected, setIsOtherSelected] = useState(false);

  // Auth Check Effect
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Validation Functions
  const validateStep = (stepNumber: number): boolean => {
    const newErrors: ValidationErrors = {};

    switch (stepNumber) {
      case 1:
        if (!data.name.trim()) {
          newErrors.name = 'Name is required';
        } else if (data.name.length < 2) {
          newErrors.name = 'Name must be at least 2 characters';
        }

        if (!data.college) {
          newErrors.college = 'College is required';
        }

        if (!data.course) {
          newErrors.course = 'Course is required';
        }

        if (!data.semester) {
          newErrors.semester = 'Semester is required';
        }

        if (!data.branch) {
          newErrors.branch = 'Branch is required';
        }

        if (photo && !ALLOWED_FILE_TYPES.includes(photo.type)) {
          newErrors.photo = 'Please upload a valid image file (JPEG, JPG, or PNG)';
        }

        if (photo && photo.size > MAX_FILE_SIZE) {
          newErrors.photo = 'Image size should be less than 5MB';
        }
        break;

      case 2:
        if (!data.bio.trim()) {
          newErrors.bio = 'Bio is required';
        } else if (data.bio.length < MIN_BIO_LENGTH) {
          newErrors.bio = `Bio must be at least ${MIN_BIO_LENGTH} characters`;
        } else if (data.bio.length > MAX_BIO_LENGTH) {
          newErrors.bio = `Bio must not exceed ${MAX_BIO_LENGTH} characters`;
        }

        if (selectedSkills.length === 0) {
          newErrors.skills = 'Please select at least one skill';
        }

        if (data.github && !isValidGithubUrl(data.github)) {
          newErrors.github = 'Please enter a valid GitHub URL';
        }

        if (data.linkedIn && !isValidLinkedInUrl(data.linkedIn)) {
          newErrors.linkedIn = 'Please enter a valid LinkedIn URL';
        }

        if (!data.role) {
          newErrors.role = 'Please select your primary role';
        }
        break;

      case 3:
        const projectErrors: { [key: number]: { [key: string]: string } } = {};
        
        data.projects.forEach((project, index) => {
          const projectError: { [key: string]: string } = {};

          if (!project.description.trim()) {
            projectError.description = 'Project description is required';
          } else if (project.description.length < MIN_PROJECT_DESCRIPTION_LENGTH) {
            projectError.description = `Description must be at least ${MIN_PROJECT_DESCRIPTION_LENGTH} characters`;
          } else if (project.description.length > MAX_PROJECT_DESCRIPTION_LENGTH) {
            projectError.description = `Description must not exceed ${MAX_PROJECT_DESCRIPTION_LENGTH} characters`;
          }

          if (!project.github.trim()) {
            projectError.github = 'GitHub repository URL is required';
          } else if (!isValidGithubUrl(project.github)) {
            projectError.github = 'Please enter a valid GitHub URL';
          }

          if (project.deployed && !isValidUrl(project.deployed)) {
            projectError.deployed = 'Please enter a valid URL';
          }

          if (Object.keys(projectError).length > 0) {
            projectErrors[index] = projectError;
          }
        });

        if (Object.keys(projectErrors).length > 0) {
          newErrors.projects = projectErrors;
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Event Handlers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === 'college') {
      if (value === 'Other') {
        setIsOtherSelected(true);
        setData({ ...data, college: '' });
        setOtherCollege('');
      } else {
        setIsOtherSelected(false);
        setData({ ...data, college: value });
        setOtherCollege('');
      }
    } else {
      setData({ ...data, [name]: value });
    }

    // Clear error when user makes a selection
    if (errors[name as keyof ValidationErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleOtherCollegeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const customCollege = e.target.value;
    setOtherCollege(customCollege);
    setData({ ...data, college: customCollege });

    // Clear error when user starts typing
    if (errors.college) {
      setErrors({ ...errors, college: undefined });
    }
  };

  const handleProjectChange = (index: number, field: string, value: string) => {
    const updatedProjects = [...data.projects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    setData({ ...data, projects: updatedProjects });

    // Clear project-specific error when user starts typing
    if (errors.projects && errors.projects[index] && errors.projects[index][field]) {
      const updatedErrors = { ...errors };
      delete updatedErrors.projects![index][field];
      if (Object.keys(updatedErrors.projects![index]).length === 0) {
        delete updatedErrors.projects![index];
      }
      if (Object.keys(updatedErrors.projects!).length === 0) {
        delete updatedErrors.projects;
      }
      setErrors(updatedErrors);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setErrors({ ...errors, photo: 'Please upload a valid image file (JPEG, JPG, or PNG)' });
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setErrors({ ...errors, photo: 'Image size should be less than 5MB' });
        return;
      }

      setPhoto(file);
      setErrors({ ...errors, photo: undefined });
    }
  };

  const handleSkillSelect = (skill: string) => {
    let updatedSkills;
    if (selectedSkills.includes(skill)) {
      updatedSkills = selectedSkills.filter(s => s !== skill);
    } else if (selectedSkills.length < 8) {
      updatedSkills = [...selectedSkills, skill];
    } else {
      return; // Don't add more than 8 skills
    }
    
    setSelectedSkills(updatedSkills);
    
    // Clear skills error if at least one skill is selected
    if (updatedSkills.length > 0 && errors.skills) {
      setErrors({ ...errors, skills: undefined });
    }
  };

  const addProject = () => {
    setData({
      ...data,
      projects: [...data.projects, { description: '', github: '', deployed: '' }]
    });
  };

  const handleStepChange = (nextStep: number) => {
    if (nextStep > step && !validateStep(step)) {
      return;
    }
    setStep(nextStep);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      let photoUrl = data.photoUrl;

      if (photo) {
        const photoRef = ref(storage, `profile-photos/${user!.uid}`);
        await uploadBytes(photoRef, photo);
        photoUrl = await getDownloadURL(photoRef);
      }

      const onboardingData = {
        ...data,
        skills: selectedSkills.join(', '),
        photoUrl,
        onboardingCompleted: true,
        teamStatus: data.teamStatus,
        projectInterests: data.projectInterests,
        experienceLevel: data.experienceLevel,
        availabilityPreference: data.availabilityPreference,
        communicationPreference: data.communicationPreference,
        preferredTeamSize: data.preferredTeamSize,
        hackathonInterests: data.hackathonInterests,
      };

      await setDoc(doc(db, 'users', user!.uid), onboardingData, { merge: true });
      
      toast({
        title: "Success!",
        description: "Your profile has been completed successfully",
      });

      router.push('/profile');
    } catch (error) {
      console.error("Error completing onboarding:", error);
      toast({
        title: "Error",
        description: "Failed to complete profile",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render Functions
  const renderError = (error?: string) => {
    if (!error) return null;
    return (
      <Alert variant="destructive" className="mt-2">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  };

  const renderProjectErrors = (index: number) => {
    if (!errors.projects || !errors.projects[index]) return null;
    
    return Object.entries(errors.projects[index]).map(([field, error]) => (
      <Alert key={`${index}-${field}`} variant="destructive" className="mt-2">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    ));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={photo ? URL.createObjectURL(photo) : undefined} />
                <AvatarFallback>{data.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <Input
                type="file"
                onChange={handlePhotoChange}
                accept="image/*"
                className="w-full max-w-xs bg-black/20 text-white border-purple-500/30 focus:border-purple-500/50 placeholder:text-gray-500"
              />
              {renderError(errors.photo)}
            </div>
            
            <div className="space-y-4">
              <div>
                <Input
                  name="name"
                  value={data.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                  className="bg-black/20 text-white border-purple-500/30 focus:border-purple-500/50 placeholder:text-gray-500"
                />
                {renderError(errors.name)}
              </div>
              
              <div className="space-y-2">
                <Select 
                  onValueChange={(value) => handleSelectChange('college', value)}
                  value={isOtherSelected ? 'Other' : data.college}
                >
                  <SelectTrigger className="bg-black/20 text-white border-purple-500/30">
                    <SelectValue placeholder="Select College" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-purple-500/30">
                    {COLLEGES.map(college => (
                      <SelectItem key={college} value={college} className="text-white hover:bg-purple-500/20">{college}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {isOtherSelected && (
                  <Input
                    value={otherCollege}
                    onChange={handleOtherCollegeChange}
                    placeholder="If chosen Other, please specify"
                    disabled={!isOtherSelected}
                    className="bg-black/20 text-white border-purple-500/30 focus:border-purple-500/50 placeholder:text-gray-500"
                  />
                )}
                {renderError(errors.college)}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Select onValueChange={(value) => handleSelectChange('course', value)}>
                    <SelectTrigger className="bg-black/20 text-white border-purple-500/30">
                      <SelectValue placeholder="Select Course" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-purple-500/30">
                      {COURSES.map(course => (
                        <SelectItem key={course} value={course} className="text-white hover:bg-purple-500/20">{course}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {renderError(errors.course)}
                </div>

                <div>
                  <Select onValueChange={(value) => handleSelectChange('semester', value)}>
                    <SelectTrigger className="bg-black/20 text-white border-purple-500/30">
                      <SelectValue placeholder="Select Semester" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-purple-500/30">
                      {SEMESTERS.map(semester => (
                        <SelectItem key={semester} value={semester} className="text-white hover:bg-purple-500/20">{semester}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {renderError(errors.semester)}
                </div>
              </div>

              <div>
                <Select onValueChange={(value) => handleSelectChange('branch', value)}>
                  <SelectTrigger className="bg-black/20 text-white border-purple-500/30">
                    <SelectValue placeholder="Select Branch" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-purple-500/30">
                    {BRANCHES.map(branch => (
                      <SelectItem key={branch} value={branch} className="text-white hover:bg-purple-500/20">{branch}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {renderError(errors.branch)}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Textarea
                name="bio"
                value={data.bio}
                onChange={handleChange}
                placeholder={`Tell us about yourself (${MIN_BIO_LENGTH}-${MAX_BIO_LENGTH} characters)`}
                className="min-h-[100px] bg-black/20 text-white border-purple-500/30 focus:border-purple-500/50 placeholder:text-gray-500"
              />
              {renderError(errors.bio)}
            </div>

            <div>
              <p className="text-sm text-white mb-2">
                Select up to 8 skills
              </p>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map(skill => (
                  <Badge
                    key={skill}
                    variant={selectedSkills.includes(skill) ? "default" : "outline"}
                    className={selectedSkills.includes(skill) 
                      ? "bg-purple-500/20 text-purple-200 border-purple-500/30 cursor-pointer"
                      : "border-purple-500/30 text-gray-300 cursor-pointer hover:bg-purple-500/20"}
                    onClick={() => handleSkillSelect(skill)}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
              {renderError(errors.skills)}
            </div>

            <div className="space-y-4">
              <Input
                name="github"
                value={data.github}
                onChange={handleChange}
                placeholder="GitHub Profile URL"
                className="bg-black/20 text-white border-purple-500/30 focus:border-purple-500/50 placeholder:text-gray-500"
              />
              {renderError(errors.github)}

              <Input
                name="linkedIn"
                value={data.linkedIn}
                onChange={handleChange}
                placeholder="LinkedIn Profile URL"
                className="bg-black/20 text-white border-purple-500/30 focus:border-purple-500/50 placeholder:text-gray-500"
              />
              {renderError(errors.linkedIn)}

              <Select onValueChange={(value) => handleSelectChange('role', value)}>
                <SelectTrigger className="bg-black/20 text-white border-purple-500/30">
                  <SelectValue placeholder="Select Your Primary Role" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-purple-500/30">
                  <SelectItem value="frontend" className="text-white hover:bg-purple-500/20">Frontend Developer</SelectItem>
                  <SelectItem value="backend" className="text-white hover:bg-purple-500/20">Backend Developer</SelectItem>
                  <SelectItem value="fullstack" className="text-white hover:bg-purple-500/20">Full Stack Developer</SelectItem>
                  <SelectItem value="mobile" className="text-white hover:bg-purple-500/20">Mobile Developer</SelectItem>
                  <SelectItem value="devops" className="text-white hover:bg-purple-500/20">DevOps Engineer</SelectItem>
                  <SelectItem value="other" className="text-white hover:bg-purple-500/20">Other</SelectItem>
                </SelectContent>
              </Select>
              {renderError(errors.role)}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Add at least one project to showcase your work
            </p>
            
            {data.projects.map((project, index) => (
              <Card key={index} className="p-4">
                <div className="space-y-4">
                  <Textarea
                    value={project.description}
                    onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                    placeholder={`Project Description (${MIN_PROJECT_DESCRIPTION_LENGTH}-${MAX_PROJECT_DESCRIPTION_LENGTH} characters)`}
                    className="bg-black/20 text-white border-purple-500/30 focus:border-purple-500/50 placeholder:text-gray-500"
                  />
                  
                  <Input
                    value={project.github}
                    onChange={(e) => handleProjectChange(index, 'github', e.target.value)}
                    placeholder="GitHub Repository URL"
                    className="bg-black/20 text-white border-purple-500/30 focus:border-purple-500/50 placeholder:text-gray-500"
                  />
                  
                  <Input
                    value={project.deployed}
                    onChange={(e) => handleProjectChange(index, 'deployed', e.target.value)}
                    placeholder="Deployed Project URL (Optional)"
                    className="bg-black/20 text-white border-purple-500/30 focus:border-purple-500/50 placeholder:text-gray-500"
                  />
                  {renderProjectErrors(index)}
                </div>
              </Card>
            ))}
            
            <Button 
              type="button" 
              variant="outline" 
              onClick={addProject}
              className="w-full text-white"
            >
              Add Another Project
            </Button>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-white">Team Preferences</h3>
              <p className="text-sm text-white mb-4">Let others know about your team status</p>
              
              <Select 
                value={data.teamStatus} 
                onValueChange={(value) => handleSelectChange('teamStatus', value)}
              >
                <SelectTrigger className="bg-black/20 text-white border-purple-500/30">
                  <SelectValue placeholder="Select Team Status" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-purple-500/30">
                  {Object.entries(TEAM_STATUS).map(([key, value]) => (
                    <SelectItem key={value} value={value} className="text-white hover:bg-purple-500/20">
                      {key.charAt(0) + key.slice(1).toLowerCase().replace('_', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="mt-4">
                <p className="text-sm font-medium mb-2 text-white">Project Interests</p>
                <div className="flex flex-wrap gap-2">
                  {PROJECT_INTERESTS.map(interest => (
                    <Badge
                      key={interest}
                      variant={data.projectInterests.includes(interest) ? "default" : "outline"}
                      className={data.projectInterests.includes(interest) 
                        ? "bg-purple-500/20 text-purple-200 border-purple-500/30 cursor-pointer"
                        : "border-purple-500/30 text-gray-300 cursor-pointer hover:bg-purple-500/20"}
                      onClick={() => toggleArrayField('projectInterests', interest)}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>

              <Select 
                value={data.experienceLevel} 
                onValueChange={(value) => handleSelectChange('experienceLevel', value)}
              >
                <SelectTrigger className="mt-4 bg-black/20 text-white border-purple-500/30">
                  <SelectValue placeholder="Select Experience Level" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-purple-500/30">
                  {EXPERIENCE_LEVELS.map(level => (
                    <SelectItem key={level} value={level.toLowerCase()} className="text-white hover:bg-purple-500/20">
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select 
                value={data.preferredTeamSize} 
                onValueChange={(value) => handleSelectChange('preferredTeamSize', value)}
              >
                <SelectTrigger className="mt-4 bg-black/20 text-white border-purple-500/30">
                  <SelectValue placeholder="Preferred Team Size" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-purple-500/30">
                  {TEAM_SIZES.map(size => (
                    <SelectItem key={size.value} value={size.value} className="text-white hover:bg-purple-500/20">
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const toggleArrayField = (field: keyof OnboardingData, value: string) => {
    setData(prev => {
      const array = prev[field] as string[];
      return {
        ...prev,
        [field]: array.includes(value)
          ? array.filter(item => item !== value)
          : [...array, value]
      };
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-[500px] bg-black/30 backdrop-blur-lg border-[#52057B]/20">
        <CardHeader>
          <CardTitle className="text-white">Complete Your Profile</CardTitle>
          <CardDescription className="text-gray-400">Step {step} of 4</CardDescription>
        </CardHeader>
        <CardContent>
          {renderStep()}
          <div className="flex justify-between mt-6">
            {step > 1 && (
              <Button 
                type="button"
                variant="outline"
                onClick={() => setStep(step - 1)}
                disabled={isSubmitting}
                className="border-purple-500/30 text-white hover:bg-purple-500/20"
              >
                Previous
              </Button>
            )}
            <div className="ml-auto">
              {step < 4 ? (
                <Button
                  onClick={() => handleStepChange(step + 1)}
                  disabled={isSubmitting}
                  className="primary-button"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="primary-button"
                >
                  {isSubmitting ? "Saving..." : "Complete"}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingPage;