
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useGarageData } from "@/hooks/garage/useGarageData";
import { Service } from "@/components/module/submodules/garage/types/garage-types";

const maintenanceFormSchema = z.object({
  clientId: z.string().min(1, "Veuillez sélectionner un client"),
  vehicleId: z.string().min(1, "Veuillez sélectionner un véhicule"),
  mechanicId: z.string().min(1, "Veuillez sélectionner un mécanicien"),
  services: z.array(z.string()).min(1, "Veuillez sélectionner au moins un service"),
  description: z.string().optional(),
  startDate: z.string().min(1, "Veuillez sélectionner une date de début"),
  estimatedEndDate: z.string().min(1, "Veuillez sélectionner une date de fin estimée"),
});

type MaintenanceFormValues = z.infer<typeof maintenanceFormSchema>;

export const useMaintenanceForm = () => {
  const { services = [], clients = [], vehicles = [], mechanics = [], isLoading } = useGarageData();

  const form = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceFormSchema),
    defaultValues: {
      services: [],
      description: "",
    },
  });

  const calculateTotalCost = (selectedServiceIds: string[]) => {
    return selectedServiceIds.reduce((total, serviceId) => {
      const service = services.find((s: Service) => s.id === serviceId);
      return total + (service?.cost || 0);
    }, 0);
  };

  return {
    form,
    services,
    clients,
    vehicles,
    mechanics,
    isLoading,
    calculateTotalCost,
  };
};
