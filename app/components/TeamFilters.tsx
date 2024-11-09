import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { PROJECT_INTERESTS, EXPERIENCE_LEVELS, TEAM_STATUS } from "@/app/constants";
import { TeamFilters } from "../types/team";

interface TeamFiltersProps {
  filters: TeamFilters;
  onFilterChange: (filters: TeamFilters) => void;
}

export const TeamFiltersSection = ({ filters, onFilterChange }: TeamFiltersProps) => {
  const handleChange = (key: keyof TeamFilters, value: string) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-200">Project Interest</label>
          <Select
            value={filters.projectInterest}
            onValueChange={(value) => handleChange('projectInterest', value)}
          >
            <SelectTrigger className="w-full bg-black/50 border-purple-500/30 text-white">
              <SelectValue placeholder="Select project interest" />
            </SelectTrigger>
            <SelectContent className="bg-black/95 border-purple-500/30">
              <SelectItem value="all" className="text-white hover:bg-purple-500/20">All Projects</SelectItem>
              {PROJECT_INTERESTS.map(interest => (
                <SelectItem key={interest} value={interest} className="text-white hover:bg-purple-500/20">
                  {interest}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-200">Experience Level</label>
          <Select
            value={filters.experienceLevel}
            onValueChange={(value) => handleChange('experienceLevel', value)}
          >
            <SelectTrigger className="w-full bg-black/50 border-purple-500/30 text-white">
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent className="bg-black/95 border-purple-500/30">
              <SelectItem value="all" className="text-white hover:bg-purple-500/20">Any Level</SelectItem>
              {EXPERIENCE_LEVELS.map(level => (
                <SelectItem key={level} value={level} className="text-white hover:bg-purple-500/20">
                  {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-200">Team Status</label>
          <Select
            value={filters.teamStatus}
            onValueChange={(value) => handleChange('teamStatus', value)}
          >
            <SelectTrigger className="w-full bg-black/50 border-purple-500/30 text-white">
              <SelectValue placeholder="Select team status" />
            </SelectTrigger>
            <SelectContent className="bg-black/95 border-purple-500/30">
              <SelectItem value="all" className="text-white hover:bg-purple-500/20">Any Status</SelectItem>
              {Object.entries(TEAM_STATUS).map(([key, value]) => (
                <SelectItem key={value} value={value} className="text-white hover:bg-purple-500/20">
                  {key.charAt(0) + key.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}; 