
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useEmployeeLeaveUpdate } from '@/hooks/useEmployeeLeaveUpdate';
import { Employee } from '@/types/employee';
import { Save, RotateCcw } from 'lucide-react';

interface LeaveBalanceEditorProps {
  employee: Employee;
  onUpdateSuccess?: () => void;
}

const LeaveBalanceEditor: React.FC<LeaveBalanceEditorProps> = ({ 
  employee, 
  onUpdateSuccess 
}) => {
  const { updateEmployeeLeaveBalance, isUpdating } = useEmployeeLeaveUpdate();
  
  // État pour les valeurs de congés
  const [congesAcquired, setCongesAcquired] = useState<number>(25);
  const [congesTaken, setCongesTaken] = useState<number>(0);
  const [congesBalance, setCongesBalance] = useState<number>(25);
  
  // État pour les valeurs de RTT
  const [rttAcquired, setRttAcquired] = useState<number>(10);
  const [rttTaken, setRttTaken] = useState<number>(0);
  const [rttBalance, setRttBalance] = useState<number>(10);
  
  // Fonction pour calculer le solde
  const calculateBalance = (acquired: number, taken: number) => {
    return Math.max(0, acquired - taken);
  };
  
  // Initialiser avec les valeurs actuelles de l'employé
  useEffect(() => {
    if (employee.conges) {
      setCongesAcquired(employee.conges.acquired || 25);
      setCongesTaken(employee.conges.taken || 0);
      setCongesBalance(employee.conges.balance || calculateBalance(employee.conges.acquired || 25, employee.conges.taken || 0));
    }
    
    if (employee.rtt) {
      setRttAcquired(employee.rtt.acquired || 10);
      setRttTaken(employee.rtt.taken || 0);
      setRttBalance(employee.rtt.balance || calculateBalance(employee.rtt.acquired || 10, employee.rtt.taken || 0));
    }
  }, [employee]);
  
  // Mettre à jour le solde lorsque les valeurs de congés ou RTT changent
  useEffect(() => {
    setCongesBalance(calculateBalance(congesAcquired, congesTaken));
  }, [congesAcquired, congesTaken]);
  
  useEffect(() => {
    setRttBalance(calculateBalance(rttAcquired, rttTaken));
  }, [rttAcquired, rttTaken]);
  
  // Gérer le changement des champs
  const handleInputChange = (setter: React.Dispatch<React.SetStateAction<number>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setter(value);
  };
  
  // Réinitialiser le formulaire
  const handleReset = () => {
    if (employee.conges) {
      setCongesAcquired(employee.conges.acquired || 25);
      setCongesTaken(employee.conges.taken || 0);
    } else {
      setCongesAcquired(25);
      setCongesTaken(0);
    }
    
    if (employee.rtt) {
      setRttAcquired(employee.rtt.acquired || 10);
      setRttTaken(employee.rtt.taken || 0);
    } else {
      setRttAcquired(10);
      setRttTaken(0);
    }
  };
  
  // Enregistrer les changements
  const handleSave = async () => {
    const success = await updateEmployeeLeaveBalance(
      employee.id,
      {
        acquired: congesAcquired,
        taken: congesTaken,
        balance: congesBalance
      },
      {
        acquired: rttAcquired,
        taken: rttTaken,
        balance: rttBalance
      }
    );
    
    if (success && onUpdateSuccess) {
      onUpdateSuccess();
    }
  };
  
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-4">Mise à jour des soldes de congés</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-md font-medium">Congés payés</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="conges-acquired">Acquis</Label>
              <div className="flex items-center">
                <Input 
                  id="conges-acquired"
                  type="number" 
                  min="0" 
                  value={congesAcquired}
                  onChange={handleInputChange(setCongesAcquired)}
                  className="w-full"
                />
                <span className="ml-2">jours</span>
              </div>
            </div>
            
            <div>
              <Label htmlFor="conges-taken">Pris</Label>
              <div className="flex items-center">
                <Input 
                  id="conges-taken"
                  type="number" 
                  min="0" 
                  max={congesAcquired}
                  value={congesTaken}
                  onChange={handleInputChange(setCongesTaken)}
                  className="w-full"
                />
                <span className="ml-2">jours</span>
              </div>
            </div>
            
            <div className="col-span-2">
              <Label htmlFor="conges-balance">Solde actuel</Label>
              <div className="flex items-center">
                <Input 
                  id="conges-balance"
                  type="number" 
                  value={congesBalance}
                  readOnly
                  className="w-full bg-gray-50"
                />
                <span className="ml-2">jours</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="text-md font-medium">RTT</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rtt-acquired">Acquis</Label>
              <div className="flex items-center">
                <Input 
                  id="rtt-acquired"
                  type="number" 
                  min="0" 
                  value={rttAcquired}
                  onChange={handleInputChange(setRttAcquired)}
                  className="w-full"
                />
                <span className="ml-2">jours</span>
              </div>
            </div>
            
            <div>
              <Label htmlFor="rtt-taken">Pris</Label>
              <div className="flex items-center">
                <Input 
                  id="rtt-taken"
                  type="number" 
                  min="0" 
                  max={rttAcquired}
                  value={rttTaken}
                  onChange={handleInputChange(setRttTaken)}
                  className="w-full"
                />
                <span className="ml-2">jours</span>
              </div>
            </div>
            
            <div className="col-span-2">
              <Label htmlFor="rtt-balance">Solde actuel</Label>
              <div className="flex items-center">
                <Input 
                  id="rtt-balance"
                  type="number" 
                  value={rttBalance}
                  readOnly
                  className="w-full bg-gray-50"
                />
                <span className="ml-2">jours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button 
          variant="outline" 
          onClick={handleReset}
          disabled={isUpdating}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Réinitialiser
        </Button>
        
        <Button
          onClick={handleSave}
          disabled={isUpdating}
        >
          <Save className="h-4 w-4 mr-2" />
          Enregistrer
        </Button>
      </div>
    </div>
  );
};

export default LeaveBalanceEditor;
