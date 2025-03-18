
export interface EmployeeAttendance {
  id: string;
  employeeName: string;
  date: string;
  startTime: string;
  endTime: string;
  hoursWorked: number;
  status: 'Présent' | 'Absent' | 'Retard';
  validated: boolean | null;
}

export interface AttendanceFilter {
  search: string;
}
