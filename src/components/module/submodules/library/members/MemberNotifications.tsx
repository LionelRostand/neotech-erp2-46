
import React from 'react';
import { Switch } from "@/components/ui/switch";
import { MemberWithLoans } from '../types/library-types';
import { Bell, Mail, Smartphone, CalendarClock, BookOpen, CreditCard } from 'lucide-react';

interface MemberNotificationsProps {
  member: MemberWithLoans;
}

const MemberNotifications: React.FC<MemberNotificationsProps> = ({ member }) => {
  // In a real app, these would be loaded from the database
  const [settings, setSettings] = React.useState({
    email: true,
    sms: member.phone ? true : false,
    dueDate: true,
    newArrival: false,
    reservation: true,
    payment: true
  });

  const handleToggle = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <div className="space-y-6">
      <div className="border rounded-md p-4 bg-slate-50 space-y-4">
        <h3 className="font-medium flex items-center">
          <Bell className="h-4 w-4 mr-2" />
          Canaux de notification
        </h3>
        
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-2 text-slate-500" />
            <div>
              <p className="font-medium">Email</p>
              <p className="text-sm text-muted-foreground">{member.email}</p>
            </div>
          </div>
          <Switch 
            checked={settings.email} 
            onCheckedChange={() => handleToggle('email')} 
          />
        </div>
        
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center">
            <Smartphone className="h-4 w-4 mr-2 text-slate-500" />
            <div>
              <p className="font-medium">SMS</p>
              <p className="text-sm text-muted-foreground">{member.phone || "Aucun numéro renseigné"}</p>
            </div>
          </div>
          <Switch 
            checked={settings.sms} 
            onCheckedChange={() => handleToggle('sms')} 
            disabled={!member.phone}
          />
        </div>
      </div>
      
      <div className="border rounded-md p-4 bg-slate-50 space-y-4">
        <h3 className="font-medium flex items-center">
          <Bell className="h-4 w-4 mr-2" />
          Types de notifications
        </h3>
        
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center">
            <CalendarClock className="h-4 w-4 mr-2 text-slate-500" />
            <div>
              <p className="font-medium">Rappel de date de retour</p>
              <p className="text-sm text-muted-foreground">Rappel avant l'échéance de retour</p>
            </div>
          </div>
          <Switch 
            checked={settings.dueDate} 
            onCheckedChange={() => handleToggle('dueDate')} 
          />
        </div>
        
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-2 text-slate-500" />
            <div>
              <p className="font-medium">Nouvelles acquisitions</p>
              <p className="text-sm text-muted-foreground">Nouveaux livres correspondant à vos intérêts</p>
            </div>
          </div>
          <Switch 
            checked={settings.newArrival} 
            onCheckedChange={() => handleToggle('newArrival')} 
          />
        </div>
        
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center">
            <BookOpen className="h-4 w-4 mr-2 text-slate-500" />
            <div>
              <p className="font-medium">Réservation disponible</p>
              <p className="text-sm text-muted-foreground">Notification quand un livre réservé est disponible</p>
            </div>
          </div>
          <Switch 
            checked={settings.reservation} 
            onCheckedChange={() => handleToggle('reservation')} 
          />
        </div>
        
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center">
            <CreditCard className="h-4 w-4 mr-2 text-slate-500" />
            <div>
              <p className="font-medium">Paiements et renouvellements</p>
              <p className="text-sm text-muted-foreground">Rappels de paiement et confirmation</p>
            </div>
          </div>
          <Switch 
            checked={settings.payment} 
            onCheckedChange={() => handleToggle('payment')} 
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <button className="text-sm text-muted-foreground hover:text-foreground hover:underline">
          Voir l'historique des notifications
        </button>
      </div>
    </div>
  );
};

export default MemberNotifications;
