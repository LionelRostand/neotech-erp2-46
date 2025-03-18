
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { AttendanceFilter } from '@/types/attendance';

interface AttendanceSearchProps {
  onFilterChange: (filter: AttendanceFilter) => void;
}

const AttendanceSearch: React.FC<AttendanceSearchProps> = ({ onFilterChange }) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ search: e.target.value });
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="text"
        placeholder="Rechercher un employé..."
        className="pl-10"
        onChange={handleSearchChange}
      />
    </div>
  );
};

export default AttendanceSearch;
