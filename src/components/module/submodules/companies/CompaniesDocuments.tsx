
import React, { useState, useEffect } from 'react';
import { useCompanyService } from './services/companyService';
import { CompanyDocument } from './types';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Search, 
  Upload, 
  Download, 
  Trash2, 
  FileText, 
  FileImage, 
  FilePdf, 
  File 
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';

const CompaniesDocuments: React.FC = () => {
  const { getCompanies, getCompanyDocuments } = useCompanyService();
  
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [documents, setDocuments] = useState<CompanyDocument[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    fetchCompanies();
  }, []);
  
  useEffect(() => {
    if (selectedCompany) {
      fetchDocuments(selectedCompany);
    } else {
      setDocuments([]);
    }
  }, [selectedCompany]);
  
  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const { companies } = await getCompanies(1, 100);
      setCompanies(companies);
      
      // Sélectionner la première entreprise par défaut s'il y en a
      if (companies.length > 0 && !selectedCompany) {
        setSelectedCompany(companies[0].id);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchDocuments = async (companyId: string) => {
    setLoading(true);
    try {
      const docs = await getCompanyDocuments(companyId);
      setDocuments(docs);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSearch = () => {
    // Implement search functionality
    console.log('Searching for:', searchTerm);
  };
  
  const getFileIcon = (fileName: string) => {
    if (!fileName) return <File className="h-5 w-5 text-gray-500" />;
    
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return <FilePdf className="h-5 w-5 text-red-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FileImage className="h-5 w-5 text-blue-500" />;
      case 'doc':
      case 'docx':
      case 'txt':
        return <FileText className="h-5 w-5 text-blue-700" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const formatFileSize = (size: number) => {
    if (!size) return '—';
    
    if (size < 1024) {
      return `${size} o`;
    } else if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(1)} Ko`;
    } else {
      return `${(size / (1024 * 1024)).toFixed(1)} Mo`;
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header with search and upload */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Input
                placeholder="Rechercher un document..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute right-0 top-0 h-full"
                onClick={handleSearch}
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Téléverser un document
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Téléverser un document</DialogTitle>
                <DialogDescription>
                  Téléversez un document justificatif pour une entreprise.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Entreprise</label>
                  <select 
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                    defaultValue={selectedCompany || ""}
                  >
                    <option value="" disabled>Sélectionnez une entreprise</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type de document</label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                    <option value="" disabled selected>Sélectionnez un type</option>
                    <option value="kbis">Extrait Kbis</option>
                    <option value="id">Justificatif d'identité</option>
                    <option value="status">Statuts</option>
                    <option value="rib">RIB</option>
                    <option value="contract">Contrat</option>
                    <option value="invoice">Facture</option>
                    <option value="other">Autre</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Fichier</label>
                  <div className="border border-dashed rounded-lg p-6 text-center">
                    <div className="flex flex-col items-center space-y-4">
                      <Upload className="h-8 w-8 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">
                          Glissez-déposez ou
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Formats acceptés: PDF, JPG, PNG (max. 10 Mo)
                        </p>
                      </div>
                      <Button type="button" variant="outline" size="sm">
                        Parcourir
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <DialogClose asChild>
                  <Button variant="outline">Annuler</Button>
                </DialogClose>
                <Button>Téléverser</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
      
      {/* Company selection tabs */}
      <Card>
        <Tabs defaultValue={selectedCompany || "all"} onValueChange={(value) => setSelectedCompany(value === "all" ? null : value)}>
          <div className="px-4 pt-4 overflow-x-auto">
            <TabsList className="flex overflow-x-auto">
              <TabsTrigger value="all">Toutes les entreprises</TabsTrigger>
              {!loading && companies.map((company) => (
                <TabsTrigger key={company.id} value={company.id}>
                  {company.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          {/* Documents table for the selected company */}
          <div className="pt-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-10"></TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Entreprise</TableHead>
                    <TableHead>Taille</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    // Loading skeletons
                    Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-5" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-36" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : documents.length > 0 ? (
                    documents.map((doc) => {
                      const company = companies.find(c => c.id === doc.companyId);
                      return (
                        <TableRow key={doc.id}>
                          <TableCell>
                            {getFileIcon(doc.name)}
                          </TableCell>
                          <TableCell className="font-medium">{doc.name}</TableCell>
                          <TableCell>{doc.type || "—"}</TableCell>
                          <TableCell>{company?.name || "—"}</TableCell>
                          <TableCell>{formatFileSize(doc.fileSize || 0)}</TableCell>
                          <TableCell>
                            {doc.createdAt ? 
                              format(doc.createdAt.toDate(), 'dd MMM yyyy', { locale: fr }) : 
                              "—"}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button size="icon" variant="ghost">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button size="icon" variant="ghost" className="text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-4">
                        Aucun document trouvé
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </Tabs>
      </Card>
    </div>
  );
};

export default CompaniesDocuments;
