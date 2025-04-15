
export interface RecruitmentPost {
  id: string;
  position: string;
  department: string;
  location: string;
  status: 'Open' | 'In Progress' | 'Closed' | 'Ouvert' | 'En cours' | 'Clôturé';
  priority: 'High' | 'Medium' | 'Low' | 'Haute' | 'Moyenne' | 'Basse';
  description: string;
  requirements: string[] | string;
  responsibilities?: string[];
  salary_range?: {
    min: number;
    max: number;
    currency: string;
  };
  posting_date?: string;
  closing_date?: string;
  hiring_manager?: string;
  contact_email?: string;
  applications_count?: number;
  interviews_scheduled?: number;
  created_at: string;
  updated_at: string;
  
  // Including fields from useRecruitmentData.ts
  openDate: string;
  applicationDeadline?: string;
  hiringManagerId: string;
  hiringManagerName: string;
  contractType: string;
  salary: string;
  applicationCount: number;
  
  // Added candidates field
  candidates?: CandidateApplication[];
}

export type RecruitmentStage = 
  | 'Candidature déposée'
  | 'CV en cours d\'analyse' 
  | 'Entretien RH'
  | 'Test technique'
  | 'Entretien technique'
  | 'Entretien final'
  | 'Proposition envoyée'
  | 'Recrutement finalisé'
  | 'Candidature refusée';

export interface CandidateApplication {
  id: string;
  recruitmentId: string;
  candidateId?: string;
  candidateName: string;
  candidateEmail: string;
  currentStage: RecruitmentStage;
  stageHistory: {
    stage: RecruitmentStage;
    date: string;
    comments?: string;
  }[];
  resume?: string;
  coverLetter?: string;
  createdAt: string;
  updatedAt: string;
}
