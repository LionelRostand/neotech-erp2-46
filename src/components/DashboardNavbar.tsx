
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, MessageSquare } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import UserDropdown from '@/components/UserDropdown';
import { useAuth } from '@/hooks/useAuth';

const DashboardNavbar = () => {
  const { isOffline } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex h-16 items-center justify-between border-b bg-white px-6">
      {/* Left empty for spacing */}
      <div></div>
      
      {/* Right side nav items */}
      <div className="flex items-center space-x-4">
        {isOffline && (
          <div className="text-sm text-amber-600 font-medium rounded-md px-2 py-1 bg-amber-50 border border-amber-200">
            Mode hors-ligne
          </div>
        )}
        
        <Button variant="ghost" size="icon" className="relative">
          <MessageSquare className="h-5 w-5" />
        </Button>
        
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <Badge className="absolute top-0 right-0 h-4 w-4 p-0 flex items-center justify-center text-[10px]">
            3
          </Badge>
        </Button>
        
        <UserDropdown />
      </div>
    </div>
  );
};

export default DashboardNavbar;
