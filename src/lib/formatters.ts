
/**
 * Formatte une date au format français (JJ/MM/AAAA)
 * @param dateStr Chaîne de date à formater
 * @returns Date formatée
 */
export function formatDate(dateStr: string | Date): string {
  try {
    const date = typeof dateStr === 'string' ? new Date(dateStr) : dateStr;
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Erreur de formatage de date:', dateStr, error);
    return typeof dateStr === 'string' ? dateStr : String(dateStr);
  }
}

/**
 * Formatte un nombre en devise (EUR par défaut)
 * @param amount Montant à formater
 * @param currency Code de devise (EUR par défaut)
 * @returns Montant formaté
 */
export function formatCurrency(amount: number, currency: string = 'EUR'): string {
  try {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency
    }).format(amount);
  } catch (error) {
    console.error('Erreur de formatage de devise:', amount, error);
    return `${amount} ${currency}`;
  }
}

/**
 * Formatte un nombre avec des séparateurs de milliers
 * @param num Nombre à formater
 * @returns Nombre formaté
 */
export function formatNumber(num: number): string {
  try {
    return new Intl.NumberFormat('fr-FR').format(num);
  } catch (error) {
    console.error('Erreur de formatage de nombre:', num, error);
    return String(num);
  }
}
