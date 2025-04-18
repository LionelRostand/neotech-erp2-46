
export interface RecruitmentStage {
  stage: string;
  date: string;
  note?: string;
}

export interface CandidateApplication {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  cvUrl?: string;
  coverLetterUrl?: string;
  applicationDate: string;
  status: 'pending' | 'reviewing' | 'interview' | 'offer' | 'hired' | 'rejected';
  notes?: string;
  interviewDate?: string;
  evaluationScore?: number;
  
  // Nouveaux champs pour le processus de recrutement
  candidateName?: string;
  candidateEmail?: string;
  technicalInterviewStatus?: 'pending' | 'passed' | 'failed';
  normalInterviewStatus?: 'pending' | 'passed' | 'failed';
  proposedSalary?: number;
  offerStatus?: 'pending' | 'accepted' | 'rejected';
  currentStage?: string;
  stageHistory?: RecruitmentStage[];
  recruitmentId?: string;
  resume?: string;
}

export interface RecruitmentPost {
  id: string;
  position: string;
  department: string;
  location: string;
  priority: 'Urgente' | 'Haute' | 'Moyenne' | 'Basse' | 'High' | 'Medium' | 'Low';
  description: string;
  requirements: string[] | string;
  responsibilities: string[] | string;
  status: 'Ouverte' | 'En cours' | 'Entretiens' | 'Offre' | 'Fermée';
  publishDate: string;
  closingDate?: string;
  salary?: {
    min: number;
    max: number;
    currency: string;
  } | string;
  contractType: 'full-time' | 'part-time' | 'temporary' | 'internship' | 'freelance';
  experienceLevel: 'entry' | 'junior' | 'intermediate' | 'senior' | 'expert';
  educationLevel?: string;
  skills?: string[];
  benefits?: string[];
  remote?: boolean;
  hiredCandidateId?: string;
  hiredEmployeeId?: string;
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
  createdBy?: string;
  candidates?: CandidateApplication[];
  
  // Additional properties needed by components
  openDate?: string;
  applicationDeadline?: string;
  hiringManagerId?: string;
  hiringManagerName?: string;
  applicationCount?: number;
  applications_count?: number;
  interviews_scheduled?: number;
}
