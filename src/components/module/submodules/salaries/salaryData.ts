
export const MOCK_SALARIES = [
  { 
    id: 1, 
    name: 'John Doe', 
    position: 'Software Engineer', 
    salary: 75000, 
    paymentDate: '25/05/2023',
    department: 'Engineering',
    status: 'paid' as 'paid',
    leaves: { paid: 12, taken: 4, remaining: 8 },
    rtt: { allocated: 10, taken: 2, remaining: 8 },
    employeeId: "EMP001"
  },
  { 
    id: 2, 
    name: 'Jane Smith', 
    position: 'Project Manager', 
    salary: 90000, 
    paymentDate: '25/05/2023',
    department: 'Management',
    status: 'paid' as 'paid',
    leaves: { paid: 15, taken: 7, remaining: 8 },
    rtt: { allocated: 12, taken: 5, remaining: 7 },
    employeeId: "EMP002"
  },
  { 
    id: 3, 
    name: 'Emily Johnson', 
    position: 'Designer', 
    salary: 65000, 
    paymentDate: '25/05/2023',
    department: 'Design',
    status: 'paid' as 'paid',
    leaves: { paid: 10, taken: 3, remaining: 7 },
    rtt: { allocated: 8, taken: 3, remaining: 5 },
    employeeId: "EMP003"
  },
  { 
    id: 4, 
    name: 'Michael Brown', 
    position: 'Marketing Specialist', 
    salary: 68000, 
    paymentDate: '25/05/2023',
    department: 'Marketing',
    status: 'pending' as 'pending',
    leaves: { paid: 12, taken: 2, remaining: 10 },
    rtt: { allocated: 8, taken: 1, remaining: 7 },
    employeeId: ""
  },
  { 
    id: 5, 
    name: 'Sarah Wilson', 
    position: 'HR Manager', 
    salary: 82000, 
    paymentDate: '25/05/2023',
    department: 'Human Resources',
    status: 'paid' as 'paid',
    leaves: { paid: 15, taken: 10, remaining: 5 },
    rtt: { allocated: 10, taken: 6, remaining: 4 },
    employeeId: ""
  }
];

export const MOCK_HISTORY = [
  { id: 1, employeeId: 1, date: '25/04/2023', amount: 74000, reason: 'Annual salary' },
  { id: 2, employeeId: 1, date: '25/03/2023', amount: 74000, reason: 'Annual salary' },
  { id: 3, employeeId: 1, date: '25/02/2023', amount: 74000, reason: 'Annual salary' },
  { id: 4, employeeId: 2, date: '25/04/2023', amount: 88000, reason: 'Annual salary' },
  { id: 5, employeeId: 2, date: '25/03/2023', amount: 88000, reason: 'Annual salary' },
  { id: 6, employeeId: 3, date: '25/04/2023', amount: 65000, reason: 'Annual salary' },
];
