import { useState } from 'react';
import UserProfile from './UserProfile';

const Search = () => {
  const [skill, setSkill] = useState('');
  const [profiles] = useState([
    {
      name: 'Alice Johnson',
      skills: ['JavaScript', 'React', 'Node.js'],
      projects: ['Project A', 'Project B'],
      linkedIn: 'https://linkedin.com/in/alicejohnson',
    },
    {
      name: 'Bob Smith',
      skills: ['Python', 'Django', 'Machine Learning'],
      projects: ['Project C', 'Project D'],
      linkedIn: 'https://linkedin.com/in/bobsmith',
    },
  ]);

  const handleSearch = () => {
    // Here you will filter based on skills when integrated with Firestore
    console.log('Searching for:', skill);
  };

  return (
    <div>
      <div className="flex items-center mt-4">
        <input
          type="text"
          placeholder="Enter a skill (e.g., JavaScript)"
          value={skill}
          onChange={(e) => setSkill(e.target.value)}
          className="border border-gray-300 p-2 rounded mr-2"
          aria-label="Search for skills"
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded">
          Search
        </button>
      </div>

      <div className="mt-4">
        {profiles.map((profile, index) => (
          <UserProfile
            key={index}
            name={profile.name}
            skills={profile.skills}
            projects={profile.projects}
            linkedIn={profile.linkedIn}
          />
        ))}
      </div>
    </div>
  );
};

export default Search;
