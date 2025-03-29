
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
import { Search, Filter, Plus, Clock, PhoneCall, PhoneIncoming, PhoneOutgoing, PhoneMissed, MoreHorizontal, Eye } from "lucide-react";

const CallsTab: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher un appel..."
              className="pl-8"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtres
          </Button>
        </div>
        <Button className="ml-4">
          <PhoneCall className="mr-2 h-4 w-4" />
          Nouvel appel
        </Button>
      </div>
      
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Sujet</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Durée</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">Alexandre Dupont</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <PhoneIncoming className="h-4 w-4 mr-2 text-green-600" />
                  Entrant
                </div>
              </TableCell>
              <TableCell>Question sur la réservation</TableCell>
              <TableCell>06/06/2023 14:25</TableCell>
              <TableCell>8m 32s</TableCell>
              <TableCell>Sophie Martin</TableCell>
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
                  <PhoneOutgoing className="h-4 w-4 mr-2 text-blue-600" />
                  Sortant
                </div>
              </TableCell>
              <TableCell>Confirmation RDV</TableCell>
              <TableCell>05/06/2023 10:15</TableCell>
              <TableCell>3m 47s</TableCell>
              <TableCell>Thomas Bernard</TableCell>
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
                  <PhoneMissed className="h-4 w-4 mr-2 text-red-600" />
                  Manqué
                </div>
              </TableCell>
              <TableCell>Indisponible</TableCell>
              <TableCell>04/06/2023 16:30</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
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
                  <PhoneIncoming className="h-4 w-4 mr-2 text-green-600" />
                  Entrant
                </div>
              </TableCell>
              <TableCell>Réclamation retard</TableCell>
              <TableCell>03/06/2023 09:45</TableCell>
              <TableCell>12m 03s</TableCell>
              <TableCell>Sophie Martin</TableCell>
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

export default CallsTab;
