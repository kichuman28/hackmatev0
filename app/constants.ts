// First, let's create a constants file for our predefined options
export const COLLEGES = [
  "IIT Bombay", "IIT Delhi", "IIT Madras", "IIT Kanpur", "IIT Kharagpur",
  "NIT Trichy", "NIT Warangal", "BITS Pilani", "VIT Vellore", "Other"
];

export const COURSES = [
  "B.Tech", "B.E.", "M.Tech", "MCA", "BCA"
];

export const BRANCHES = [
  "Computer Science", "Information Technology", "Electronics", 
  "Electrical", "Mechanical", "Civil", "Other"
];

export const SEMESTERS = [
  "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"
];

export const SKILLS = [
  "JavaScript", "TypeScript", "React", "Next.js", "Node.js",
  "Python", "Java", "C++", "Go", "Rust",
  "AWS", "Docker", "Kubernetes", "MongoDB", "PostgreSQL",
  "Machine Learning", "DevOps", "Cloud Computing", "Blockchain",
  "UI/UX Design", "Mobile Development", "Data Science"
];

// Project categories for hackathon teams
export const PROJECT_INTERESTS = [
  'Web Development',
  'Game Development',
  'Mobile Apps',
  'DevOps',
  'Social Impact',
  'Cybersecurity',
  'AI/ML',
  'Blockchain',
  'HealthTech',
  'EdTech',
  'AR/VR',
  'Data Analytics',
  'FinTech',
  'IoT',
  'Robotics'
] as const;

// Hackathon preferences
export const HACKATHON_INTERESTS = [
  "Local Hackathons",
  "National Events",
  "International Events",
  "Virtual Hackathons",
  "College-specific Events",
  "MLH Hackathons",
  "Corporate Hackathons",
  "Social Impact Hackathons"
];

// Team roles
export const TEAM_ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "UI/UX Designer",
  "DevOps Engineer",
  "ML Engineer",
  "Project Manager",
  "Mobile Developer",
  "Data Scientist"
];

// Team sizes
export const TEAM_SIZES = [
  { value: "2", label: "2 members" },
  { value: "3", label: "3 members" },
  { value: "4", label: "4 members" },
  { value: "5", label: "5 members" }
];

// Experience levels
export const EXPERIENCE_LEVELS = [
  'intermediate',
  'advanced',
  'beginner'
] as const;

// Availability preferences
export const AVAILABILITY_PREFERENCES = [
  "Weekday Evenings",
  "Weekends",
  "Flexible Schedule",
  "Full-time during hackathon"
];

// Communication preferences
export const COMMUNICATION_PREFERENCES = [
  "Discord",
  "Slack",
  "WhatsApp",
  "Microsoft Teams",
  "Zoom",
  "Google Meet"
];

// Project duration preferences
export const PROJECT_DURATION_PREFERENCES = [
  "24-hour Hackathons",
  "36-hour Hackathons",
  "48-hour Hackathons",
  "Week-long Events",
  "Month-long Events"
];

// Team status options
export const TEAM_STATUS = {
  LOOKING: 'looking_for_team',
  IN_TEAM: 'in_team',
  NOT_LOOKING: 'not_looking'
} as const;

// Team connection status
export const CONNECTION_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  CANCELLED: "cancelled"
} as const;

// Team formation stages
export const TEAM_FORMATION_STAGES = {
  INITIAL: "initial_contact",
  DISCUSSION: "in_discussion",
  CONFIRMED: "team_confirmed",
  COMPLETED: "project_completed"
} as const; 