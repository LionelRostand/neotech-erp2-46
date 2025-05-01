
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BadgeData } from './BadgeTypes';
import { Badge } from '@/components/ui/badge';
import { Building, Check, X, AlertCircle, IdCard, CalendarDays, Building2 } from 'lucide-react';

interface ViewBadgeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  badge: BadgeData | null;
}

const ViewBadgeDialog: React.FC<ViewBadgeDialogProps> = ({
  isOpen,
  onOpenChange,
  badge,
}) => {
  if (!badge) return null;

  // Fonction pour formater l'ID du badge à 6 caractères maximum
  const formatBadgeId = (badgeId: string) => {
    if (!badgeId) return "";
    return badgeId.length > 6 ? badgeId.substring(0, 6) : badgeId;
  };

  const renderStatus = (status: string) => {
    if (status === 'success') {
      return <Badge className="bg-green-100 text-green-800 border-green-300"><Check className="h-3 w-3 mr-1" /> Actif</Badge>;
    } else if (status === 'error') {
      return <Badge className="bg-red-100 text-red-800 border-red-300"><X className="h-3 w-3 mr-1" /> Désactivé</Badge>;
    } else if (status === 'warning') {
      return <Badge className="bg-amber-100 text-amber-800 border-amber-300"><AlertCircle className="h-3 w-3 mr-1" /> Expiré</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Détails du Badge</DialogTitle>
          <DialogDescription>
            Informations complètes sur le badge {formatBadgeId(badge.id)}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-center bg-gray-100 rounded-lg p-6 mb-4">
            <div className="text-center">
              <IdCard className="h-16 w-16 mx-auto mb-2 text-primary" />
              <h3 className="text-lg font-semibold">{badge.employeeName}</h3>
              <p className="text-sm text-muted-foreground">{badge.accessLevel}</p>
              <div className="mt-2">{renderStatus(badge.status)}</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-sm font-medium">N° Badge:</span>
              <span className="text-sm">{formatBadgeId(badge.id)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium flex items-center">
                <CalendarDays className="h-4 w-4 mr-1" /> Date de création:
              </span>
              <span className="text-sm">{badge.date}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium flex items-center">
                <Building className="h-4 w-4 mr-1" /> Département:
              </span>
              <span className="text-sm">{badge.department || 'Non spécifié'}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium flex items-center">
                <Building2 className="h-4 w-4 mr-1" /> Entreprise:
              </span>
              <span className="text-sm">{badge.company || 'Non spécifiée'}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Fermer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewBadgeDialog;
