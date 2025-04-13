
/**
 * Génère les initiales à partir du nom et prénom d'un employé
 * @param firstName Prénom de l'employé
 * @param lastName Nom de l'employé
 * @returns Initiales (2 caractères maximum)
 */
export const getEmployeeInitials = (firstName: string = '', lastName: string = ''): string => {
  if (firstName && lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  } else if (firstName) {
    return firstName.substring(0, 2).toUpperCase();
  } else if (lastName) {
    return lastName.substring(0, 2).toUpperCase();
  }
  return 'NN'; // Non Nommé
};

/**
 * Génère un nom d'affichage formaté pour un employé
 * @param firstName Prénom de l'employé
 * @param lastName Nom de l'employé
 * @returns Nom formaté (Prénom Nom)
 */
export const getEmployeeDisplayName = (firstName: string = '', lastName: string = ''): string => {
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  } else if (firstName) {
    return firstName;
  } else if (lastName) {
    return lastName;
  }
  return 'Employé sans nom';
};
