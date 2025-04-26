
import React, { useState, useEffect } from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { ServicesSelector } from '../services/ServicesSelector';
import { DatePicker } from '@/components/ui/date-picker';
import { useGarageServicesList } from '../hooks/useGarageServicesList';

interface MaintenanceFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const MaintenanceForm = ({ onSubmit, onCancel }: MaintenanceFormProps) => {
  const [totalCost, setTotalCost] = useState(0);
  const { servicesOptions } = useGarageServicesList();
  const [selectedServices, setSelectedServices] = useState([]);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const form = useForm({
    defaultValues: {
      description: '',
      services: [],
      startDate: null,
      endDate: null,
      totalCost: 0
    }
  });

  const handleSubmit = (data: any) => {
    const formData = {
      ...data,
      services: selectedServices,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      totalCost
    };
    onSubmit(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Services</label>
            <ServicesSelector
              services={[]}
              onChange={setSelectedServices}
              onCostChange={setTotalCost}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Date de début</label>
              <DatePicker
                date={startDate}
                onSelect={setStartDate}
                placeholder="Sélectionner une date de début"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Date de fin</label>
              <DatePicker
                date={endDate}
                onSelect={setEndDate}
                placeholder="Sélectionner une date de fin"
                disabled={!startDate}
                fromDate={startDate}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              {...form.register('description')}
              className="w-full min-h-[100px] p-2 border rounded-md"
              placeholder="Description de la maintenance"
            />
          </div>

          <div className="text-right">
            <p className="text-lg font-semibold">
              Coût total: {totalCost}€
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
          <Button type="submit">
            Créer la maintenance
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MaintenanceForm;
