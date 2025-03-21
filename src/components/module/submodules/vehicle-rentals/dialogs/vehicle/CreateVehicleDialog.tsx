
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Vehicle, VehicleStatus, VehicleType } from '../../types/rental-types';
import { addDocument } from '@/hooks/firestore/create-operations';
import { toast } from 'sonner';

const vehicleSchema = z.object({
  brand: z.string().min(2, { message: 'La marque est requise' }),
  model: z.string().min(2, { message: 'Le modèle est requis' }),
  year: z.coerce.number().min(1900, { message: 'Année invalide' }).max(new Date().getFullYear() + 1),
  licensePlate: z.string().min(5, { message: 'Immatriculation invalide' }),
  type: z.enum(['sedan', 'suv', 'hatchback', 'van', 'truck', 'luxury', 'convertible', 'electric']),
  status: z.enum(['available', 'rented', 'maintenance', 'reserved', 'inactive']),
  dailyRate: z.coerce.number().min(1, { message: 'Tarif journalier requis' }),
  mileage: z.coerce.number().min(0, { message: 'Kilométrage invalide' }),
  features: z.string().transform(val => val.split(',').map(v => v.trim())),
  locationId: z.string().min(1, { message: 'Emplacement requis' }),
  nextMaintenanceDate: z.string().min(1, { message: 'Date de maintenance requise' }),
  lastMaintenanceDate: z.string().min(1, { message: 'Date de dernière maintenance requise' }),
  notes: z.string().optional(),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

// Types d'affichage pour l'interface utilisateur
const vehicleTypeOptions = [
  { value: 'sedan', label: 'Berline' },
  { value: 'suv', label: 'SUV' },
  { value: 'hatchback', label: 'Compacte' },
  { value: 'van', label: 'Utilitaire' },
  { value: 'truck', label: 'Camion' },
  { value: 'luxury', label: 'Luxe' },
  { value: 'convertible', label: 'Cabriolet' },
  { value: 'electric', label: 'Électrique' },
];

const vehicleStatusOptions = [
  { value: 'available', label: 'Disponible' },
  { value: 'rented', label: 'Loué' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'reserved', label: 'Réservé' },
  { value: 'inactive', label: 'Inactif' },
];

// Emplacements fictifs pour la démonstration
const locationOptions = [
  { value: 'loc1', label: 'Paris Centre' },
  { value: 'loc2', label: 'Lyon' },
  { value: 'loc3', label: 'Marseille' },
  { value: 'loc4', label: 'Bordeaux' },
];

interface CreateVehicleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onVehicleCreated: (vehicle: Vehicle) => void;
}

const CreateVehicleDialog: React.FC<CreateVehicleDialogProps> = ({
  isOpen,
  onClose,
  onVehicleCreated,
}) => {
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      brand: '',
      model: '',
      year: new Date().getFullYear(),
      licensePlate: '',
      type: 'hatchback',
      status: 'available',
      dailyRate: 50,
      mileage: 0,
      features: '',
      locationId: 'loc1',
      nextMaintenanceDate: '',
      lastMaintenanceDate: '',
      notes: '',
    },
  });

  const onSubmit = async (values: VehicleFormValues) => {
    try {
      const newVehicle = {
        ...values,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Dans un environnement de production, utilisez addDocument pour ajouter à Firestore
      // const vehicleWithId = await addDocument('vehicles', newVehicle);
      
      // Pour la démonstration, nous simulons l'ajout d'un ID
      const vehicleWithId = {
        id: `v${Math.floor(Math.random() * 1000)}`,
        ...newVehicle,
      };
      
      onVehicleCreated(vehicleWithId as Vehicle);
      toast.success('Véhicule ajouté avec succès');
      onClose();
    } catch (error) {
      console.error('Erreur lors de la création du véhicule:', error);
      toast.error('Erreur lors de la création du véhicule');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Ajouter un nouveau véhicule</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Marque</FormLabel>
                    <FormControl>
                      <Input placeholder="Marque" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Modèle</FormLabel>
                    <FormControl>
                      <Input placeholder="Modèle" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Année</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="licensePlate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Immatriculation</FormLabel>
                    <FormControl>
                      <Input placeholder="AA-123-BB" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type de véhicule</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vehicleTypeOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un statut" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vehicleStatusOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="dailyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tarif journalier (€)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="mileage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kilométrage</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="features"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel>Caractéristiques</FormLabel>
                    <FormControl>
                      <Input placeholder="Climatisation, GPS, Bluetooth..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="locationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Emplacement</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un emplacement" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {locationOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="lastMaintenanceDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dernière maintenance</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="nextMaintenanceDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prochaine maintenance</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="col-span-1 md:col-span-2">
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Input placeholder="Notes (optionnel)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>Annuler</Button>
              <Button type="submit">Créer</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateVehicleDialog;
