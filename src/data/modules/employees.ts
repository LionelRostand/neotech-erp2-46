
import { Users, LayoutDashboard, FileText, Calendar, Clock, ClipboardCheck, User, BarChart, DollarSign, PieChart, Settings } from 'lucide-react';
import { AppModule, createIcon } from '../types/modules';

export const employeesModule: AppModule = {
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
};
