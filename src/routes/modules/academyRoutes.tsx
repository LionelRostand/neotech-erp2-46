
import React from 'react';
import { Route } from "react-router-dom";
import ModuleLayout from '@/components/module/ModuleLayout';
import SubmodulePage from '@/components/module/SubmodulePage';

export const AcademyRoutes = [
  <Route key="academy-root" path="/modules/academy" element={<ModuleLayout moduleId={4} />}>
    <Route index element={<SubmodulePage moduleId={4} />} />
    <Route path="registrations" element={<SubmodulePage moduleId={4} submoduleId="academy-registrations" />} />
    <Route path="students" element={<SubmodulePage moduleId={4} submoduleId="academy-students" />} />
    <Route path="staff" element={<SubmodulePage moduleId={4} submoduleId="academy-staff" />} />
    <Route path="courses" element={<SubmodulePage moduleId={4} submoduleId="academy-courses" />} />
    <Route path="exams" element={<SubmodulePage moduleId={4} submoduleId="academy-exams" />} />
    <Route path="grades" element={<SubmodulePage moduleId={4} submoduleId="academy-grades" />} />
    <Route path="reports" element={<SubmodulePage moduleId={4} submoduleId="academy-reports" />} />
    <Route path="teachers" element={<SubmodulePage moduleId={4} submoduleId="academy-teachers" />} />
    <Route path="attendance" element={<SubmodulePage moduleId={4} submoduleId="academy-attendance" />} />
    <Route path="governance" element={<SubmodulePage moduleId={4} submoduleId="academy-governance" />} />
    <Route path="settings" element={<SubmodulePage moduleId={4} submoduleId="academy-settings" />} />
  </Route>
];
