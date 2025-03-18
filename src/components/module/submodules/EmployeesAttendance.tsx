
import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import AttendanceTable from './attendance/AttendanceTable';
import AttendanceSearch from './attendance/AttendanceSearch';
import { EmployeeAttendance, AttendanceFilter } from '@/types/attendance';

// Mock data for the attendance records
const initialAttendanceData: EmployeeAttendance[] = [
  {
    id: '1',
    employeeName: 'LIONEL DJOSSA',
    date: '2025-03-18',
    startTime: '09:00',
    endTime: '18:00',
    hoursWorked: 8,
    status: 'Présent',
    validated: null
  },
  // We can add more mock data later as needed
];

const EmployeesAttendance: React.FC = () => {
  const [attendanceData, setAttendanceData] = useState<EmployeeAttendance[]>(initialAttendanceData);
  const [filter, setFilter] = useState<AttendanceFilter>({ search: '' });

  // Filter attendance data based on search term
  const filteredAttendance = attendanceData.filter(record =>
    record.employeeName.toLowerCase().includes(filter.search.toLowerCase())
  );

  const handleValidate = (id: string, validated: boolean) => {
    setAttendanceData(prev => prev.map(record => 
      record.id === id ? { ...record, validated } : record
    ));
  };

  return (
    <>
      <div className="flex items-center gap-2 mb-6">
        <Clock className="text-green-500 h-8 w-8" />
        <h1 className="text-2xl font-bold">Présences</h1>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-4">
            <AttendanceSearch onFilterChange={setFilter} />
          </div>
          <AttendanceTable 
            data={filteredAttendance}
            onValidate={handleValidate}
          />
        </CardContent>
      </Card>
    </>
  );
};

export default EmployeesAttendance;
