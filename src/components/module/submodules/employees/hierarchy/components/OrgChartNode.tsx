
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ChartNode } from '../types/hierarchy-types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';

interface OrgChartNodeProps {
  node: ChartNode;
  children?: React.ReactNode;
  searchQuery?: string;
  onSelect?: () => void;
}

const OrgChartNode: React.FC<OrgChartNodeProps> = ({ 
  node, 
  children, 
  searchQuery = '',
  onSelect 
}) => {
  // Vérifier si le nœud correspond à la recherche
  const matchesSearch = searchQuery
    ? node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (node.department && node.department.toLowerCase().includes(searchQuery.toLowerCase()))
    : true;

  // Générer une couleur de département basée sur le nom du département
  const getDepartmentColor = () => {
    if (node.departmentColor) return node.departmentColor;
    
    if (!node.department) return 'bg-gray-100';
    
    const departmentHash = node.department.split('').reduce(
      (acc, char) => acc + char.charCodeAt(0), 0
    );
    
    const colors = [
      'bg-blue-100 border-blue-200',
      'bg-green-100 border-green-200',
      'bg-purple-100 border-purple-200',
      'bg-orange-100 border-orange-200',
      'bg-pink-100 border-pink-200',
      'bg-yellow-100 border-yellow-200',
      'bg-indigo-100 border-indigo-200',
      'bg-red-100 border-red-200',
      'bg-teal-100 border-teal-200',
      'bg-lime-100 border-lime-200'
    ];
    
    return colors[departmentHash % colors.length];
  };
  
  // Si le nœud ne correspond pas à la recherche et qu'il n'a pas d'enfants qui correspondent,
  // ne pas l'afficher
  if (searchQuery && !matchesSearch && !React.Children.count(children)) {
    return null;
  }

  return (
    <div className={`flex flex-col items-center ${matchesSearch ? 'opacity-100' : 'opacity-50'}`}>
      <Card 
        onClick={onSelect}
        className={`cursor-pointer transition-all hover:shadow-md ${getDepartmentColor()} ${
          matchesSearch && searchQuery ? 'ring-2 ring-blue-400' : ''
        }`}
      >
        <CardContent className="p-4 flex flex-col items-center text-center min-w-[200px]">
          <Avatar className="w-16 h-16 mb-2">
            <AvatarImage src={node.imageUrl} />
            <AvatarFallback>{getInitials(node.name)}</AvatarFallback>
          </Avatar>
          <h4 className="font-semibold">{node.name}</h4>
          <p className="text-sm text-gray-600">{node.position}</p>
          {node.department && (
            <span className="text-xs bg-white px-2 py-1 rounded-full mt-1">
              {node.department}
            </span>
          )}
        </CardContent>
      </Card>
      
      {/* Ligne verticale vers les enfants */}
      {children && React.Children.count(children) > 0 && (
        <div className="w-px h-8 bg-gray-300 mt-2"></div>
      )}
      
      {/* Conteneur pour les enfants */}
      {children && (
        <div>
          <div className="flex justify-center">
            <div className="children-container flex flex-wrap justify-center gap-4 mt-2">
              {children}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrgChartNode;
