
import React from 'react';
import { Search, Bell, Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";

const TopBar = () => (
  <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
    <div className="px-6 py-4 flex items-center justify-between">
      <div className="flex items-center w-72">
        <div className="relative w-full">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-200 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-sm"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 w-4 h-4 bg-neotech-primary text-white rounded-full text-xs flex items-center justify-center">
            2
          </span>
        </Button>
        
        <Button variant="ghost" size="icon" className="relative">
          <Mail size={20} />
          <span className="absolute top-0 right-0 w-4 h-4 bg-neotech-primary text-white rounded-full text-xs flex items-center justify-center">
            3
          </span>
        </Button>

        <div className="flex items-center pl-4 border-l border-gray-200">
          <div className="w-8 h-8 rounded-full bg-neotech-primary flex items-center justify-center text-white font-medium">
            A
          </div>
          <span className="ml-2 font-medium text-sm">Admin</span>
        </div>
      </div>
    </div>
  </header>
);

export default TopBar;
