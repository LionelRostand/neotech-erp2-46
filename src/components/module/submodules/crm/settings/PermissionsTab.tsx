
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash, Loader2 } from "lucide-react";
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

interface UserPermission {
  id: string;
  userId: string;
  userName: string;
  email: string;
  role: string;
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canExport: boolean;
}

const PermissionsTab: React.FC = () => {
  const [permissions, setPermissions] = useState<UserPermission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load permissions
  useEffect(() => {
    const fetchPermissions = async () => {
      setLoading(true);
      try {
        const permissionsCollection = collection(db, COLLECTIONS.USER_PERMISSIONS);
        const snapshot = await getDocs(permissionsCollection);
        
        const permissionsData: UserPermission[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data() as Omit<UserPermission, 'id'>
        }));
        
        setPermissions(permissionsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching user permissions:', err);
        setError('Erreur lors du chargement des permissions');
      } finally {
        setLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  // Toggle permission
  const togglePermission = async (userId: string, field: keyof UserPermission, value: boolean) => {
    try {
      const userPermission = permissions.find(p => p.userId === userId);
      if (!userPermission) return;

      // Update in Firestore
      const permissionDoc = doc(db, COLLECTIONS.USER_PERMISSIONS, userPermission.id);
      await updateDoc(permissionDoc, { [field]: value });

      // Update local state
      setPermissions(permissions.map(p => 
        p.userId === userId ? { ...p, [field]: value } : p
      ));

      toast.success('Permission mise à jour');
    } catch (err) {
      console.error('Error updating permission:', err);
      toast.error('Erreur lors de la mise à jour de la permission');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-500">Chargement des permissions...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-red-800">
            <p>Une erreur est survenue lors du chargement des permissions.</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
            <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (permissions.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">Aucune permission utilisateur configurée</p>
            <Button>Ajouter un utilisateur</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead className="text-center">Voir</TableHead>
              <TableHead className="text-center">Éditer</TableHead>
              <TableHead className="text-center">Supprimer</TableHead>
              <TableHead className="text-center">Exporter</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissions.map((permission) => (
              <TableRow key={permission.userId}>
                <TableCell>
                  <div>
                    <p className="font-medium">{permission.userName}</p>
                    <p className="text-sm text-gray-500">{permission.email}</p>
                  </div>
                </TableCell>
                <TableCell>{permission.role}</TableCell>
                <TableCell className="text-center">
                  <Checkbox 
                    checked={permission.canView} 
                    onCheckedChange={(checked) => togglePermission(permission.userId, 'canView', checked as boolean)}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Checkbox 
                    checked={permission.canEdit} 
                    onCheckedChange={(checked) => togglePermission(permission.userId, 'canEdit', checked as boolean)}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Checkbox 
                    checked={permission.canDelete} 
                    onCheckedChange={(checked) => togglePermission(permission.userId, 'canDelete', checked as boolean)}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <Checkbox 
                    checked={permission.canExport} 
                    onCheckedChange={(checked) => togglePermission(permission.userId, 'canExport', checked as boolean)}
                  />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end space-x-2">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default PermissionsTab;
