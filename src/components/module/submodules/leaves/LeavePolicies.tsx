
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

export const LeavePolicies: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [policies, setPolicies] = useState({
    minRequestDays: 3,
    maxConsecutiveDays: 25,
    allowHalfDays: true,
    managerApprovalRequired: true,
    allowNegativeBalance: false,
    weekendCountAsLeave: false,
    autoApproveUnder: 2,
    carryOverLimit: 5,
    notificationDays: 2
  });

  const handleSave = () => {
    toast.success("Politiques de congés mises à jour avec succès");
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Politiques de congés</h3>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>Modifier</Button>
        ) : (
          <div className="space-x-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>Annuler</Button>
            <Button onClick={handleSave}>Enregistrer</Button>
          </div>
        )}
      </div>
      
      <div className="grid gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="minRequestDays">Délai minimum de demande (jours)</Label>
              <Input 
                id="minRequestDays" 
                type="number" 
                value={policies.minRequestDays} 
                onChange={(e) => isEditing && setPolicies({...policies, minRequestDays: parseInt(e.target.value)})}
                disabled={!isEditing}
              />
              <p className="text-xs text-gray-500">
                Nombre de jours minimum avant la date de début pour soumettre une demande
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxConsecutiveDays">Jours consécutifs maximum</Label>
              <Input 
                id="maxConsecutiveDays" 
                type="number" 
                value={policies.maxConsecutiveDays} 
                onChange={(e) => isEditing && setPolicies({...policies, maxConsecutiveDays: parseInt(e.target.value)})}
                disabled={!isEditing}
              />
              <p className="text-xs text-gray-500">
                Nombre maximum de jours consécutifs pouvant être pris
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="carryOverLimit">Report maximum (jours)</Label>
              <Input 
                id="carryOverLimit" 
                type="number" 
                value={policies.carryOverLimit} 
                onChange={(e) => isEditing && setPolicies({...policies, carryOverLimit: parseInt(e.target.value)})}
                disabled={!isEditing}
              />
              <p className="text-xs text-gray-500">
                Nombre de jours pouvant être reportés à l'année suivante
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notificationDays">Délai de notification (jours)</Label>
              <Input 
                id="notificationDays" 
                type="number" 
                value={policies.notificationDays} 
                onChange={(e) => isEditing && setPolicies({...policies, notificationDays: parseInt(e.target.value)})}
                disabled={!isEditing}
              />
              <p className="text-xs text-gray-500">
                Nombre de jours avant l'expiration pour envoyer une notification
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="allowHalfDays" 
                checked={policies.allowHalfDays} 
                onCheckedChange={(checked) => isEditing && setPolicies({...policies, allowHalfDays: checked as boolean})}
                disabled={!isEditing}
              />
              <div className="space-y-1 leading-none">
                <Label htmlFor="allowHalfDays" className="text-sm font-medium">
                  Autoriser les demi-journées
                </Label>
                <p className="text-xs text-gray-500">
                  Permettre aux employés de demander des demi-journées de congé
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="managerApprovalRequired" 
                checked={policies.managerApprovalRequired} 
                onCheckedChange={(checked) => isEditing && setPolicies({...policies, managerApprovalRequired: checked as boolean})}
                disabled={!isEditing}
              />
              <div className="space-y-1 leading-none">
                <Label htmlFor="managerApprovalRequired" className="text-sm font-medium">
                  Approbation du manager requise
                </Label>
                <p className="text-xs text-gray-500">
                  Les demandes de congé doivent être approuvées par un manager
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="allowNegativeBalance" 
                checked={policies.allowNegativeBalance} 
                onCheckedChange={(checked) => isEditing && setPolicies({...policies, allowNegativeBalance: checked as boolean})}
                disabled={!isEditing}
              />
              <div className="space-y-1 leading-none">
                <Label htmlFor="allowNegativeBalance" className="text-sm font-medium">
                  Autoriser le solde négatif
                </Label>
                <p className="text-xs text-gray-500">
                  Permettre aux employés de prendre plus de congés que leur solde actuel
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="weekendCountAsLeave" 
                checked={policies.weekendCountAsLeave} 
                onCheckedChange={(checked) => isEditing && setPolicies({...policies, weekendCountAsLeave: checked as boolean})}
                disabled={!isEditing}
              />
              <div className="space-y-1 leading-none">
                <Label htmlFor="weekendCountAsLeave" className="text-sm font-medium">
                  Compter les week-ends comme des congés
                </Label>
                <p className="text-xs text-gray-500">
                  Les week-ends entre deux jours de congé sont comptés comme des jours de congé
                </p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="autoApproveUnder">Approbation automatique sous (jours)</Label>
              <Input 
                id="autoApproveUnder" 
                type="number" 
                value={policies.autoApproveUnder} 
                onChange={(e) => isEditing && setPolicies({...policies, autoApproveUnder: parseInt(e.target.value)})}
                disabled={!isEditing}
              />
              <p className="text-xs text-gray-500">
                Les demandes de moins de ce nombre de jours sont approuvées automatiquement
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          <h4 className="font-medium text-blue-900 mb-2">Types de congés configurés</h4>
          <div className="space-y-2">
            <div className="flex justify-between p-2 bg-white rounded-md">
              <span className="font-medium">Congés payés</span>
              <span>25 jours / an</span>
            </div>
            <div className="flex justify-between p-2 bg-white rounded-md">
              <span className="font-medium">RTT</span>
              <span>12 jours / an</span>
            </div>
            <div className="flex justify-between p-2 bg-white rounded-md">
              <span className="font-medium">Congés sans solde</span>
              <span>Illimité (soumis à approbation)</span>
            </div>
            <div className="flex justify-between p-2 bg-white rounded-md">
              <span className="font-medium">Jours maladie</span>
              <span>Illimité (justificatif requis)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
