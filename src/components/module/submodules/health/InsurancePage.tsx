
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Plus, 
  Filter, 
  ShieldCheck, 
  FileText, 
  BadgePercent, 
  ArrowUpDown
} from "lucide-react";
import InsuranceList from './components/insurance/InsuranceList';
import InsuranceVerification from './components/insurance/InsuranceVerification';
import ReimbursementProcess from './components/insurance/ReimbursementProcess';
import InsuranceCompanyDetail from './components/insurance/InsuranceCompanyDetail';
import { Insurance } from './types/health-types';
import { toast } from "@/hooks/use-toast";
import { useFirestore } from '@/hooks/use-firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';

const InsurancePage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('list');
  const [selectedInsurance, setSelectedInsurance] = useState<Insurance | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  const insuranceCollection = useFirestore(COLLECTIONS.HEALTH_INSURANCE);
  
  const handleViewInsurance = (insurance: Insurance) => {
    setSelectedInsurance(insurance);
    setIsEditing(false);
  };

  const handleEditInsurance = (insurance: Insurance) => {
    setSelectedInsurance(insurance);
    setIsEditing(true);
  };

  const handleAddInsurance = () => {
    setSelectedInsurance(null);
    setIsCreating(true);
  };

  const handleBackToList = () => {
    setSelectedInsurance(null);
    setIsEditing(false);
    setIsCreating(false);
  };

  const handleSaveInsurance = async (data: Insurance) => {
    try {
      if (data.id && !isCreating) {
        await insuranceCollection.update(data.id, data);
        toast({ 
          title: "Assurance mise à jour", 
          description: `Les informations de ${data.name} ont été mises à jour.`
        });
      } else {
        await insuranceCollection.add(data);
        toast({ 
          title: "Assurance ajoutée", 
          description: `${data.name} a été ajoutée à la liste.`
        });
      }
      
      handleBackToList();
    } catch (error) {
      console.error("Error saving insurance:", error);
      toast({ 
        title: "Erreur", 
        description: "Une erreur s'est produite lors de l'enregistrement.",
        variant: "destructive"
      });
    }
  };
  
  // Show insurance detail view when an insurance is selected or when creating a new one
  if (selectedInsurance || isCreating) {
    return (
      <InsuranceCompanyDetail 
        insurance={selectedInsurance}
        onBack={handleBackToList}
        onSave={handleSaveInsurance}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestion des Assurances</h2>
          <p className="text-gray-500">Gérez les assurances et mutuelles des patients</p>
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtrer
          </Button>
          <Button size="sm" onClick={handleAddInsurance}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter une assurance
          </Button>
        </div>
      </div>

      <div className="relative w-full max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="search"
          placeholder="Rechercher une assurance..."
          className="pl-8 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">Assurances</TabsTrigger>
          <TabsTrigger value="verification">Vérification</TabsTrigger>
          <TabsTrigger value="reimbursement">Remboursements</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <Card>
            <CardContent className="p-6">
              <InsuranceList 
                searchQuery={searchQuery} 
                onViewInsurance={handleViewInsurance}
                onEditInsurance={handleEditInsurance}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <ShieldCheck className="h-5 w-5 mr-2 text-blue-500" />
                Vérification de couverture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InsuranceVerification />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reimbursement">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BadgePercent className="h-5 w-5 mr-2 text-green-500" />
                Traitement des remboursements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReimbursementProcess />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InsurancePage;
