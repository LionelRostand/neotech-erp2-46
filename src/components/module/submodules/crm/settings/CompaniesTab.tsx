
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Edit, Trash, Loader2, Plus } from "lucide-react";
import { collection, getDocs, doc, setDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { toast } from 'sonner';

interface CompanyConfig {
  id: string;
  name: string;
  isActive: boolean;
  syncContacts: boolean;
  syncOpportunities: boolean;
  createdAt: any;
  updatedAt: any;
}

const CompaniesTab: React.FC = () => {
  const [companies, setCompanies] = useState<CompanyConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [isAddingCompany, setIsAddingCompany] = useState(false);

  // Load companies
  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const companiesCollection = collection(db, COLLECTIONS.COMPANIES);
        const snapshot = await getDocs(companiesCollection);
        
        const companiesData: CompanyConfig[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data() as Omit<CompanyConfig, 'id'>
        }));
        
        setCompanies(companiesData);
        setError(null);
      } catch (err) {
        console.error('Error fetching companies:', err);
        setError('Erreur lors du chargement des entreprises');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  // Add new company
  const handleAddCompany = async () => {
    if (!newCompanyName.trim()) {
      toast.error('Le nom de l\'entreprise est requis');
      return;
    }

    setIsAddingCompany(true);
    try {
      const newCompany: Omit<CompanyConfig, 'id'> = {
        name: newCompanyName.trim(),
        isActive: true,
        syncContacts: true,
        syncOpportunities: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const companyRef = doc(collection(db, COLLECTIONS.COMPANIES));
      await setDoc(companyRef, newCompany);

      const addedCompany: CompanyConfig = {
        id: companyRef.id,
        ...newCompany
      };

      setCompanies([...companies, addedCompany]);
      setNewCompanyName('');
      toast.success('Entreprise ajoutée avec succès');
    } catch (err) {
      console.error('Error adding company:', err);
      toast.error('Erreur lors de l\'ajout de l\'entreprise');
    } finally {
      setIsAddingCompany(false);
    }
  };

  // Toggle company setting
  const toggleCompanySetting = async (companyId: string, field: keyof CompanyConfig, value: boolean) => {
    try {
      const companyRef = doc(db, COLLECTIONS.COMPANIES, companyId);
      await updateDoc(companyRef, { 
        [field]: value,
        updatedAt: serverTimestamp()
      });

      setCompanies(companies.map(company => 
        company.id === companyId ? { ...company, [field]: value } : company
      ));

      toast.success('Paramètre mis à jour');
    } catch (err) {
      console.error('Error updating company setting:', err);
      toast.error('Erreur lors de la mise à jour du paramètre');
    }
  };

  // Delete company
  const handleDeleteCompany = async (companyId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette entreprise ?')) return;

    try {
      await deleteDoc(doc(db, COLLECTIONS.COMPANIES, companyId));
      setCompanies(companies.filter(company => company.id !== companyId));
      toast.success('Entreprise supprimée avec succès');
    } catch (err) {
      console.error('Error deleting company:', err);
      toast.error('Erreur lors de la suppression de l\'entreprise');
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-500">Chargement des entreprises...</span>
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
            <p>Une erreur est survenue lors du chargement des entreprises.</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
            <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
              Réessayer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">Ajouter une entreprise</h2>
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Label htmlFor="companyName">Nom de l'entreprise</Label>
              <Input
                id="companyName"
                value={newCompanyName}
                onChange={(e) => setNewCompanyName(e.target.value)}
                placeholder="Saisir le nom de l'entreprise"
              />
            </div>
            <Button onClick={handleAddCompany} disabled={isAddingCompany}>
              {isAddingCompany ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Ajout...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter
                </>
              )}
            </Button>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-medium mb-4">Entreprises configurées</h2>
          
          {companies.length === 0 ? (
            <div className="text-center py-8 border rounded-md">
              <p className="text-gray-500">Aucune entreprise configurée</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Entreprise</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Sync. Contacts</TableHead>
                  <TableHead>Sync. Opportunités</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell>
                      <Badge variant={company.isActive ? "success" : "secondary"}>
                        {company.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Switch 
                        checked={company.syncContacts} 
                        onCheckedChange={(checked) => toggleCompanySetting(company.id, 'syncContacts', checked)}
                      />
                    </TableCell>
                    <TableCell>
                      <Switch 
                        checked={company.syncOpportunities} 
                        onCheckedChange={(checked) => toggleCompanySetting(company.id, 'syncOpportunities', checked)}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteCompany(company.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CompaniesTab;
