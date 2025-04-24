
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface AppointmentViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: any;
}

const AppointmentViewDialog = ({ open, onOpenChange, appointment }: AppointmentViewDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Détails du rendez-vous</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="font-medium mb-1">Date</div>
              <div>{appointment?.date}</div>
            </div>
            <div>
              <div className="font-medium mb-1">Heure</div>
              <div>{appointment?.time}</div>
            </div>
          </div>
          
          <div>
            <div className="font-medium mb-1">Client</div>
            <div>{appointment?.clientName}</div>
          </div>
          
          <div>
            <div className="font-medium mb-1">Service</div>
            <div>{appointment?.service}</div>
          </div>
          
          <div>
            <div className="font-medium mb-1">Statut</div>
            <Badge 
              variant={appointment?.status === 'completed' ? 'default' : 
                      appointment?.status === 'scheduled' ? 'secondary' : 
                      'destructive'}
            >
              {appointment?.status === 'scheduled' ? 'Planifié' :
               appointment?.status === 'completed' ? 'Terminé' :
               'Annulé'}
            </Badge>
          </div>
          
          {appointment?.notes && (
            <div>
              <div className="font-medium mb-1">Notes</div>
              <div>{appointment.notes}</div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentViewDialog;
