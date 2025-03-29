
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, Filter, Plus, Mail, Phone, MessageSquare, Clock, MoreHorizontal, Star } from "lucide-react";

const CustomersTab: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-4 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher un client..."
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
          Ajouter un client
        </Button>
      </div>
      
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Dernière activité</TableHead>
              <TableHead>Total commandes</TableHead>
              <TableHead>Note</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">Alexandre Dupont</div>
                    <div className="text-xs text-muted-foreground">Client depuis 12/03/2022</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center">
                    <Mail className="h-3 w-3 mr-2 text-muted-foreground" />
                    adupont@example.com
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-3 w-3 mr-2 text-muted-foreground" />
                    06 12 34 56 78
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <div>Message</div>
                    <div className="text-xs text-muted-foreground">06/06/2023</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>12</TableCell>
              <TableCell>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`h-4 w-4 ${star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-muted'}`} 
                    />
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-1">
                  <Button variant="ghost" size="icon" title="Envoyer un email">
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Appeler">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Message">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell>
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarFallback>ML</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">Marie Leroy</div>
                    <div className="text-xs text-muted-foreground">Client depuis 25/04/2022</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center">
                    <Mail className="h-3 w-3 mr-2 text-muted-foreground" />
                    mleroy@example.com
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-3 w-3 mr-2 text-muted-foreground" />
                    06 23 45 67 89
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <div>Email</div>
                    <div className="text-xs text-muted-foreground">05/06/2023</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>8</TableCell>
              <TableCell>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`h-4 w-4 ${star <= 5 ? 'text-yellow-400 fill-yellow-400' : 'text-muted'}`} 
                    />
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-1">
                  <Button variant="ghost" size="icon" title="Envoyer un email">
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Appeler">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Message">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell>
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarFallback>EA</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">Entreprise ABC</div>
                    <div className="text-xs text-muted-foreground">Client depuis 10/01/2023</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center">
                    <Mail className="h-3 w-3 mr-2 text-muted-foreground" />
                    contact@abc.com
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-3 w-3 mr-2 text-muted-foreground" />
                    01 23 45 67 89
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <div>
                    <div>Email</div>
                    <div className="text-xs text-muted-foreground">04/06/2023</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>3</TableCell>
              <TableCell>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      className={`h-4 w-4 ${star <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-muted'}`} 
                    />
                  ))}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-1">
                  <Button variant="ghost" size="icon" title="Envoyer un email">
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Appeler">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Message">
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default CustomersTab;
