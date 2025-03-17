
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Truck, 
  Briefcase,
  BookOpen,
  Settings,
  FileText,
  Calendar,
  Clock,
  BarChart,
  Mail,
  Search,
  AlertTriangle,
  Container,
  Ship,
  MapPin,
  DollarSign,
  ClipboardCheck,
  User,
  CheckSquare,
  List,
  UsersRound,
  PieChart,
  LibraryBig,
  GraduationCap,
  ScrollText,
  Award,
  Store,
  Coffee,
  LayoutPanelLeft,
  ShoppingCart,
  CreditCard,
  Utensils,
  UserCircle,
  Ticket,
  Globe,
  Car,
  CalendarCheck,
  Wrench,
  Receipt,
  Package,
  BadgePercent,
  Taxi,
  Route,
  Map,
  HeadphonesIcon,
  Heart,
  Stethoscope,
  Pill,
  Activity,
  Calculator,
  ReceiptText,
  Percent,
  ShoppingBag,
  Boxes,
  Truck as DeliveryTruck,
  LineChart
} from 'lucide-react';

export interface AppModule {
  id: number;
  name: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  submodules?: SubModule[];
}

export interface SubModule {
  id: string;
  name: string;
  href: string;
  icon: React.ReactNode;
}

// Create icon elements as functions to avoid JSX syntax in .ts file
const createIcon = (Icon: any) => React.createElement(Icon, { size: 24 });

// Modules array with the requested modules
export const modules: AppModule[] = [
  {
    id: 1,
    name: "Employés",
    description: "Gestion des ressources humaines, contrats, congés et administration du personnel",
    href: "/modules/employees",
    icon: createIcon(Users),
    submodules: [
      { id: "employees-dashboard", name: "Tableau de bord", href: "/modules/employees/dashboard", icon: createIcon(LayoutDashboard) },
      { id: "employees-management", name: "Gestion", href: "/modules/employees/management", icon: createIcon(Users) },
      { id: "employees-contracts", name: "Contrats", href: "/modules/employees/contracts", icon: createIcon(FileText) },
      { id: "employees-leaves", name: "Congés", href: "/modules/employees/leaves", icon: createIcon(Calendar) },
      { id: "employees-attendance", name: "Présences", href: "/modules/employees/attendance", icon: createIcon(Clock) },
      { id: "employees-timesheet", name: "CRA", href: "/modules/employees/timesheet", icon: createIcon(ClipboardCheck) },
      { id: "employees-recruitment", name: "Recrutement", href: "/modules/employees/recruitment", icon: createIcon(User) },
      { id: "employees-performance", name: "Performance", href: "/modules/employees/performance", icon: createIcon(BarChart) },
      { id: "employees-salaries", name: "Salaires", href: "/modules/employees/salaries", icon: createIcon(DollarSign) },
      { id: "employees-reports", name: "Rapports", href: "/modules/employees/reports", icon: createIcon(PieChart) },
      { id: "employees-settings", name: "Paramètres", href: "/modules/employees/settings", icon: createIcon(Settings) }
    ]
  },
  {
    id: 2,
    name: "Freight Management",
    description: "Gestion logistique, expéditions, suivi des conteneurs et transport de marchandises",
    href: "/modules/freight",
    icon: createIcon(Truck),
    submodules: [
      { id: "freight-dashboard", name: "Tableau de bord", href: "/modules/freight/dashboard", icon: createIcon(LayoutDashboard) },
      { id: "freight-shipments", name: "Expéditions", href: "/modules/freight/shipments", icon: createIcon(Ship) },
      { id: "freight-containers", name: "Conteneurs", href: "/modules/freight/containers", icon: createIcon(Container) },
      { id: "freight-carriers", name: "Transporteurs", href: "/modules/freight/carriers", icon: createIcon(Truck) },
      { id: "freight-tracking", name: "Suivi", href: "/modules/freight/tracking", icon: createIcon(MapPin) },
      { id: "freight-pricing", name: "Tarification", href: "/modules/freight/pricing", icon: createIcon(DollarSign) },
      { id: "freight-documents", name: "Documents", href: "/modules/freight/documents", icon: createIcon(FileText) },
      { id: "freight-client-portal", name: "Portail client", href: "/modules/freight/client-portal", icon: createIcon(Users) },
      { id: "freight-settings", name: "Paramètres", href: "/modules/freight/settings", icon: createIcon(Settings) }
    ]
  },
  {
    id: 3,
    name: "Projets",
    description: "Gestion de projets, tâches, équipes et coordination des activités",
    href: "/modules/projects",
    icon: createIcon(Briefcase),
    submodules: [
      { id: "projects-list", name: "Projets", href: "/modules/projects/list", icon: createIcon(Briefcase) },
      { id: "projects-tasks", name: "Tâches", href: "/modules/projects/tasks", icon: createIcon(CheckSquare) },
      { id: "projects-teams", name: "Équipes", href: "/modules/projects/teams", icon: createIcon(UsersRound) },
      { id: "projects-reports", name: "Rapports", href: "/modules/projects/reports", icon: createIcon(BarChart) },
      { id: "projects-settings", name: "Paramètres", href: "/modules/projects/settings", icon: createIcon(Settings) }
    ]
  },
  {
    id: 4,
    name: "Académie",
    description: "Gestion des inscriptions, cours, examens et suivi pédagogique",
    href: "/modules/academy",
    icon: createIcon(BookOpen),
    submodules: [
      { id: "academy-registrations", name: "Inscriptions", href: "/modules/academy/registrations", icon: createIcon(ClipboardCheck) },
      { id: "academy-courses", name: "Cours", href: "/modules/academy/courses", icon: createIcon(LibraryBig) },
      { id: "academy-exams", name: "Examens", href: "/modules/academy/exams", icon: createIcon(ScrollText) },
      { id: "academy-grades", name: "Notes", href: "/modules/academy/grades", icon: createIcon(Award) },
      { id: "academy-reports", name: "Bulletins", href: "/modules/academy/reports", icon: createIcon(FileText) },
      { id: "academy-teachers", name: "Enseignants", href: "/modules/academy/teachers", icon: createIcon(GraduationCap) },
      { id: "academy-settings", name: "Paramètres", href: "/modules/academy/settings", icon: createIcon(Settings) }
    ]
  },
  {
    id: 5,
    name: "Restaurant POS",
    description: "Système de point de vente et gestion complète pour restaurants",
    href: "/modules/restaurant",
    icon: createIcon(Store),
    submodules: [
      { id: "restaurant-pos", name: "Point de Vente", href: "/modules/restaurant/pos", icon: createIcon(CreditCard) },
      { id: "restaurant-list", name: "Restaurants", href: "/modules/restaurant/list", icon: createIcon(Coffee) },
      { id: "restaurant-layout", name: "Plan de Salle", href: "/modules/restaurant/layout", icon: createIcon(LayoutPanelLeft) },
      { id: "restaurant-orders", name: "Commandes", href: "/modules/restaurant/orders", icon: createIcon(ShoppingCart) },
      { id: "restaurant-payments", name: "Paiements", href: "/modules/restaurant/payments", icon: createIcon(CreditCard) },
      { id: "restaurant-kitchen", name: "Écran Cuisine", href: "/modules/restaurant/kitchen", icon: createIcon(Utensils) },
      { id: "restaurant-clients", name: "Clients", href: "/modules/restaurant/clients", icon: createIcon(UserCircle) },
      { id: "restaurant-reservations", name: "Réservations", href: "/modules/restaurant/reservations", icon: createIcon(Calendar) },
      { id: "restaurant-tickets", name: "Tickets", href: "/modules/restaurant/tickets", icon: createIcon(Ticket) },
      { id: "restaurant-web-reservations", name: "Réservations Web", href: "/modules/restaurant/web-reservations", icon: createIcon(Globe) },
      { id: "restaurant-settings", name: "Paramètres", href: "/modules/restaurant/settings", icon: createIcon(Settings) }
    ]
  },
  {
    id: 6,
    name: "Garage Auto",
    description: "Gestion complète pour ateliers de réparation et services automobiles",
    href: "/modules/garage",
    icon: createIcon(Car),
    submodules: [
      { id: "garage-dashboard", name: "Tableau de bord", href: "/modules/garage/dashboard", icon: createIcon(LayoutDashboard) },
      { id: "garage-clients", name: "Clients", href: "/modules/garage/clients", icon: createIcon(Users) },
      { id: "garage-vehicles", name: "Véhicules", href: "/modules/garage/vehicles", icon: createIcon(Car) },
      { id: "garage-appointments", name: "Rendez-vous", href: "/modules/garage/appointments", icon: createIcon(CalendarCheck) },
      { id: "garage-repairs", name: "Réparations", href: "/modules/garage/repairs", icon: createIcon(Wrench) },
      { id: "garage-invoices", name: "Factures", href: "/modules/garage/invoices", icon: createIcon(Receipt) },
      { id: "garage-suppliers", name: "Fournisseurs", href: "/modules/garage/suppliers", icon: createIcon(Truck) },
      { id: "garage-inventory", name: "Inventaire", href: "/modules/garage/inventory", icon: createIcon(Package) },
      { id: "garage-loyalty", name: "Programme de fidélité", href: "/modules/garage/loyalty", icon: createIcon(BadgePercent) },
      { id: "garage-settings", name: "Paramètres", href: "/modules/garage/settings", icon: createIcon(Settings) }
    ]
  },
  {
    id: 7,
    name: "Transport",
    description: "Gestion des chauffeurs, réservations et planification des transports",
    href: "/modules/transport",
    icon: createIcon(Taxi),
    submodules: [
      { id: "transport-reservations", name: "Réservations", href: "/modules/transport/reservations", icon: createIcon(CalendarCheck) },
      { id: "transport-planning", name: "Planning", href: "/modules/transport/planning", icon: createIcon(Calendar) },
      { id: "transport-fleet", name: "Flotte", href: "/modules/transport/fleet", icon: createIcon(Car) },
      { id: "transport-drivers", name: "Chauffeurs", href: "/modules/transport/drivers", icon: createIcon(Users) },
      { id: "transport-geolocation", name: "Géolocalisation", href: "/modules/transport/geolocation", icon: createIcon(MapPin) },
      { id: "transport-payments", name: "Paiements", href: "/modules/transport/payments", icon: createIcon(CreditCard) },
      { id: "transport-customer-service", name: "Service Client", href: "/modules/transport/customer-service", icon: createIcon(Mail) },
      { id: "transport-loyalty", name: "Fidélité", href: "/modules/transport/loyalty", icon: createIcon(Heart) },
      { id: "transport-web-booking", name: "Réservation Web", href: "/modules/transport/web-booking", icon: createIcon(Globe) },
      { id: "transport-settings", name: "Paramètres", href: "/modules/transport/settings", icon: createIcon(Settings) }
    ]
  },
  {
    id: 8,
    name: "Health",
    description: "Gestion des patients, rendez-vous et suivi médical",
    href: "/modules/health",
    icon: createIcon(Stethoscope),
    submodules: [
      { id: "health-dashboard", name: "Dashboard", href: "/modules/health/dashboard", icon: createIcon(LayoutDashboard) },
      { id: "health-appointments", name: "Rendez-vous", href: "/modules/health/appointments", icon: createIcon(Calendar) },
      { id: "health-patients", name: "Patients", href: "/modules/health/patients", icon: createIcon(Users) },
      { id: "health-pharmacy", name: "Pharmacie", href: "/modules/health/pharmacy", icon: createIcon(Pill) },
      { id: "health-stats", name: "Statistiques", href: "/modules/health/stats", icon: createIcon(Activity) },
      { id: "health-settings", name: "Paramètres", href: "/modules/health/settings", icon: createIcon(Settings) }
    ]
  },
  {
    id: 9,
    name: "Comptabilité",
    description: "Gestion financière, facturation et suivi des taxes",
    href: "/modules/accounting",
    icon: createIcon(Calculator),
    submodules: [
      { id: "accounting-invoices", name: "Factures", href: "/modules/accounting/invoices", icon: createIcon(ReceiptText) },
      { id: "accounting-payments", name: "Paiements", href: "/modules/accounting/payments", icon: createIcon(CreditCard) },
      { id: "accounting-taxes", name: "Taxes & TVA", href: "/modules/accounting/taxes", icon: createIcon(Percent) },
      { id: "accounting-reports", name: "Rapports", href: "/modules/accounting/reports", icon: createIcon(FileText) },
      { id: "accounting-settings", name: "Paramètres", href: "/modules/accounting/settings", icon: createIcon(Settings) }
    ]
  },
  {
    id: 10,
    name: "E-Commerce",
    description: "Gestion de boutique en ligne, produits et commandes",
    href: "/modules/ecommerce",
    icon: createIcon(ShoppingBag),
    submodules: [
      { id: "ecommerce-products", name: "Produits", href: "/modules/ecommerce/products", icon: createIcon(Package) },
      { id: "ecommerce-orders", name: "Commandes", href: "/modules/ecommerce/orders", icon: createIcon(ShoppingCart) },
      { id: "ecommerce-payments", name: "Paiements", href: "/modules/ecommerce/payments", icon: createIcon(CreditCard) },
      { id: "ecommerce-shipping", name: "Livraison", href: "/modules/ecommerce/shipping", icon: createIcon(DeliveryTruck) },
      { id: "ecommerce-stats", name: "Statistiques", href: "/modules/ecommerce/stats", icon: createIcon(LineChart) },
      { id: "ecommerce-shop", name: "Boutique", href: "/modules/ecommerce/shop", icon: createIcon(Store) },
      { id: "ecommerce-settings", name: "Paramètres", href: "/modules/ecommerce/settings", icon: createIcon(Settings) }
    ]
  }
];
