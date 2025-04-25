
import { useState, useEffect, useMemo } from 'react';
import { useFirestore } from '@/hooks/useFirestore';
import { COLLECTIONS } from '@/lib/firebase-collections';

export const useGarageAppointments = (searchTerm: string = '') => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [mechanics, setMechanics] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { getAll: getAppointments } = useFirestore('garage_appointments');
  const { getAll: getClients } = useFirestore('garage_clients');
  const { getAll: getVehicles } = useFirestore('garage_vehicles');
  const { getAll: getMechanics } = useFirestore('garage_mechanics');
  const { getAll: getServices } = useFirestore('garage_services');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [appointmentsData, clientsData, vehiclesData, mechanicsData, servicesData] = await Promise.all([
        getAppointments(),
        getClients(),
        getVehicles(),
        getMechanics(),
        getServices()
      ]);

      setAppointments(appointmentsData || []);
      setClients(clientsData || []);
      setVehicles(vehiclesData || []);
      setMechanics(mechanicsData || []);
      setServices(servicesData || []);
    } catch (err) {
      console.error("Error fetching garage appointments data:", err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredAppointments = useMemo(() => {
    if (!searchTerm.trim()) return appointments;
    
    const term = searchTerm.toLowerCase();
    return appointments.filter(appointment => {
      const clientName = getClientName(appointment.clientId).toLowerCase();
      const vehicleInfo = getVehicleInfo(appointment.vehicleId).toLowerCase();
      const mechanicName = getMechanicName(appointment.mechanicId).toLowerCase();
      
      return clientName.includes(term) || 
        vehicleInfo.includes(term) || 
        mechanicName.includes(term) ||
        (appointment.date && appointment.date.toLowerCase().includes(term));
    });
  }, [appointments, searchTerm]);

  const getClientName = (clientId: string) => {
    if (!clientId) return 'Client inconnu';
    const client = clients.find(c => c.id === clientId);
    if (!client) return `Client #${clientId}`;
    return `${client.firstName || ''} ${client.lastName || ''}`.trim() || `Client #${clientId}`;
  };

  const getVehicleInfo = (vehicleId: string) => {
    if (!vehicleId) return 'Véhicule inconnu';
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (!vehicle) return `Véhicule #${vehicleId}`;
    return `${vehicle.make || ''} ${vehicle.model || ''} ${vehicle.year || ''}`.trim() || `Véhicule #${vehicleId}`;
  };
  
  const getMechanicName = (mechanicId: string) => {
    if (!mechanicId) return 'Mécanicien inconnu';
    const mechanic = mechanics.find(m => m.id === mechanicId);
    if (!mechanic) return `Mécanicien #${mechanicId}`;
    return `${mechanic.firstName || ''} ${mechanic.lastName || ''}`.trim() || `Mécanicien #${mechanicId}`;
  };
  
  const getServiceName = (serviceId: string) => {
    if (!serviceId) return 'Service inconnu';
    const service = services.find(s => s.id === serviceId);
    if (!service) return `Service #${serviceId}`;
    return service.name || `Service #${serviceId}`;
  };

  return {
    appointments,
    filteredAppointments,
    clients,
    vehicles,
    mechanics,
    services,
    isLoading,
    error,
    getClientName,
    getVehicleInfo,
    getMechanicName,
    getServiceName,
    refetch: fetchData
  };
};
