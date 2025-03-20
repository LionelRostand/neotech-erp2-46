
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Trash2, BookOpen, CreditCard, Bell, History } from "lucide-react";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from "@/components/ui/badge";
import { MemberWithLoans } from '../types/library-types';
import MemberLoansList from './MemberLoansList';
import MemberSubscriptionInfo from './MemberSubscriptionInfo';
import MemberNotifications from './MemberNotifications';

interface MemberDetailsSheetProps {
  member: MemberWithLoans;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}

const MemberDetailsSheet: React.FC<MemberDetailsSheetProps> = ({
  member,
  isOpen,
  onOpenChange,
  onEdit,
  onDelete
}) => {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-4 mb-4 border-b flex-row justify-between items-center">
          <div>
            <SheetTitle>Détails de l'adhérent</SheetTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {member.membershipId}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="h-4 w-4 mr-1" /> Modifier
            </Button>
            <Button variant="destructive" size="sm" onClick={onDelete}>
              <Trash2 className="h-4 w-4 mr-1" /> Supprimer
            </Button>
          </div>
        </SheetHeader>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">{member.firstName} {member.lastName}</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Email</p>
              <p>{member.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Téléphone</p>
              <p>{member.phone || "Non renseigné"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Date d'inscription</p>
              <p>{member.createdAt ? format(new Date(member.createdAt), 'dd MMMM yyyy', { locale: fr }) : "-"}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Statut</p>
              <p>
                {member.status === 'active' && <Badge className="bg-green-100 text-green-800">Actif</Badge>}
                {member.status === 'expired' && <Badge className="bg-red-100 text-red-800">Expiré</Badge>}
                {member.status === 'pending' && <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>}
                {member.status === 'suspended' && <Badge className="bg-slate-100 text-slate-800">Suspendu</Badge>}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-muted-foreground">Adresse</p>
              <p>{member.address || "Non renseignée"}</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="loans" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="loans">
              <BookOpen className="h-4 w-4 mr-1" /> Emprunts
            </TabsTrigger>
            <TabsTrigger value="subscription">
              <CreditCard className="h-4 w-4 mr-1" /> Abonnement
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-1" /> Notifications
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="loans" className="space-y-4 mt-4">
            <MemberLoansList loans={member.loans} />
          </TabsContent>
          
          <TabsContent value="subscription" className="space-y-4 mt-4">
            <MemberSubscriptionInfo member={member} />
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4 mt-4">
            <MemberNotifications member={member} />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default MemberDetailsSheet;
