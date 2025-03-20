
import React, { useState } from 'react';
import DevNotice from './access-points/DevNotice';
import AccessPointsList from './access-points/AccessPointsList';
import SearchBar from './access-points/SearchBar';
import { useAccessPoints } from './access-points/useAccessPoints';
import AccessPointDialog from './access-points/AccessPointDialog';
import { AccessPoint } from './access-points/types';
import { toast } from 'sonner';

const AccessPointsTabContent: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { 
    accessPoints, 
    isLoading, 
    addAccessPoint, 
    updateAccessPoint, 
    deleteAccessPoint 
  } = useAccessPoints();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedAccessPoint, setSelectedAccessPoint] = useState<AccessPoint | undefined>(undefined);
  
  const filteredAccessPoints = accessPoints.filter(point => 
    point.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    point.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddAccessPoint = () => {
    setIsAddDialogOpen(true);
  };

  const handleEditAccessPoint = (accessPoint: AccessPoint) => {
    setSelectedAccessPoint(accessPoint);
    setIsEditDialogOpen(true);
  };

  const handleDeleteAccessPoint = (id: string) => {
    deleteAccessPoint(id);
    toast.success("Point d'accès supprimé avec succès");
  };

  const handleSubmitAdd = (data: any) => {
    addAccessPoint({
      ...data,
      isActive: true
    });
    toast.success("Point d'accès ajouté avec succès");
  };

  const handleSubmitEdit = (data: any) => {
    if (selectedAccessPoint) {
      updateAccessPoint(selectedAccessPoint.id, data);
      toast.success("Point d'accès mis à jour avec succès");
    }
  };

  return (
    <div className="space-y-4">
      <DevNotice />
      
      <SearchBar 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
        onAddAccessPoint={handleAddAccessPoint} 
      />
      
      <AccessPointsList 
        accessPoints={filteredAccessPoints} 
        isLoading={isLoading}
        onEdit={handleEditAccessPoint}
        onDelete={handleDeleteAccessPoint}
      />

      <AccessPointDialog 
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={handleSubmitAdd}
        mode="add"
      />

      <AccessPointDialog 
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        accessPoint={selectedAccessPoint}
        onSubmit={handleSubmitEdit}
        mode="edit"
      />
    </div>
  );
};

export default AccessPointsTabContent;
