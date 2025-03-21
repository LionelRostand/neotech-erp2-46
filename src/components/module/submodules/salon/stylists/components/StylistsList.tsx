
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Plus, Filter, Star, Scissors, Phone, Mail, Eye, Edit, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import StylistForm from './StylistForm';
import StylistDetails from './StylistDetails';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for stylists
const STYLISTS_DATA = [
  {
    id: "1",
    firstName: "Sophie",
    lastName: "Martin",
    email: "sophie.martin@example.com",
    phone: "06 12 34 56 78",
    avatar: "",
    specialties: ["Coupe femme", "Coloration", "Mèches"],
    experience: 5,
    status: "available"
  },
  {
    id: "2",
    firstName: "Thomas",
    lastName: "Bernard",
    email: "thomas.bernard@example.com",
    phone: "06 23 45 67 89",
    avatar: "",
    specialties: ["Coupe homme", "Barbe", "Coiffage"],
    experience: 3,
    status: "busy"
  },
  {
    id: "3",
    firstName: "Julie",
    lastName: "Dubois",
    email: "julie.dubois@example.com",
    phone: "06 34 56 78 90",
    avatar: "",
    specialties: ["Chignon", "Lissage", "Coupe femme"],
    experience: 7,
    status: "off"
  },
  {
    id: "4",
    firstName: "Marc",
    lastName: "Leroy",
    email: "marc.leroy@example.com",
    phone: "06 45 67 89 01",
    avatar: "",
    specialties: ["Coupe homme", "Coloration", "Coiffage"],
    experience: 4,
    status: "available"
  },
  {
    id: "5",
    firstName: "Lucie",
    lastName: "Blanc",
    email: "lucie.blanc@example.com",
    phone: "06 56 78 90 12",
    avatar: "",
    specialties: ["Extensions", "Permanente", "Coupe femme"],
    experience: 6,
    status: "busy"
  }
];

const StylistsList: React.FC = () => {
  const { toast } = useToast();
  const [stylists, setStylists] = useState(STYLISTS_DATA);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStylist, setSelectedStylist] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const addStylist = () => {
    setSelectedStylist(null);
    setShowForm(true);
  };

  const editStylist = (stylist) => {
    setSelectedStylist(stylist);
    setShowForm(true);
  };

  const viewStylist = (stylist) => {
    setSelectedStylist(stylist);
    setShowDetails(true);
  };

  const deleteStylist = (id) => {
    toast({
      title: "Coiffeur supprimé",
      description: "Le coiffeur a été supprimé avec succès"
    });
    setStylists(stylists.filter(s => s.id !== id));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "available": return "bg-green-100 text-green-800";
      case "busy": return "bg-blue-100 text-blue-800";
      case "off": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "available": return "Disponible";
      case "busy": return "Occupé";
      case "off": return "Absent";
      default: return "Inconnu";
    }
  };

  const filteredStylists = stylists.filter(stylist => {
    const matchesSearch = 
      stylist.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stylist.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stylist.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stylist.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = filterStatus === "all" || stylist.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un coiffeur..."
            className="pl-8"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        <div className="flex flex-1 md:flex-none gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              <SelectItem value="available">Disponible</SelectItem>
              <SelectItem value="busy">Occupé</SelectItem>
              <SelectItem value="off">Absent</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Plus de filtres
          </Button>
          
          <Button onClick={addStylist}>
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Coiffeur</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Spécialités</TableHead>
                <TableHead>Expérience</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStylists.map((stylist) => (
                <TableRow key={stylist.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={stylist.avatar} />
                        <AvatarFallback>{stylist.firstName.charAt(0)}{stylist.lastName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{stylist.firstName} {stylist.lastName}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Phone className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        {stylist.phone}
                      </div>
                      <div className="flex items-center text-sm">
                        <Mail className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                        {stylist.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {stylist.specialties.map((specialty, idx) => (
                        <Badge key={idx} variant="outline" className="flex items-center">
                          <Star className="h-3 w-3 mr-1 text-amber-500" />
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{stylist.experience} ans</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(stylist.status)}`}>
                      {getStatusText(stylist.status)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => viewStylist(stylist)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => editStylist(stylist)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteStylist(stylist.id)}>
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

      {/* Formulaire ajout/édition coiffeur */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedStylist ? 'Modifier un coiffeur' : 'Ajouter un nouveau coiffeur'}</DialogTitle>
          </DialogHeader>
          <StylistForm 
            stylist={selectedStylist} 
            onClose={() => setShowForm(false)}
            onSave={(data) => {
              toast({
                title: selectedStylist ? "Coiffeur modifié" : "Coiffeur ajouté",
                description: `${data.firstName} ${data.lastName} a été ${selectedStylist ? "modifié" : "ajouté"} avec succès`
              });
              setShowForm(false);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Détails d'un coiffeur */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Détails du coiffeur</DialogTitle>
          </DialogHeader>
          {selectedStylist && <StylistDetails stylist={selectedStylist} />}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StylistsList;
