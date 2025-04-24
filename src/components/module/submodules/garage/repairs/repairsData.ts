
// Mock data for garage repairs
export const clientsMap = {
  'client-1': { id: 'client-1', firstName: 'Jean', lastName: 'Dupont', email: 'jean.dupont@example.com' },
  'client-2': { id: 'client-2', firstName: 'Marie', lastName: 'Martin', email: 'marie.martin@example.com' },
  'client-3': { id: 'client-3', firstName: 'Pierre', lastName: 'Bernard', email: 'pierre.bernard@example.com' },
  'client-4': { id: 'client-4', firstName: 'Sophie', lastName: 'Dubois', email: 'sophie.dubois@example.com' },
  'client-5': { id: 'client-5', firstName: 'Thomas', lastName: 'Rousseau', email: 'thomas.rousseau@example.com' },
};

export const vehiclesMap = {
  'vehicle-1': { id: 'vehicle-1', make: 'Renault', model: 'Clio', year: 2018, licensePlate: 'AB-123-CD', clientId: 'client-1' },
  'vehicle-2': { id: 'vehicle-2', make: 'Peugeot', model: '208', year: 2019, licensePlate: 'EF-456-GH', clientId: 'client-2' },
  'vehicle-3': { id: 'vehicle-3', make: 'Citroen', model: 'C3', year: 2020, licensePlate: 'IJ-789-KL', clientId: 'client-3' },
  'vehicle-4': { id: 'vehicle-4', make: 'Volkswagen', model: 'Golf', year: 2017, licensePlate: 'MN-012-OP', clientId: 'client-4' },
  'vehicle-5': { id: 'vehicle-5', make: 'Toyota', model: 'Yaris', year: 2021, licensePlate: 'QR-345-ST', clientId: 'client-5' },
};

export const mechanicsMap = {
  'mechanic-1': { id: 'mechanic-1', firstName: 'Lucas', lastName: 'Fournier', specialties: ['Engine', 'Electrical'] },
  'mechanic-2': { id: 'mechanic-2', firstName: 'Emma', lastName: 'Girard', specialties: ['Brakes', 'Suspension'] },
  'mechanic-3': { id: 'mechanic-3', firstName: 'Hugo', lastName: 'Lambert', specialties: ['Transmission', 'Diagnostics'] },
};
