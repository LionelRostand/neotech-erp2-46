
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus } from "lucide-react";

interface MembersToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onAddMember: () => void;
}

const MembersToolbar: React.FC<MembersToolbarProps> = ({
  searchQuery,
  onSearchChange,
  onAddMember
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between">
      <div className="relative md:w-96">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Rechercher un adhérent..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <Button onClick={onAddMember}>
        <UserPlus className="h-4 w-4 mr-2" />
        Ajouter un adhérent
      </Button>
    </div>
  );
};

export default MembersToolbar;
