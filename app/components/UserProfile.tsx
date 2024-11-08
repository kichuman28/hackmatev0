// components/UserProfile.tsx
interface UserProfileProps {
    name: string;
    skills: string[];
    projects: string[];
    linkedIn: string;
  }
  
  const UserProfile: React.FC<UserProfileProps> = ({ name, skills, projects, linkedIn }) => {
    return (
      <div className="border border-gray-300 p-4 rounded-lg shadow-md">
        <h4 className="text-xl font-semibold">{name}</h4>
        <div>
          <p className="font-bold">Skills:</p>
          <ul className="list-disc list-inside">
            {skills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-bold">Projects:</p>
          <ul className="list-disc list-inside">
            {projects.map((project, index) => (
              <li key={index}>{project}</li>
            ))}
          </ul>
        </div>
        <a href={linkedIn} target="_blank" rel="noopener noreferrer" className="text-blue-500">
          LinkedIn Profile
        </a>
      </div>
    );
  };
  
  export default UserProfile;
  