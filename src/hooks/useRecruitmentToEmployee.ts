
import { useState } from 'react';
import { updateDocument, addDocument } from '@/hooks/firestore/firestore-utils';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { useToast } from '@/components/ui/use-toast';
import { CandidateApplication, RecruitmentPost } from '@/types/recruitment';
import { v4 as uuidv4 } from 'uuid';

export const useRecruitmentToEmployee = () => {
  const [isConverting, setIsConverting] = useState(false);
  const { toast } = useToast();

  const convertCandidateToEmployee = async (
    candidate: CandidateApplication,
    recruitmentPost: RecruitmentPost
  ) => {
    try {
      setIsConverting(true);

      // Create an employee from the candidate data
      const newEmployeeData = {
        id: uuidv4(), // Generate a unique ID
        firstName: candidate.candidateName.split(' ')[0] || '',
        lastName: candidate.candidateName.split(' ').slice(1).join(' ') || '',
        email: candidate.candidateEmail,
        position: recruitmentPost.position,
        department: recruitmentPost.department,
        departmentId: recruitmentPost.department,
        hireDate: new Date().toISOString(),
        startDate: new Date().toISOString(),
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // Add any additional fields needed for an employee
        photoURL: '',
        phone: '',
        candidateId: candidate.id, // Reference to original candidate
        recruitmentId: recruitmentPost.id, // Reference to original recruitment post
      };

      // Add the new employee to the HR_EMPLOYEES collection
      const employeeRef = await addDocument(COLLECTIONS.HR.EMPLOYEES, newEmployeeData);
      
      // Update the recruitment post to mark the candidate as hired
      await updateDocument(COLLECTIONS.HR.RECRUITMENTS, recruitmentPost.id, {
        candidates: recruitmentPost.candidates?.map(c => 
          c.id === candidate.id 
            ? { 
                ...c, 
                currentStage: 'Recrutement finalisé',
                hired: true,
                employeeId: employeeRef.id,
                stageHistory: [
                  ...c.stageHistory,
                  {
                    stage: 'Recrutement finalisé',
                    date: new Date().toISOString(),
                    comments: `Candidat embauché et converti en employé avec l'ID: ${employeeRef.id}`
                  }
                ]
              }
            : c
        ),
        updated_at: new Date().toISOString(),
      });

      toast({
        title: "Conversion réussie",
        description: `${candidate.candidateName} a été converti en employé avec succès`,
      });

      return employeeRef.id;
    } catch (error) {
      console.error("Erreur lors de la conversion du candidat en employé:", error);
      toast({
        title: "Erreur",
        description: "Impossible de convertir le candidat en employé",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsConverting(false);
    }
  };

  return {
    convertCandidateToEmployee,
    isConverting
  };
};
