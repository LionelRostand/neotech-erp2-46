
import React from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import DashboardLayout from "@/components/DashboardLayout";

const UserPermissions = () => (
  <DashboardLayout>
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Droits utilisateurs</h1>
      <p className="mb-4">Attribuez les droits d'accès aux modules pour chaque utilisateur ou employé.</p>
      
      <div className="bg-white rounded-lg border p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Attribution des droits par module</h2>
        <div className="space-y-4">
          {/* Sample module permissions UI */}
          <div className="border rounded-md p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Module Entreprises</h3>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">Tous</Button>
                <Button size="sm" variant="outline">Aucun</Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="companies-view" />
                <label htmlFor="companies-view" className="text-sm">Visualisation</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="companies-create" />
                <label htmlFor="companies-create" className="text-sm">Création</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="companies-edit" />
                <label htmlFor="companies-edit" className="text-sm">Modification</label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="companies-delete" />
                <label htmlFor="companies-delete" className="text-sm">Suppression</label>
              </div>
            </div>
          </div>
          
          {/* Repeat for other modules */}
        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default UserPermissions;
