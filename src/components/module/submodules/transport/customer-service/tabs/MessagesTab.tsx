
import React from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Plus, MessagesSquare, MoreHorizontal, Mail, Eye } from "lucide-react";

const MessagesTab: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher un message..."
              className="pl-8"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtres
          </Button>
        </div>
        <Button className="ml-4">
          <Plus className="mr-2 h-4 w-4" />
          Nouveau message
        </Button>
      </div>
      
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Objet</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Alexandre Dupont</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <MessagesSquare className="h-4 w-4 mr-2 text-muted-foreground" />
                  SMS
                </div>
              </TableCell>
              <TableCell>Confirmation réservation</TableCell>
              <TableCell>06/06/2023</TableCell>
              <TableCell>
                <Badge variant="outline">Envoyé</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell className="font-medium">Marie Leroy</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  Email
                </div>
              </TableCell>
              <TableCell>Facture FACT-2023-002</TableCell>
              <TableCell>05/06/2023</TableCell>
              <TableCell>
                <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Reçu</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell className="font-medium">Entreprise ABC</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  Email
                </div>
              </TableCell>
              <TableCell>Demande de devis</TableCell>
              <TableCell>02/06/2023</TableCell>
              <TableCell>
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">En attente</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell className="font-medium">Jean Martin</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <MessagesSquare className="h-4 w-4 mr-2 text-muted-foreground" />
                  SMS
                </div>
              </TableCell>
              <TableCell>Rappel réservation</TableCell>
              <TableCell>01/06/2023</TableCell>
              <TableCell>
                <Badge variant="outline">Envoyé</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default MessagesTab;
