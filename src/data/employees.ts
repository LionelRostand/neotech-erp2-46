
import { Employee, EmployeeAddress, Education, Document } from '@/types/employee';

// Données simulées d'employés
export const employees: Employee[] = [
  {
    id: "EMP001",
    firstName: "Martin",
    lastName: "Dupont",
    email: "martin.dupont@example.com",
    phone: "+33 6 12 34 56 78",
    address: {
      street: "15 Rue des Lilas",
      city: "Paris",
      postalCode: "75011",
      country: "France"
    } as EmployeeAddress,
    department: "Marketing",
    departmentId: "MKT",
    position: "Chef de Projet Digital",
    hireDate: "15/03/2021",
    startDate: "15/03/2021",
    status: "active",
    contract: "CDI",
    manager: "Sophie Martin",
    managerId: "EMP003",
    education: [
      { degree: "Master Marketing Digital", school: "HEC Paris", year: "2018" },
      { degree: "Licence Communication", school: "Université Paris-Sorbonne", year: "2016" }
    ] as Education[],
    skills: ["Marketing digital", "Gestion de projet", "SEO/SEA", "Adobe Creative Suite", "Analyse de données"],
    documents: [
      { name: "Contrat de travail", date: "15/03/2021", type: "Contrat" },
      { name: "Avenant salaire", date: "10/06/2022", type: "Avenant" },
      { name: "Attestation formation", date: "22/09/2022", type: "Formation" }
    ] as Document[],
    workSchedule: {
      monday: "09:00 - 18:00",
      tuesday: "09:00 - 18:00",
      wednesday: "09:00 - 18:00",
      thursday: "09:00 - 18:00",
      friday: "09:00 - 17:00",
    },
    payslips: ["PS001", "PS002"],
    photo: "",
    photoURL: "",
    title: "Chef de Projet Digital",
    role: "Employé",
    professionalEmail: "martin.dupont@example.com",
    company: "",
    socialSecurityNumber: "1 99 99 99 999 999 99",
    birthDate: "01/01/1990"
  },
  
  {
    id: "EMP002",
    firstName: "Lionel",
    lastName: "Djossa",
    email: "lionel.djossa@example.com",
    phone: "+33 6 98 76 54 32",
    address: {
      street: "8 Avenue Victor Hugo",
      city: "Paris",
      postalCode: "75016",
      country: "France"
    } as EmployeeAddress,
    department: "Direction",
    departmentId: "DIR",
    position: "PDG",
    hireDate: "27/03/2025",
    startDate: "27/03/2025",
    status: "active",
    contract: "CDI",
    manager: "",
    managerId: "",
    education: [
      { degree: "MBA Management", school: "INSEAD", year: "2015" },
      { degree: "Master Finance", school: "HEC Paris", year: "2013" }
    ] as Education[],
    skills: ["Leadership", "Stratégie", "Finance", "Management", "Négociation"],
    documents: [
      { name: "Contrat de travail", date: "27/03/2025", type: "Contrat" }
    ] as Document[],
    workSchedule: {
      monday: "08:30 - 19:00",
      tuesday: "08:30 - 19:00",
      wednesday: "08:30 - 19:00",
      thursday: "08:30 - 19:00",
      friday: "08:30 - 18:00",
    },
    payslips: ["PS003"],
    photo: "",
    photoURL: "",
    title: "PDG",
    role: "Directeur",
    professionalEmail: "lionel.djossa@example.com",
    company: "",
    socialSecurityNumber: "1 99 99 99 999 999 99",
    birthDate: "01/01/1980"
  },
  
  {
    id: "EMP003",
    firstName: "Sophie",
    lastName: "Martin",
    email: "sophie.martin@example.com",
    phone: "+33 6 45 67 89 01",
    address: {
      street: "25 Rue du Commerce",
      city: "Paris",
      postalCode: "75015",
      country: "France"
    } as EmployeeAddress,
    department: "Marketing",
    departmentId: "MKT",
    position: "Directrice Marketing",
    hireDate: "05/01/2020",
    startDate: "05/01/2020",
    status: "active",
    contract: "CDI",
    manager: "Lionel Djossa",
    managerId: "EMP002",
    education: [
      { degree: "Master Marketing", school: "ESSEC", year: "2012" }
    ] as Education[],
    skills: ["Stratégie marketing", "Management d'équipe", "Budgétisation", "Communication"],
    documents: [
      { name: "Contrat de travail", date: "05/01/2020", type: "Contrat" },
      { name: "Avenant promotion", date: "15/12/2021", type: "Avenant" }
    ] as Document[],
    workSchedule: {
      monday: "09:00 - 18:00",
      tuesday: "09:00 - 18:00",
      wednesday: "09:00 - 18:00",
      thursday: "09:00 - 18:00",
      friday: "09:00 - 17:00",
    },
    payslips: ["PS004", "PS005"],
    photo: "",
    photoURL: "",
    title: "Directrice Marketing",
    role: "Manager",
    professionalEmail: "sophie.martin@example.com",
    company: "",
    socialSecurityNumber: "1 99 99 99 999 999 99",
    birthDate: "01/01/1985"
  }
];
