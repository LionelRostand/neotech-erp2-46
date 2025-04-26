
import React, { useState } from 'react';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import ServicesSelector from '@/components/module/submodules/garage/repairs/ServicesSelector';
import { DatePicker } from '@/components/ui/date-picker';
import { useGarageServicesList } from '../hooks/useGarageServicesList';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGarageClients } from '@/hooks/garage/useGarageClients';
import { useGarageMechanics } from '@/hooks/garage/useGarageMechanics';
import { useGarageVehicles } from '@/hooks/garage/useGarageVehicles';

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
  const [selectedMechanic, setSelectedMechanic] = useState<string>('');
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');

  const { mechanics } = useGarageMechanics();
  const { clients } = useGarageClients();
  const { vehicles } = useGarageVehicles();

  const form = useForm({
    defaultValues: {
      description: '',
      services: [],
      startDate: null,
      endDate: null,
      totalCost: 0,
      mechanicId: '',
      clientId: '',
      vehicleId: ''
    }
  });

  const handleSubmit = (data: any) => {
    const formData = {
      ...data,
      services: selectedServices,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      totalCost,
      mechanicId: selectedMechanic,
      clientId: selectedClient,
      vehicleId: selectedVehicle
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

          {/* Mechanic Selection */}
          <div>
            <label className="text-sm font-medium">Mécanicien</label>
            <Select value={selectedMechanic} onValueChange={setSelectedMechanic}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner un mécanicien" />
              </SelectTrigger>
              <SelectContent>
                {mechanics?.map((mechanic: any) => (
                  <SelectItem key={mechanic.id} value={mechanic.id}>
                    {`${mechanic.firstName} ${mechanic.lastName}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Client Selection */}
          <div>
            <label className="text-sm font-medium">Client</label>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
              <SelectContent>
                {clients?.map((client: any) => (
                  <SelectItem key={client.id} value={client.id}>
                    {`${client.firstName} ${client.lastName}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Vehicle Selection */}
          <div>
            <label className="text-sm font-medium">Véhicule</label>
            <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionner un véhicule" />
              </SelectTrigger>
              <SelectContent>
                {vehicles?.map((vehicle: any) => (
                  <SelectItem key={vehicle.id} value={vehicle.id}>
                    {`${vehicle.make} ${vehicle.model} - ${vehicle.licensePlate}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
