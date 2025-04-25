
import { useGarageData } from './useGarageData';

export const useVehicleClientMapping = () => {
  const { vehicles, clients } = useGarageData();

  const getClientForVehicle = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (vehicle?.clientId) {
      const client = clients.find(c => c.id === vehicle.clientId);
      return client?.id || '';
    }
    return '';
  };

  return { getClientForVehicle };
};
