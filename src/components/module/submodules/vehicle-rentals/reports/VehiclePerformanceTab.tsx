
import React from 'react';
import PerformanceStatCards from './performance/PerformanceStatCards';
import UtilizationRateChart from './performance/UtilizationRateChart';
import MaintenanceDistributionChart from './performance/MaintenanceDistributionChart';
import MostRentedVehiclesTable from './performance/MostRentedVehiclesTable';
import { 
  getUtilizationData, 
  getMaintenanceData, 
  getSatisfactionData, 
  getMostRentedVehicles 
} from './performance/mockData';

interface VehiclePerformanceTabProps {
  timeRange: string;
}

const VehiclePerformanceTab: React.FC<VehiclePerformanceTabProps> = ({ timeRange }) => {
  // Load mock data
  const utilizationData = getUtilizationData();
  const maintenanceData = getMaintenanceData();
  const satisfactionData = getSatisfactionData();
  const mostRentedVehicles = getMostRentedVehicles();
  
  // Calculate summary metrics
  const avgUtilizationRate = Math.round(
    utilizationData.reduce((sum, item) => sum + item.utilisationRate, 0) / utilizationData.length
  );
  const maintenanceEvents = maintenanceData.reduce((sum, item) => sum + item.value, 0);
  const avgSatisfaction = 4.5; // Mock value
  
  return (
    <div className="space-y-6">
      <PerformanceStatCards 
        avgUtilizationRate={avgUtilizationRate}
        maintenanceEvents={maintenanceEvents}
        avgSatisfaction={avgSatisfaction}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <UtilizationRateChart data={utilizationData} />
        <MaintenanceDistributionChart data={maintenanceData} />
      </div>

      <MostRentedVehiclesTable data={mostRentedVehicles} />
    </div>
  );
};

export default VehiclePerformanceTab;
