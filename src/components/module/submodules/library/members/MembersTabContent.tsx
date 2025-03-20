
import React from 'react';
import MembersTable from './MembersTable';
import MembersToolbar from './MembersToolbar';
import { Member } from '../types/library-types';

interface MembersTabContentProps {
  members: Member[];
  isLoading: boolean;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAddMember: () => void;
  onViewDetails: (member: Member) => void;
  onEdit: (member: Member) => void;
  onDelete: (memberId: string) => void;
}

const MembersTabContent: React.FC<MembersTabContentProps> = ({
  members,
  isLoading,
  searchQuery,
  onSearchChange,
  onAddMember,
  onViewDetails,
  onEdit,
  onDelete
}) => {
  return (
    <div className="space-y-4">
      <MembersToolbar 
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onAddMember={onAddMember}
      />
      
      <MembersTable 
        members={members}
        isLoading={isLoading}
        onViewDetails={onViewDetails}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  );
};

export default MembersTabContent;
