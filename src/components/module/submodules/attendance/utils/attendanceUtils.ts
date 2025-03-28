
/**
 * Calcule le nombre d'heures travaillées entre l'heure d'arrivée et l'heure de départ
 * Format d'entrée : "HH:MM" (format 24h)
 * Format de sortie : "Xh" ou "XhYY" (heures et minutes)
 */
export const calculateHoursWorked = (arrivalTime: string, departureTime: string): string => {
  // Convertir les heures en minutes depuis minuit
  const convertTimeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };
  
  const arrivalMinutes = convertTimeToMinutes(arrivalTime);
  const departureMinutes = convertTimeToMinutes(departureTime);
  
  // Calculer la différence en minutes
  let minutesDifference = departureMinutes - arrivalMinutes;
  
  // Si la sortie est le lendemain (après minuit)
  if (minutesDifference < 0) {
    minutesDifference = 24 * 60 + minutesDifference;
  }
  
  // Convertir en heures et minutes
  const hours = Math.floor(minutesDifference / 60);
  const minutes = minutesDifference % 60;
  
  // Formater le résultat
  return minutes > 0 ? `${hours}h${minutes.toString().padStart(2, '0')}` : `${hours}h`;
};

/**
 * Convertit les heures travaillées au format "XhYY" en nombre décimal
 * Par exemple: "8h30" -> 8.5
 */
export const hoursToDecimal = (hoursString: string): number => {
  if (!hoursString) return 0;
  
  // Format attendu: "5h30" ou "5h"
  const match = hoursString.match(/(\d+)h(\d+)?/);
  if (match) {
    const hours = parseInt(match[1]);
    const minutes = match[2] ? parseInt(match[2]) : 0;
    return hours + minutes / 60;
  }
  
  return 0;
};

/**
 * Calcule le total d'heures travaillées sur une période
 */
export const calculateTotalHours = (attendances: { hoursWorked: string }[]): string => {
  const totalDecimalHours = attendances.reduce((total, entry) => {
    return total + hoursToDecimal(entry.hoursWorked || "0h");
  }, 0);
  
  const totalHours = Math.floor(totalDecimalHours);
  const totalMinutes = Math.round((totalDecimalHours - totalHours) * 60);
  
  return totalMinutes > 0 
    ? `${totalHours}h${totalMinutes.toString().padStart(2, '0')}`
    : `${totalHours}h`;
};
