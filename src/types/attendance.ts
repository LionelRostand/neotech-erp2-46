
export type AttendanceStatus = "Présent" | "Absent" | "Retard" | "Congé";
export type ValidationStatus = "En attente" | "Validé" | "Rejeté";

export interface EmployeeAttendance {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  arrivalTime: string;
  departureTime: string | null;
  hoursWorked: string;
  status: AttendanceStatus;
  validation: ValidationStatus;
}
