
export type AttendanceStatus = "Présent" | "Absent" | "Retard" | "Congé";
export type ValidationStatus = "En attente" | "Validé" | "Rejeté";

export interface EmployeeAttendance {
  id: string;
  employeeName: string;
  date: string;
  arrivalTime: string;
  departureTime: string;
  hoursWorked: number;
  status: AttendanceStatus;
  validation: ValidationStatus;
}
