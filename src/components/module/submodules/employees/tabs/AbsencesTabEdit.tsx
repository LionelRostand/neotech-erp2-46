
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Employee, Absence } from '@/types/employee';
import { Plus, X, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { StatusBadge } from '@/components/ui/status-badge';

interface AbsencesTabEditProps {
  employee: Employee;
  onSave: (data: Partial<Employee>) => void;
  onCancel: () => void;
}

const AbsencesTabEdit: React.FC<AbsencesTabEditProps> = ({ employee, onSave, onCancel }) => {
  const [absences, setAbsences] = useState<Absence[]>(employee.absences || []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newAbsence, setNewAbsence] = useState<Partial<Absence>>({
    type: 'congés payés',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    status: 'pending',
    reason: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewAbsence(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setNewAbsence(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAbsence = () => {
    if (newAbsence.startDate && newAbsence.endDate && newAbsence.type) {
      const absence: Absence = {
        id: Date.now().toString(),
        type: newAbsence.type as string,
        startDate: newAbsence.startDate,
        endDate: newAbsence.endDate,
        status: newAbsence.status as 'approved' | 'pending' | 'rejected',
        reason: newAbsence.reason || '',
        submittedAt: new Date().toISOString()
      };
      
      setAbsences([...absences, absence]);
      setNewAbsence({
        type: 'congés payés',
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        status: 'pending',
        reason: ''
      });
      setShowAddForm(false);
    }
  };

  const handleRemoveAbsence = (id: string) => {
    setAbsences(absences.filter(abs => abs.id !== id));
  };

  const handleUpdateAbsenceStatus = (id: string, status: 'approved' | 'pending' | 'rejected') => {
    setAbsences(absences.map(abs => 
      abs.id === id ? { ...abs, status } : abs
    ));
  };

  const handleSave = () => {
    onSave({ absences });
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Absences</h3>
          {!showAddForm && (
            <Button type="button" onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-1" />
              Ajouter une absence
            </Button>
          )}
        </div>
        
        {absences.length === 0 && !showAddForm ? (
          <p className="text-gray-500">Aucune absence enregistrée</p>
        ) : (
          <div className="space-y-4">
            {absences.map(absence => (
              <div key={absence.id} className="border rounded-md p-3 relative">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="absolute top-2 right-2"
                  onClick={() => handleRemoveAbsence(absence.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  <span className="font-medium">{absence.type}</span>
                  <div className="ml-auto">
                    <StatusBadge status={absence.status} />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Début :</span> {formatDate(absence.startDate)}
                  </div>
                  <div>
                    <span className="text-gray-500">Fin :</span> {formatDate(absence.endDate)}
                  </div>
                  {absence.reason && (
                    <div className="col-span-2">
                      <span className="text-gray-500">Raison :</span> {absence.reason}
                    </div>
                  )}
                </div>
                
                <div className="mt-2 border-t pt-2">
                  <div className="text-sm flex space-x-2">
                    <span>Changer le statut :</span>
                    <button 
                      className={`text-xs px-2 py-1 rounded ${absence.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}
                      onClick={() => handleUpdateAbsenceStatus(absence.id, 'approved')}
                    >
                      Approuvé
                    </button>
                    <button 
                      className={`text-xs px-2 py-1 rounded ${absence.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100'}`}
                      onClick={() => handleUpdateAbsenceStatus(absence.id, 'pending')}
                    >
                      En attente
                    </button>
                    <button 
                      className={`text-xs px-2 py-1 rounded ${absence.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-gray-100'}`}
                      onClick={() => handleUpdateAbsenceStatus(absence.id, 'rejected')}
                    >
                      Refusé
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {showAddForm && (
              <div className="border rounded-md p-4 space-y-4">
                <h4 className="font-medium">Nouvelle absence</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type d'absence</Label>
                    <Select 
                      value={newAbsence.type} 
                      onValueChange={(value) => handleSelectChange('type', value)}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Choisir le type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="congés payés">Congés payés</SelectItem>
                        <SelectItem value="maladie">Maladie</SelectItem>
                        <SelectItem value="congé sans solde">Congé sans solde</SelectItem>
                        <SelectItem value="formation">Formation</SelectItem>
                        <SelectItem value="autre">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Statut</Label>
                    <Select 
                      value={newAbsence.status} 
                      onValueChange={(value) => handleSelectChange('status', value)}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Choisir le statut" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="approved">Approuvé</SelectItem>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="rejected">Refusé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Date de début</Label>
                    <Input 
                      id="startDate" 
                      name="startDate"
                      type="date"
                      value={newAbsence.startDate} 
                      onChange={handleInputChange} 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Date de fin</Label>
                    <Input 
                      id="endDate" 
                      name="endDate"
                      type="date"
                      value={newAbsence.endDate} 
                      onChange={handleInputChange} 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Raison / Commentaire</Label>
                  <Textarea 
                    id="reason" 
                    name="reason"
                    value={newAbsence.reason} 
                    onChange={handleInputChange} 
                    rows={2}
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowAddForm(false)}
                  >
                    Annuler
                  </Button>
                  <Button type="button" onClick={handleAddAbsence}>
                    Ajouter
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2 border-t pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="button" onClick={handleSave}>
          Sauvegarder
        </Button>
      </div>
    </div>
  );
};

export default AbsencesTabEdit;
