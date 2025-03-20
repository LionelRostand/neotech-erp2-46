
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  BadgePercent, 
  FileUp, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  FileText,
  Loader2
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";

interface ReimbursementRequest {
  id: string;
  patientName: string;
  amount: number;
  date: string;
  status: 'pending' | 'processing' | 'approved' | 'rejected';
  insuranceName: string;
}

const mockReimbursements: ReimbursementRequest[] = [
  {
    id: '1',
    patientName: 'Sophie Martin',
    amount: 120.50,
    date: '15/06/2023',
    status: 'approved',
    insuranceName: 'MGEN'
  },
  {
    id: '2',
    patientName: 'Thomas Bernard',
    amount: 85.00,
    date: '22/06/2023',
    status: 'processing',
    insuranceName: 'AXA Santé'
  },
  {
    id: '3',
    patientName: 'Julie Petit',
    amount: 45.30,
    date: '28/06/2023',
    status: 'pending',
    insuranceName: 'Assurance Maladie'
  }
];

const ReimbursementProcess: React.FC = () => {
  const [reimbursements] = useState<ReimbursementRequest[]>(mockReimbursements);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedInsurance, setSelectedInsurance] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patientName || !amount || !selectedInsurance) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Simuler un délai de traitement
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Demande envoyée",
        description: "La demande de remboursement a été soumise avec succès.",
      });
      
      // Réinitialiser le formulaire
      setPatientName('');
      setAmount('');
      setSelectedInsurance('');
      setDescription('');
    }, 1500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-amber-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approuvée';
      case 'rejected':
        return 'Rejetée';
      case 'processing':
        return 'En traitement';
      default:
        return 'En attente';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Soumettre une demande</CardTitle>
            <CardDescription>
              Complétez le formulaire pour soumettre une nouvelle demande de remboursement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patientName">Nom du patient</Label>
                <Input 
                  id="patientName" 
                  value={patientName} 
                  onChange={(e) => setPatientName(e.target.value)} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Montant (€)</Label>
                <Input 
                  id="amount" 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="insurance">Assurance</Label>
                <Select value={selectedInsurance} onValueChange={setSelectedInsurance}>
                  <SelectTrigger id="insurance">
                    <SelectValue placeholder="Sélectionner une assurance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Assurance Maladie</SelectItem>
                    <SelectItem value="2">MGEN</SelectItem>
                    <SelectItem value="3">AXA Santé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Détails sur les soins et le remboursement demandé" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="documents">Documents justificatifs</Label>
                <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6">
                  <div className="space-y-1 text-center">
                    <FileUp className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer text-blue-600 hover:text-blue-700">
                        <span>Télécharger un fichier</span>
                        <Input id="file-upload" name="file-upload" type="file" className="sr-only" />
                      </label>
                      <p className="pl-1">ou glisser-déposer</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, JPG ou PNG jusqu'à 10MB
                    </p>
                  </div>
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Traitement...
                  </>
                ) : (
                  <>
                    <BadgePercent className="mr-2 h-4 w-4" />
                    Soumettre la demande
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Demandes récentes</CardTitle>
            <CardDescription>
              Suivez l'état de vos demandes de remboursement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reimbursements.length === 0 ? (
                <div className="text-center py-4">
                  <FileText className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Aucune demande de remboursement en cours</p>
                </div>
              ) : (
                reimbursements.map((reimbursement) => (
                  <Card key={reimbursement.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="font-medium">{reimbursement.patientName}</p>
                          <p className="text-sm text-gray-500">{reimbursement.insuranceName}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{reimbursement.amount.toFixed(2)} €</p>
                          <p className="text-sm text-gray-500">{reimbursement.date}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center mt-2 pt-2 border-t">
                        <div className="flex items-center text-sm">
                          {getStatusIcon(reimbursement.status)}
                          <span className="ml-1">{getStatusText(reimbursement.status)}</span>
                        </div>
                        <Button variant="link" size="sm" className="ml-auto">
                          Détails
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReimbursementProcess;
