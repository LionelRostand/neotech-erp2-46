
import React from 'react';
import { Route } from "react-router-dom";
import ModuleLayout from "@/components/module/ModuleLayout";
import SubmodulePage from "@/components/module/SubmodulePage";
import CreateCompanyPage from "@/components/module/submodules/companies/CreateCompanyPage";

export const CompaniesRoutes = (
  <Route key="companies" path="/modules/companies" element={<ModuleLayout moduleId={18} />}>
    <Route index element={<SubmodulePage moduleId={18} submoduleId="companies-dashboard" />} />
    <Route path="dashboard" element={<SubmodulePage moduleId={18} submoduleId="companies-dashboard" />} />
    <Route path="list" element={<SubmodulePage moduleId={18} submoduleId="companies-list" />} />
    <Route path="create" element={<CreateCompanyPage />} />
    <Route path="contacts" element={<SubmodulePage moduleId={18} submoduleId="companies-contacts" />} />
    <Route path="documents" element={<SubmodulePage moduleId={18} submoduleId="companies-documents" />} />
    <Route path="reports" element={<SubmodulePage moduleId={18} submoduleId="companies-reports" />} />
    <Route path="settings" element={<SubmodulePage moduleId={18} submoduleId="companies-settings" />} />
  </Route>
);
