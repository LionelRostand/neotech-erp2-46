
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Phone, User, Plus, Search, Clock, Calendar, ArrowUpDown } from "lucide-react";
import { toast } from "sonner";

interface PhoneCall {
  id: string;
  clientName: string;
  phoneNumber: string;
  date: Date;
  duration: string;
  status: 'incoming' | 'outgoing' | 'missed' | 'completed';
  notes: string;
}

const PhoneSupportTab: React.FC = () => {
  const [calls, setCalls] = useState<PhoneCall[]>([
    {
      id: "call-1",
      clientName: "Jean Dupont",
      phoneNumber: "+33 6 12 34 56 78",
      date: new Date(2023, 9, 15, 14, 30),
      duration: "12:45",
      status: 'completed',
      notes: "Client souhaite modifier sa réservation du 20 octobre. Changement effectué."
    },
    {
      id: "call-2",
      clientName: "Marie Lambert",
      phoneNumber: "+33 6 98 76 54 32",
      date: new Date(2023, 9, 15, 10, 15),
      duration: "04:22",
      status: 'completed',
      notes: "Demande d'information sur nos services VIP."
    },
    {
      id: "call-3",
      clientName: "Pierre Martin",
      phoneNumber: "+33 7 12 34 56 78",
      date: new Date(2023, 9, 14, 16, 45),
      duration: "00:00",
      status: 'missed',
      notes: "A rappeler demain."
    }
  ]);
  
  const [showNewCallForm, setShowNewCallForm] = useState(false);
  const [newCall, setNewCall] = useState<Partial<PhoneCall>>({
    clientName: "",
    phoneNumber: "",
    date: new Date(),
    duration: "00:00",
    status: 'outgoing',
    notes: ""
  });
  
  const [selectedCall, setSelectedCall] = useState<PhoneCall | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleAddCall = () => {
    if (!newCall.clientName || !newCall.phoneNumber) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    
    const call: PhoneCall = {
      id: `call-${Date.now()}`,
      clientName: newCall.clientName || "",
      phoneNumber: newCall.phoneNumber || "",
      date: new Date(),
      duration: newCall.duration || "00:00",
      status: newCall.status as 'incoming' | 'outgoing' | 'missed' | 'completed',
      notes: newCall.notes || ""
    };
    
    setCalls([call, ...calls]);
    setShowNewCallForm(false);
    setNewCall({
      clientName: "",
      phoneNumber: "",
      date: new Date(),
      duration: "00:00",
      status: 'outgoing',
      notes: ""
    });
    
    toast.success("Appel enregistré avec succès");
  };
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'incoming':
        return 'bg-blue-500';
      case 'outgoing':
        return 'bg-green-500';
      case 'missed':
        return 'bg-red-500';
      case 'completed':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'incoming':
        return 'Entrant';
      case 'outgoing':
        return 'Sortant';
      case 'missed':
        return 'Manqué';
      case 'completed':
        return 'Terminé';
      default:
        return status;
    }
  };
  
  const filteredCalls = calls.filter(call => {
    if (filterStatus !== "all" && call.status !== filterStatus) {
      return false;
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        call.clientName.toLowerCase().includes(query) ||
        call.phoneNumber.toLowerCase().includes(query) ||
        call.notes.toLowerCase().includes(query)
      );
    }
    
    return true;
  });
  
  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Phone className="h-6 w-6 text-blue-500" />
              <h2 className="text-xl font-semibold">Support Téléphonique</h2>
            </div>
            <Button 
              onClick={() => setShowNewCallForm(!showNewCallForm)} 
              className="bg-blue-500 hover:bg-blue-600"
            >
              <Plus className="h-4 w-4 mr-2" /> Nouvel Appel
            </Button>
          </div>
          
          {showNewCallForm && (
            <Card className="border border-blue-100 bg-blue-50 p-4">
              <h3 className="text-lg font-medium mb-4">Enregistrer un nouvel appel</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nom du client</label>
                  <Input 
                    value={newCall.clientName}
                    onChange={(e) => setNewCall({...newCall, clientName: e.target.value})}
                    placeholder="Nom du client"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Numéro de téléphone</label>
                  <Input 
                    value={newCall.phoneNumber}
                    onChange={(e) => setNewCall({...newCall, phoneNumber: e.target.value})}
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Durée</label>
                  <Input 
                    value={newCall.duration}
                    onChange={(e) => setNewCall({...newCall, duration: e.target.value})}
                    placeholder="MM:SS"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Statut</label>
                  <Select 
                    value={newCall.status as string}
                    onValueChange={(value: 'incoming' | 'outgoing' | 'missed' | 'completed') => setNewCall({...newCall, status: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="incoming">Entrant</SelectItem>
                      <SelectItem value="outgoing">Sortant</SelectItem>
                      <SelectItem value="missed">Manqué</SelectItem>
                      <SelectItem value="completed">Terminé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Notes</label>
                  <Textarea 
                    value={newCall.notes}
                    onChange={(e) => setNewCall({...newCall, notes: e.target.value})}
                    placeholder="Détails de l'appel..."
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-4 space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowNewCallForm(false)}
                >
                  Annuler
                </Button>
                <Button 
                  onClick={handleAddCall}
                  className="bg-blue-500 hover:bg-blue-600"
                >
                  Enregistrer
                </Button>
              </div>
            </Card>
          )}
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="w-full sm:w-1/3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  placeholder="Rechercher un client, numéro..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full sm:w-1/4">
              <Select 
                value={filterStatus}
                onValueChange={(value) => setFilterStatus(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les appels</SelectItem>
                  <SelectItem value="incoming">Entrants</SelectItem>
                  <SelectItem value="outgoing">Sortants</SelectItem>
                  <SelectItem value="missed">Manqués</SelectItem>
                  <SelectItem value="completed">Terminés</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Numéro</TableHead>
                  <TableHead>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Date</span>
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>Durée</span>
                    </div>
                  </TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCalls.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                      Aucun appel trouvé
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCalls.map((call) => (
                    <TableRow 
                      key={call.id} 
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => setSelectedCall(call)}
                    >
                      <TableCell className="font-medium">{call.clientName}</TableCell>
                      <TableCell>{call.phoneNumber}</TableCell>
                      <TableCell>{formatDate(call.date)}</TableCell>
                      <TableCell>{call.duration}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(call.status)}>
                          {getStatusLabel(call.status)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {selectedCall && (
            <Card className="border border-gray-200 p-4">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                  <User className="h-6 w-6 text-gray-500" />
                  <div>
                    <h3 className="text-lg font-medium">{selectedCall.clientName}</h3>
                    <p className="text-sm text-gray-500">{selectedCall.phoneNumber}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(selectedCall.status)}>
                  {getStatusLabel(selectedCall.status)}
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Date et heure</p>
                  <p>{formatDate(selectedCall.date)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Durée de l'appel</p>
                  <p>{selectedCall.duration}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Notes</p>
                <div className="bg-gray-50 p-3 rounded-md">
                  {selectedCall.notes || "Aucune note pour cet appel."}
                </div>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedCall(null)}
                >
                  Fermer
                </Button>
                <Button 
                  onClick={() => {
                    // Modifier le statut de l'appel à 'completed' si ce n'est pas déjà le cas
                    if (selectedCall.status !== 'completed') {
                      const updatedCalls = calls.map(call => 
                        call.id === selectedCall.id ? {...call, status: 'completed' as const} : call
                      );
                      setCalls(updatedCalls);
                      setSelectedCall({...selectedCall, status: 'completed'});
                      toast.success("Appel marqué comme terminé");
                    }
                  }}
                  className="bg-green-500 hover:bg-green-600"
                  disabled={selectedCall.status === 'completed'}
                >
                  Marquer comme terminé
                </Button>
              </div>
            </Card>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PhoneSupportTab;
