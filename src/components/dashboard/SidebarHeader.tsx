
import React from 'react';
import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  sidebarOpen: boolean;
  onClick: () => void;
}

const SidebarHeader = ({ sidebarOpen, onClick }: SidebarHeaderProps) => (
  <div className="flex flex-col">
    <div 
      className={cn(
        "flex items-center py-6 px-6 border-b border-gray-100 cursor-pointer",
        !sidebarOpen && "justify-center"
      )}
      onClick={onClick}
    >
      <div className="w-8 h-8 rounded-lg bg-neotech-primary flex items-center justify-center text-white font-bold">
        N
      </div>
      <h2 className={cn(
        "ml-3 text-xl font-semibold transition-opacity duration-300",
        sidebarOpen ? "opacity-100" : "opacity-0 overflow-hidden w-0"
      )}>
        NEOTECH-ERP
      </h2>
    </div>
    
    {/* Barre horizontale en dessous de NEOTECH-ERP */}
    <div className={cn(
      "mx-auto h-0.5 w-32 bg-neotech-primary my-1",
      !sidebarOpen && "w-8"
    )} />
  </div>
);

export default SidebarHeader;
