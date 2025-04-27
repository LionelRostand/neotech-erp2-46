
import React from 'react';
import { SubModule } from '@/data/types/modules';
import DefaultSubmoduleContent from '../DefaultSubmoduleContent';
import { 
  AcademyRegistrations,
  AcademyStudents,
  AcademyStaff,
  AcademyCourses,
  AcademyExams,
  AcademyGrades,
  AcademyReports,
  AcademyTeachers,
  AcademyAttendance,
  AcademyGovernance,
  AcademySettings
} from '../academy';

export const renderAcademySubmodule = (submoduleId: string, submodule: SubModule) => {
  switch (submoduleId) {
    case 'academy-registrations':
      return <AcademyRegistrations />;
    case 'academy-students':
      return <AcademyStudents />;
    case 'academy-staff':
      return <AcademyStaff />;
    case 'academy-courses':
      return <AcademyCourses />;
    case 'academy-exams':
      return <AcademyExams />;
    case 'academy-grades':
      return <AcademyGrades />;
    case 'academy-reports':
      return <AcademyReports />;
    case 'academy-teachers':
      return <AcademyTeachers />;
    case 'academy-attendance':
      return <AcademyAttendance />;
    case 'academy-governance':
      return <AcademyGovernance />;
    case 'academy-settings':
      return <AcademySettings />;
    default:
      return <DefaultSubmoduleContent submodule={submodule} />;
  }
};
