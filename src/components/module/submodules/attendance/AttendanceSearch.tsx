
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface AttendanceSearchProps {
  onSearch: (query: string) => void;
}

const AttendanceSearch: React.FC<AttendanceSearchProps> = ({ onSearch }) => {
  return (
    <div className="relative mb-6">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      <Input
        type="text"
        placeholder="Rechercher un employé..."
        className="pl-10 w-full md:w-80"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};

export default AttendanceSearch;
