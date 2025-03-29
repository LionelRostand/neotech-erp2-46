
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
import { Search, Filter, Plus, Mail, Send, Eye, Star, StarOff, MoreHorizontal, Clock } from "lucide-react";

const EmailsTab: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher un email..."
              className="pl-8"
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtres
          </Button>
        </div>
        <Button className="ml-4">
          <Mail className="mr-2 h-4 w-4" />
          Nouveau mail
        </Button>
      </div>
      
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead width={30}></TableHead>
              <TableHead>De / À</TableHead>
              <TableHead>Objet</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Pièces jointes</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                  <Star className="h-4 w-4 text-yellow-400" />
                </Button>
              </TableCell>
              <TableCell className="font-medium">
                <div>
                  <div>Alexandre Dupont</div>
                  <div className="text-xs text-muted-foreground">adupont@example.com</div>
                </div>
              </TableCell>
              <TableCell>Question concernant ma réservation du 10 juin</TableCell>
              <TableCell>06/06/2023 14:25</TableCell>
              <TableCell>1</TableCell>
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
              <TableCell>
                <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                  <StarOff className="h-4 w-4" />
                </Button>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Send className="h-4 w-4 mr-2 text-muted-foreground rotate-180" />
                  <div>
                    <div>Marie Leroy</div>
                    <div className="text-xs text-muted-foreground">mleroy@example.com</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>Confirmation de votre réservation</TableCell>
              <TableCell>05/06/2023 10:15</TableCell>
              <TableCell>2</TableCell>
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
              <TableCell>
                <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                  <Star className="h-4 w-4 text-yellow-400" />
                </Button>
              </TableCell>
              <TableCell className="font-medium">
                <div>
                  <div>Entreprise ABC</div>
                  <div className="text-xs text-muted-foreground">contact@abc.com</div>
                </div>
              </TableCell>
              <TableCell>Demande de devis pour service VIP</TableCell>
              <TableCell>04/06/2023 16:30</TableCell>
              <TableCell>0</TableCell>
              <TableCell>
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    En attente
                  </div>
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell>
                <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                  <StarOff className="h-4 w-4" />
                </Button>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Send className="h-4 w-4 mr-2 text-muted-foreground rotate-180" />
                  <div>
                    <div>Jean Martin</div>
                    <div className="text-xs text-muted-foreground">jmartin@example.com</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>Réponse à votre réclamation</TableCell>
              <TableCell>03/06/2023 09:45</TableCell>
              <TableCell>1</TableCell>
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

export default EmailsTab;
