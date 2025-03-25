
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
  DialogDescription, DialogClose
} from '@/components/ui/dialog';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { 
  Pencil, Trash2, Eye, Plus, Filter, Search, ArrowRight, ArrowLeft, X, Save
} from 'lucide-react';
import { toast } from 'sonner';

interface Candidate {
  id: string;
  name: string;
  position: string;
  applicationDate: string;
  status: 'Nouveau' | 'Présélectionné' | 'Entretien' | 'Offre' | 'Embauché' | 'Refusé' | 'Fermé';
  email: string;
  phone: string;
  source: string;
  cv?: string;
  skills?: string[];
  notes?: string;
  interviewDate?: string;
  interviewNotes?: string;
  salary?: string;
}

const initialCandidates: Candidate[] = [
  {
    id: 'CAND001',
    name: 'Paul Martin',
    position: 'Développeur Frontend',
    applicationDate: '2025-01-10',
    status: 'Entretien',
    email: 'paul.martin@example.com',
    phone: '06 12 34 56 78',
    source: 'LinkedIn',
    cv: 'cv_paul_martin.pdf',
    skills: ['React', 'TypeScript', 'CSS'],
    notes: 'Candidat prometteur, 5 ans d\'expérience',
    interviewDate: '2025-01-18',
    interviewNotes: 'Bonnes connaissances techniques, communication à améliorer'
  },
  {
    id: 'CAND002',
    name: 'Sophie Dupont',
    position: 'Chef de Projet IT',
    applicationDate: '2025-01-05',
    status: 'Offre',
    email: 'sophie.dupont@example.com',
    phone: '06 23 45 67 89',
    source: 'Indeed',
    cv: 'cv_sophie_dupont.pdf',
    skills: ['Gestion de projet', 'Agile', 'Budgétisation'],
    notes: 'Excellente candidate, 8 ans d\'expérience',
    interviewDate: '2025-01-15',
    interviewNotes: 'Excellent entretien, très bonne gestion d\'équipe',
    salary: '65 000 €'
  },
  {
    id: 'CAND003',
    name: 'Thomas Lefebvre',
    position: 'Ingénieur DevOps',
    applicationDate: '2025-01-08',
    status: 'Présélectionné',
    email: 'thomas.lefebvre@example.com',
    phone: '06 34 56 78 90',
    source: 'Site web',
    cv: 'cv_thomas_lefebvre.pdf',
    skills: ['Docker', 'Kubernetes', 'Jenkins', 'AWS'],
    notes: 'Bonnes connaissances en automatisation, à explorer'
  },
  {
    id: 'CAND004',
    name: 'Marie Legrand',
    position: 'UX Designer',
    applicationDate: '2025-01-03',
    status: 'Embauché',
    email: 'marie.legrand@example.com',
    phone: '06 45 67 89 01',
    source: 'Recommandation',
    cv: 'cv_marie_legrand.pdf',
    skills: ['Figma', 'Adobe XD', 'Sketch', 'User Research'],
    notes: 'Portfolio impressionnant, grande créativité',
    interviewDate: '2025-01-12',
    interviewNotes: 'Excellente compréhension des besoins utilisateurs',
    salary: '48 000 €'
  },
  {
    id: 'CAND005',
    name: 'Antoine Bertrand',
    position: 'Développeur Backend',
    applicationDate: '2025-01-15',
    status: 'Nouveau',
    email: 'antoine.bertrand@example.com',
    phone: '06 56 78 90 12',
    source: 'Monster',
    cv: 'cv_antoine_bertrand.pdf',
    skills: ['Node.js', 'Python', 'SQL', 'MongoDB'],
    notes: 'Profil intéressant, à contacter rapidement'
  },
  {
    id: 'CAND006',
    name: 'Julie Rousseau',
    position: 'Responsable Marketing Digital',
    applicationDate: '2024-12-20',
    status: 'Refusé',
    email: 'julie.rousseau@example.com',
    phone: '06 67 89 01 23',
    source: 'LinkedIn',
    cv: 'cv_julie_rousseau.pdf',
    skills: ['SEO', 'SEM', 'Analytics', 'Social Media'],
    notes: 'Expérience insuffisante pour le poste',
    interviewDate: '2025-01-05',
    interviewNotes: 'Manque de compétences techniques spécifiques'
  }
];

const EmployeesRecruitment: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('list');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newCandidateDialogOpen, setNewCandidateDialogOpen] = useState(false);
  const [newCandidate, setNewCandidate] = useState<Partial<Candidate>>({
    name: '',
    position: '',
    email: '',
    phone: '',
    source: '',
    status: 'Nouveau',
    applicationDate: new Date().toISOString().split('T')[0]
  });

  // Filter candidates based on search term
  const filteredCandidates = candidates.filter(candidate => 
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setViewDialogOpen(true);
  };

  const handleEditCandidate = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setEditDialogOpen(true);
  };

  const handleUpdateCandidate = () => {
    if (!selectedCandidate) return;
    
    setCandidates(candidates.map(c => 
      c.id === selectedCandidate.id ? selectedCandidate : c
    ));
    
    setEditDialogOpen(false);
    toast.success("Candidat mis à jour avec succès");
  };

  const handleCloseApplication = (candidateId: string) => {
    setCandidates(candidates.map(candidate => 
      candidate.id === candidateId 
        ? { ...candidate, status: 'Fermé' } 
        : candidate
    ));
    
    toast.success("Candidature fermée");
  };

  const handleAddCandidate = () => {
    const id = `CAND${String(candidates.length + 1).padStart(3, '0')}`;
    const fullCandidate: Candidate = {
      ...newCandidate as any,
      id,
      status: 'Nouveau',
      applicationDate: newCandidate.applicationDate || new Date().toISOString().split('T')[0]
    };
    
    setCandidates([...candidates, fullCandidate]);
    setNewCandidateDialogOpen(false);
    setNewCandidate({
      name: '',
      position: '',
      email: '',
      phone: '',
      source: '',
      status: 'Nouveau',
      applicationDate: new Date().toISOString().split('T')[0]
    });
    
    toast.success("Nouveau candidat ajouté");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Nouveau':
        return <Badge className="bg-blue-100 text-blue-800">Nouveau</Badge>;
      case 'Présélectionné':
        return <Badge className="bg-purple-100 text-purple-800">Présélectionné</Badge>;
      case 'Entretien':
        return <Badge className="bg-amber-100 text-amber-800">Entretien</Badge>;
      case 'Offre':
        return <Badge className="bg-indigo-100 text-indigo-800">Offre</Badge>;
      case 'Embauché':
        return <Badge className="bg-green-100 text-green-800">Embauché</Badge>;
      case 'Refusé':
        return <Badge className="bg-red-100 text-red-800">Refusé</Badge>;
      case 'Fermé':
        return <Badge className="bg-gray-100 text-gray-800">Fermé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Recrutement</h2>
        <Button onClick={() => setNewCandidateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un nouveau candidat
        </Button>
      </div>

      <Tabs defaultValue="list" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="list">Liste des candidats</TabsTrigger>
            <TabsTrigger value="pipeline">Pipeline de recrutement</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher..."
                className="pl-8 w-[250px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filtres
            </Button>
          </div>
        </div>

        <TabsContent value="list" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidat</TableHead>
                    <TableHead>Poste</TableHead>
                    <TableHead>Date de candidature</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCandidates.length > 0 ? (
                    filteredCandidates.map((candidate) => (
                      <TableRow key={candidate.id}>
                        <TableCell className="font-medium">
                          {candidate.name}
                          <div className="text-xs text-muted-foreground">{candidate.email}</div>
                        </TableCell>
                        <TableCell>{candidate.position}</TableCell>
                        <TableCell>{new Date(candidate.applicationDate).toLocaleDateString('fr-FR')}</TableCell>
                        <TableCell>{getStatusBadge(candidate.status)}</TableCell>
                        <TableCell>{candidate.source}</TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleViewCandidate(candidate)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Voir
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditCandidate(candidate)}
                              disabled={candidate.status === 'Fermé'}
                            >
                              <Pencil className="h-4 w-4 mr-1" />
                              Modifier
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleCloseApplication(candidate.id)}
                              disabled={candidate.status === 'Fermé'}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Fermer
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        Aucun candidat trouvé
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {['Nouveau', 'Présélectionné', 'Entretien', 'Offre', 'Embauché'].map((status) => (
              <div key={status} className="flex flex-col h-full">
                <div className="bg-gray-100 p-3 rounded-t-md font-medium flex justify-between items-center">
                  <span>{status}</span>
                  <Badge variant="outline" className="bg-white">
                    {candidates.filter(c => c.status === status).length}
                  </Badge>
                </div>
                <div className="border border-t-0 rounded-b-md p-2 flex-1 bg-gray-50 space-y-2 min-h-[500px]">
                  {candidates
                    .filter(c => c.status === status)
                    .map(candidate => (
                      <div 
                        key={candidate.id} 
                        className="bg-white p-3 rounded-md border shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handleViewCandidate(candidate)}
                      >
                        <h4 className="font-medium">{candidate.name}</h4>
                        <p className="text-sm text-muted-foreground">{candidate.position}</p>
                        <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                          <span>{new Date(candidate.applicationDate).toLocaleDateString('fr-FR')}</span>
                          <div className="flex space-x-1">
                            <button 
                              className="text-blue-600 hover:text-blue-800"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewCandidate(candidate);
                              }}
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                            <button 
                              className="text-gray-600 hover:text-gray-800"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditCandidate(candidate);
                              }}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  }
                  {candidates.filter(c => c.status === status).length === 0 && (
                    <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                      Aucun candidat
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* View Candidate Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Détails du candidat</DialogTitle>
            <DialogDescription>
              Informations complètes sur le candidat
            </DialogDescription>
          </DialogHeader>
          
          {selectedCandidate && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Informations personnelles</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">Nom</span>
                      <p className="font-medium">{selectedCandidate.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Email</span>
                      <p>{selectedCandidate.email}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Téléphone</span>
                      <p>{selectedCandidate.phone}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Source</span>
                      <p>{selectedCandidate.source}</p>
                    </div>
                    {selectedCandidate.cv && (
                      <Button variant="outline" size="sm" className="mt-2">
                        Télécharger CV
                      </Button>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Informations de candidature</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm text-muted-foreground">Poste</span>
                      <p className="font-medium">{selectedCandidate.position}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Date de candidature</span>
                      <p>{new Date(selectedCandidate.applicationDate).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Statut</span>
                      <p>{getStatusBadge(selectedCandidate.status)}</p>
                    </div>
                    {selectedCandidate.salary && (
                      <div>
                        <span className="text-sm text-muted-foreground">Salaire proposé</span>
                        <p>{selectedCandidate.salary}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {selectedCandidate.skills && selectedCandidate.skills.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Compétences</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidate.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedCandidate.notes && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Notes</h3>
                  <p className="text-sm whitespace-pre-line">{selectedCandidate.notes}</p>
                </div>
              )}

              {selectedCandidate.interviewDate && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Entretien</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-muted-foreground">Date</span>
                      <p>{new Date(selectedCandidate.interviewDate).toLocaleDateString('fr-FR')}</p>
                    </div>
                    {selectedCandidate.interviewNotes && (
                      <div>
                        <span className="text-sm text-muted-foreground">Notes d'entretien</span>
                        <p className="text-sm whitespace-pre-line">{selectedCandidate.interviewNotes}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setViewDialogOpen(false);
                    handleEditCandidate(selectedCandidate);
                  }}
                  disabled={selectedCandidate.status === 'Fermé'}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleCloseApplication(selectedCandidate.id)}
                  disabled={selectedCandidate.status === 'Fermé'}
                >
                  <X className="mr-2 h-4 w-4" />
                  Fermer la candidature
                </Button>
                <DialogClose asChild>
                  <Button>
                    Fermer
                  </Button>
                </DialogClose>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Candidate Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Modifier le candidat</DialogTitle>
            <DialogDescription>
              Modifier les informations du candidat
            </DialogDescription>
          </DialogHeader>
          
          {selectedCandidate && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nom</label>
                  <Input 
                    value={selectedCandidate.name} 
                    onChange={(e) => setSelectedCandidate({
                      ...selectedCandidate,
                      name: e.target.value
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input 
                    value={selectedCandidate.email} 
                    onChange={(e) => setSelectedCandidate({
                      ...selectedCandidate,
                      email: e.target.value
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Téléphone</label>
                  <Input 
                    value={selectedCandidate.phone} 
                    onChange={(e) => setSelectedCandidate({
                      ...selectedCandidate,
                      phone: e.target.value
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Poste</label>
                  <Input 
                    value={selectedCandidate.position} 
                    onChange={(e) => setSelectedCandidate({
                      ...selectedCandidate,
                      position: e.target.value
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Source</label>
                  <Input 
                    value={selectedCandidate.source} 
                    onChange={(e) => setSelectedCandidate({
                      ...selectedCandidate,
                      source: e.target.value
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Statut</label>
                  <Select 
                    value={selectedCandidate.status}
                    onValueChange={(value) => setSelectedCandidate({
                      ...selectedCandidate,
                      status: value as any
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Nouveau">Nouveau</SelectItem>
                      <SelectItem value="Présélectionné">Présélectionné</SelectItem>
                      <SelectItem value="Entretien">Entretien</SelectItem>
                      <SelectItem value="Offre">Offre</SelectItem>
                      <SelectItem value="Embauché">Embauché</SelectItem>
                      <SelectItem value="Refusé">Refusé</SelectItem>
                      <SelectItem value="Fermé">Fermé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date de candidature</label>
                  <Input 
                    type="date"
                    value={selectedCandidate.applicationDate} 
                    onChange={(e) => setSelectedCandidate({
                      ...selectedCandidate,
                      applicationDate: e.target.value
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date d'entretien</label>
                  <Input 
                    type="date"
                    value={selectedCandidate.interviewDate || ''} 
                    onChange={(e) => setSelectedCandidate({
                      ...selectedCandidate,
                      interviewDate: e.target.value
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Salaire proposé</label>
                  <Input 
                    value={selectedCandidate.salary || ''} 
                    onChange={(e) => setSelectedCandidate({
                      ...selectedCandidate,
                      salary: e.target.value
                    })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Compétences (séparées par des virgules)</label>
                <Input 
                  value={selectedCandidate.skills?.join(', ') || ''} 
                  onChange={(e) => setSelectedCandidate({
                    ...selectedCandidate,
                    skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <textarea 
                  className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                  value={selectedCandidate.notes || ''} 
                  onChange={(e) => setSelectedCandidate({
                    ...selectedCandidate,
                    notes: e.target.value
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes d'entretien</label>
                <textarea 
                  className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                  value={selectedCandidate.interviewNotes || ''} 
                  onChange={(e) => setSelectedCandidate({
                    ...selectedCandidate,
                    interviewNotes: e.target.value
                  })}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleUpdateCandidate}>
                  <Save className="mr-2 h-4 w-4" />
                  Enregistrer
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add New Candidate Dialog */}
      <Dialog open={newCandidateDialogOpen} onOpenChange={setNewCandidateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau candidat</DialogTitle>
            <DialogDescription>
              Remplissez les informations pour ajouter un nouveau candidat
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nom *</label>
                <Input 
                  value={newCandidate.name} 
                  onChange={(e) => setNewCandidate({
                    ...newCandidate,
                    name: e.target.value
                  })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Email *</label>
                <Input 
                  type="email"
                  value={newCandidate.email} 
                  onChange={(e) => setNewCandidate({
                    ...newCandidate,
                    email: e.target.value
                  })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Téléphone</label>
                <Input 
                  value={newCandidate.phone} 
                  onChange={(e) => setNewCandidate({
                    ...newCandidate,
                    phone: e.target.value
                  })}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Poste *</label>
                <Input 
                  value={newCandidate.position} 
                  onChange={(e) => setNewCandidate({
                    ...newCandidate,
                    position: e.target.value
                  })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Source</label>
                <Select 
                  value={newCandidate.source}
                  onValueChange={(value) => setNewCandidate({
                    ...newCandidate,
                    source: value
                  })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    <SelectItem value="Indeed">Indeed</SelectItem>
                    <SelectItem value="Monster">Monster</SelectItem>
                    <SelectItem value="Site web">Site web</SelectItem>
                    <SelectItem value="Recommandation">Recommandation</SelectItem>
                    <SelectItem value="Autre">Autre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Date de candidature</label>
                <Input 
                  type="date"
                  value={newCandidate.applicationDate} 
                  onChange={(e) => setNewCandidate({
                    ...newCandidate,
                    applicationDate: e.target.value
                  })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Compétences (séparées par des virgules)</label>
              <Input 
                placeholder="React, TypeScript, CSS..."
                value={newCandidate.skills?.join(', ') || ''} 
                onChange={(e) => setNewCandidate({
                  ...newCandidate,
                  skills: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                })}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <textarea 
                className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                placeholder="Ajoutez vos notes concernant ce candidat..."
                value={newCandidate.notes || ''} 
                onChange={(e) => setNewCandidate({
                  ...newCandidate,
                  notes: e.target.value
                })}
              />
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewCandidateDialogOpen(false)}>
                Annuler
              </Button>
              <Button 
                onClick={handleAddCandidate}
                disabled={!newCandidate.name || !newCandidate.position || !newCandidate.email}
              >
                Ajouter
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeesRecruitment;
