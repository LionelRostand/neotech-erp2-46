
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  User, Plus, Search, Filter, Download, RefreshCw, 
  FileText, Car, CreditCard, Calendar
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Client } from './types/rental-types';

// Mock clients data
const mockClients: Client[] = [
  {
    id: "c1",
    firstName: "Martin",
    lastName: "Dupont",
    email: "martin.dupont@example.com",
    phone: "06 12 34 56 78",
    address: "123 Rue de Paris, 75001 Paris",
    drivingLicenseNumber: "12AB34567",
    drivingLicenseExpiry: "2025-05-12",
    idNumber: "123456789012",
    birthDate: "1985-03-15",
    nationality: "Française",
    notes: "Client régulier depuis 2020",
    createdAt: "2020-03-10",
    updatedAt: "2023-01-15"
  },
  {
    id: "c2",
    firstName: "Sophie",
    lastName: "Lefebvre",
    email: "sophie.lefebvre@example.com",
    phone: "07 23 45 67 89",
    address: "456 Avenue des Champs-Élysées, 75008 Paris",
    drivingLicenseNumber: "23CD45678",
    drivingLicenseExpiry: "2024-11-30",
    idNumber: "234567890123",
    birthDate: "1990-07-22",
    nationality: "Française",
    notes: "",
    createdAt: "2021-05-20",
    updatedAt: "2023-02-10"
  },
  {
    id: "c3",
    firstName: "Jean",
    lastName: "Moreau",
    email: "jean.moreau@example.com",
    phone: "06 34 56 78 90",
    address: "789 Boulevard Saint-Germain, 75006 Paris",
    drivingLicenseNumber: "34EF56789",
    drivingLicenseExpiry: "2026-08-25",
    idNumber: "345678901234",
    birthDate: "1978-11-05",
    nationality: "Française",
    notes: "Préfère les véhicules avec transmission automatique",
    createdAt: "2022-01-15",
    updatedAt: "2023-03-25"
  },
  {
    id: "c4",
    firstName: "Marie",
    lastName: "Durand",
    email: "marie.durand@example.com",
    phone: "07 45 67 89 01",
    address: "101 Rue de Rivoli, 75001 Paris",
    drivingLicenseNumber: "45GH67890",
    drivingLicenseExpiry: "2027-04-18",
    idNumber: "456789012345",
    birthDate: "1982-09-30",
    nationality: "Française",
    notes: "",
    createdAt: "2021-07-10",
    updatedAt: "2023-04-12"
  },
  {
    id: "c5",
    firstName: "Thomas",
    lastName: "Bernard",
    email: "thomas.bernard@example.com",
    phone: "06 56 78 90 12",
    address: "202 Avenue Foch, 75116 Paris",
    drivingLicenseNumber: "56IJ78901",
    drivingLicenseExpiry: "2025-12-05",
    idNumber: "567890123456",
    birthDate: "1995-02-18",
    nationality: "Française",
    notes: "First-time client",
    createdAt: "2023-05-05",
    updatedAt: "2023-05-05"
  }
];

const ClientsManagement = () => {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredClients = clients.filter(client => {
    const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    
    return fullName.includes(searchLower) ||
      client.email.toLowerCase().includes(searchLower) ||
      client.phone.includes(searchTerm);
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Gestion des Clients</h2>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Client
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Rechercher par nom, email ou téléphone..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="w-full sm:w-auto">
            <Filter className="h-4 w-4 mr-2" />
            Filtres
          </Button>
          
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          
          <Button variant="ghost" onClick={() => setClients([...mockClients])}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Permis de conduire</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <div>{client.firstName} {client.lastName}</div>
                        <div className="text-sm text-gray-500">
                          Client depuis {new Date(client.createdAt).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <span className="text-sm">{client.email}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm">{client.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">{client.drivingLicenseNumber}</div>
                      <div className="flex items-center">
                        <Badge 
                          variant={
                            new Date(client.drivingLicenseExpiry) < new Date() 
                              ? "destructive" 
                              : "outline"
                          }
                        >
                          Expire le {new Date(client.drivingLicenseExpiry).toLocaleDateString('fr-FR')}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <Car className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <CreditCard className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {filteredClients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    Aucun client trouvé
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientsManagement;
