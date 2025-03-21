
// Mock data for seasonal trends
export const getSeasonalTrends = () => [
  { month: 'Jan', reservations: 120, actual: 118, forecast: 120 },
  { month: 'Fév', reservations: 140, actual: 142, forecast: 140 },
  { month: 'Mar', reservations: 180, actual: 176, forecast: 180 },
  { month: 'Avr', reservations: 220, actual: 214, forecast: 220 },
  { month: 'Mai', reservations: 260, actual: 258, forecast: 260 },
  { month: 'Juin', reservations: 320, actual: 324, forecast: 320 },
  { month: 'Juil', reservations: 380, actual: 386, forecast: 380 },
  { month: 'Août', reservations: 400, actual: 405, forecast: 400 },
  { month: 'Sep', reservations: 300, actual: 289, forecast: 300 },
  { month: 'Oct', reservations: 240, actual: 235, forecast: 240 },
  { month: 'Nov', reservations: 180, actual: 175, forecast: 180 },
  { month: 'Déc', reservations: 220, actual: 204, forecast: 220 },
];

// Mock data for revenue forecast
export const getRevenueForecast = () => [
  { month: 'Jan', actual: 25800, forecast: 25800 },
  { month: 'Fév', actual: 28200, forecast: 28200 },
  { month: 'Mar', actual: 38400, forecast: 38400 },
  { month: 'Avr', actual: 42600, forecast: 42600 },
  { month: 'Mai', actual: 53800, forecast: 53800 },
  { month: 'Juin', actual: 68500, forecast: 68500 },
  { month: 'Juil', actual: 82600, forecast: 82600 },
  { month: 'Août', actual: 85200, forecast: 85200 },
  { month: 'Sep', actual: 65400, forecast: 64000 },
  { month: 'Oct', actual: 0, forecast: 52000 },
  { month: 'Nov', actual: 0, forecast: 38000 },
  { month: 'Déc', actual: 0, forecast: 46000 },
];

// Mock data for tourism impact
export const getTourismImpact = () => [
  { name: 'Vacances scolaires', impact: 35 },
  { name: 'Festivals locaux', impact: 15 },
  { name: 'Tourisme d\'affaires', impact: 25 },
  { name: 'Événements sportifs', impact: 10 },
  { name: 'Tourisme saisonnier', impact: 15 },
];
