import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  PROJECT_INTERESTS, 
  EXPERIENCE_LEVELS, 
  TEAM_STATUS 
} from "@/app/constants";
import { TeamFilters } from "../types/team";

interface TeamFiltersProps {
  filters: TeamFilters;
  onFilterChange: (filters: TeamFilters) => void;
}

export const TeamFiltersSection = ({ filters, onFilterChange }: TeamFiltersProps) => {
  const handleChange = (key: keyof TeamFilters, value: string) => {
    console.log(`Changing ${key} to:`, value);
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Select
          value={filters.projectInterest}
          onValueChange={(value) => handleChange('projectInterest', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Project Interest" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Projects</SelectItem>
            {PROJECT_INTERESTS.map(interest => (
              <SelectItem key={interest} value={interest}>
                {interest}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.experienceLevel}
          onValueChange={(value) => handleChange('experienceLevel', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Experience Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Level</SelectItem>
            {EXPERIENCE_LEVELS.map(level => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.teamStatus}
          onValueChange={(value) => handleChange('teamStatus', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Team Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any Status</SelectItem>
            {Object.entries(TEAM_STATUS).map(([key, value]) => (
              <SelectItem key={value} value={value}>
                {key.charAt(0) + key.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}; 