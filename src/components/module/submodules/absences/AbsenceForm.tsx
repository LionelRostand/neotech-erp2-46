
import React, { useState, useEffect } from 'react';
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import { useEmployeeData } from '@/hooks/useEmployeeData';

interface AbsenceFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  initialValues?: any;
}

const AbsenceForm: React.FC<AbsenceFormProps> = ({
  onSubmit,
  onCancel,
  initialValues = {}
}) => {
  const { employees = [], isLoading } = useEmployeeData();
  const [formData, setFormData] = useState({
    employeeId: initialValues.employeeId || "",
    employeeName: initialValues.employeeName || "",
    type: initialValues.type || "Congés payés",
    startDate: initialValues.startDate ? new Date(initialValues.startDate) : undefined,
    endDate: initialValues.endDate ? new Date(initialValues.endDate) : undefined,
    reason: initialValues.reason || "",
    notes: initialValues.notes || ""
  });

  // Update employee name when employee ID changes
  useEffect(() => {
    if (formData.employeeId && Array.isArray(employees)) {
      const employee = employees.find(emp => emp?.id === formData.employeeId);
      if (employee) {
        setFormData(prev => ({
          ...prev,
          employeeName: `${employee.firstName || ''} ${employee.lastName || ''}`.trim()
        }));
      }
    }
  }, [formData.employeeId, employees]);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate fields
    if (!formData.employeeId) {
      alert("Veuillez sélectionner un employé");
      return;
    }
    
    if (!formData.startDate || !formData.endDate) {
      alert("Veuillez sélectionner des dates de début et de fin");
      return;
    }
    
    if (formData.endDate < formData.startDate) {
      alert("La date de fin ne peut pas être antérieure à la date de début");
      return;
    }
    
    // Submit form data
    onSubmit(formData);
  };

  // Ensure employees is an array
  const safeEmployees = Array.isArray(employees) ? employees : [];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        name="employeeId"
        render={() => (
          <FormItem>
            <FormLabel>Employé</FormLabel>
            <Select
              value={formData.employeeId}
              onValueChange={(value) => handleChange("employeeId", value)}
              disabled={isLoading}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un employé" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {isLoading ? (
                  <SelectItem value="loading" disabled>
                    Chargement des employés...
                  </SelectItem>
                ) : safeEmployees.length > 0 ? (
                  safeEmployees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {`${employee.firstName || ''} ${employee.lastName || ''}`.trim()}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    Aucun employé disponible
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      <FormField
        name="type"
        render={() => (
          <FormItem>
            <FormLabel>Type de congé</FormLabel>
            <Select
              value={formData.type}
              onValueChange={(value) => handleChange("type", value)}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Type de congé" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Congés payés">Congés payés</SelectItem>
                <SelectItem value="RTT">RTT</SelectItem>
                <SelectItem value="Congé sans solde">Congé sans solde</SelectItem>
                <SelectItem value="Congé maternité">Congé maternité</SelectItem>
                <SelectItem value="Congé paternité">Congé paternité</SelectItem>
                <SelectItem value="Congé maladie">Congé maladie</SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          name="startDate"
          render={() => (
            <FormItem>
              <FormLabel>Date de début</FormLabel>
              <FormControl>
                <DatePicker
                  date={formData.startDate}
                  setDate={(date) => handleChange("startDate", date)}
                  placeholder="Sélectionner la date de début"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          name="endDate"
          render={() => (
            <FormItem>
              <FormLabel>Date de fin</FormLabel>
              <FormControl>
                <DatePicker
                  date={formData.endDate}
                  setDate={(date) => handleChange("endDate", date)}
                  placeholder="Sélectionner la date de fin"
                  fromMonth={formData.startDate}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <FormField
        name="reason"
        render={() => (
          <FormItem>
            <FormLabel>Motif</FormLabel>
            <FormControl>
              <Textarea
                value={formData.reason}
                onChange={(e) => handleChange("reason", e.target.value)}
                placeholder="Motif de l'absence"
                className="min-h-[100px]"
              />
            </FormControl>
          </FormItem>
        )}
      />

      <FormField
        name="notes"
        render={() => (
          <FormItem>
            <FormLabel>Notes complémentaires</FormLabel>
            <FormControl>
              <Textarea
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Informations complémentaires"
              />
            </FormControl>
          </FormItem>
        )}
      />

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button type="submit">
          Enregistrer
        </Button>
      </div>
    </form>
  );
};

export default AbsenceForm;
