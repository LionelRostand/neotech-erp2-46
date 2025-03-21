
import React from 'react';
import StatCards from './trends/StatCards';
import SeasonalTrendsChart from './trends/SeasonalTrendsChart';
import RevenueForecastChart from './trends/RevenueForecastChart';
import TourismImpactChart from './trends/TourismImpactChart';
import { getSeasonalTrends, getRevenueForecast, getTourismImpact } from './trends/mockData';

interface TrendsAndForecastTabProps {
  timeRange: string;
}

const TrendsAndForecastTab: React.FC<TrendsAndForecastTabProps> = ({ timeRange }) => {
  // Load mock data
  const seasonalTrends = getSeasonalTrends();
  const revenueForecast = getRevenueForecast();
  const tourismImpact = getTourismImpact();
  
  // Calculate year-to-date metrics
  const annualGrowthRate = 18; // Percentage
  const predictedYearTotal = revenueForecast.reduce((sum, item) => sum + item.forecast, 0);
  const peakSeason = "Juillet-Août";
  
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <StatCards 
        annualGrowthRate={annualGrowthRate}
        predictedYearTotal={predictedYearTotal}
        peakSeason={peakSeason}
      />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SeasonalTrendsChart data={seasonalTrends} />
        <RevenueForecastChart data={revenueForecast} />
      </div>

      {/* Tourism Impact Chart */}
      <TourismImpactChart data={tourismImpact} />
    </div>
  );
};

export default TrendsAndForecastTab;
