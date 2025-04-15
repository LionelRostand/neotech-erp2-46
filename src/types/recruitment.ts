
export interface RecruitmentPost {
  id: string;
  position: string;
  department: string;
  location: string;
  status: 'Open' | 'In Progress' | 'Closed';
  priority: 'High' | 'Medium' | 'Low';
  description: string;
  requirements: string[];
  responsibilities: string[];
  salary_range?: {
    min: number;
    max: number;
    currency: string;
  };
  posting_date: string;
  closing_date?: string;
  hiring_manager: string;
  contact_email: string;
  applications_count?: number;
  interviews_scheduled?: number;
  created_at: string;
  updated_at: string;
}
