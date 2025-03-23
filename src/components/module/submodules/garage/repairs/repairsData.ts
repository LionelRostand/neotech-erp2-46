
// Données pour les réparations
export const repairs = [
  {
    id: "RP001",
    vehicleId: "VH003",
    vehicleName: "Citroen C3",
    clientId: "CL002",
    clientName: "Marie Lambert",
    mechanicId: "MECH001",
    mechanicName: "Thomas Dubois",
    startDate: "2023-10-18",
    estimatedEndDate: "2023-10-20",
    status: "in_progress",
    description: "Diagnostic système démarrage + réparation",
    progress: 60,
    estimatedCost: 320.45,
    licensePlate: "IJ-789-KL",
    notes: "Client a signalé des difficultés au démarrage par temps froid",
    actualCost: null
  },
  {
    id: "RP002",
    vehicleId: "VH007",
    vehicleName: "Volkswagen Golf",
    clientId: "CL004",
    clientName: "Sophie Bernard",
    mechanicId: "MECH002",
    mechanicName: "Jean Martin",
    startDate: "2023-10-15",
    estimatedEndDate: "2023-10-17",
    status: "awaiting_parts",
    description: "Remplacement système d'embrayage",
    progress: 25,
    estimatedCost: 580.00,
    licensePlate: "UV-678-WX",
    notes: "En attente de la pièce de rechange principale",
    actualCost: null
  },
  {
    id: "RP003",
    vehicleId: "VH005",
    vehicleName: "Mercedes Sprinter",
    clientId: "CL003",
    clientName: "Pierre Martin",
    mechanicId: "MECH003",
    mechanicName: "Thomas Dubois",
    startDate: "2023-10-16",
    estimatedEndDate: "2023-10-19",
    status: "awaiting_approval",
    description: "Remplacement injecteurs diesel",
    progress: 0,
    estimatedCost: 950.75,
    licensePlate: "QR-345-ST",
    notes: "Devis envoyé au client, en attente de validation",
    actualCost: null
  },
  {
    id: "RP004",
    vehicleId: "VH002",
    vehicleName: "Peugeot 308",
    clientId: "CL001",
    clientName: "Jean Dupont",
    mechanicId: "MECH001",
    mechanicName: "Jean Martin",
    startDate: "2023-10-10",
    estimatedEndDate: "2023-10-11",
    status: "completed",
    description: "Vidange + contrôle niveaux",
    progress: 100,
    estimatedCost: 145.30,
    licensePlate: "EF-456-GH",
    notes: "Entretien standard effectué sans problème particulier",
    actualCost: 145.30
  },
  {
    id: "RP005",
    vehicleId: "VH008",
    vehicleName: "Toyota Yaris",
    clientId: "CL005",
    clientName: "Thomas Leclerc",
    mechanicId: "MECH002",
    mechanicName: "Thomas Dubois",
    startDate: "2023-10-12",
    estimatedEndDate: "2023-10-14",
    status: "completed",
    description: "Remplacement plaquettes et disques de frein",
    progress: 100,
    estimatedCost: 390.50,
    licensePlate: "YZ-901-AB",
    notes: "Usure importante des disques, remplacement complet effectué",
    actualCost: 405.75
  }
];

// Ajoutons une interface pour les réparations
export interface Repair {
  id: string;
  vehicleId: string;
  vehicleName: string;
  clientId: string;
  clientName: string;
  mechanicId: string;
  mechanicName: string;
  startDate: string;
  estimatedEndDate: string;
  status: "in_progress" | "awaiting_parts" | "awaiting_approval" | "completed" | "cancelled";
  description: string;
  progress: number;
  estimatedCost: number;
  licensePlate: string;
  notes?: string; // Added as optional property
  actualCost?: number | null; // Added as optional property
}
