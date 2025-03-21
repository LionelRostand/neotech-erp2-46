
import React from 'react';
import { Route } from "react-router-dom";
import ModuleLayout from "@/components/module/ModuleLayout";
import SubmodulePage from "@/components/module/SubmodulePage";

export const AccountingRoutes = (
  <Route key="accounting" path="/modules/accounting" element={<ModuleLayout moduleId={9} />}>
    <Route index element={<SubmodulePage moduleId={9} submoduleId="accounting-dashboard" />} />
    <Route path="dashboard" element={<SubmodulePage moduleId={9} submoduleId="accounting-dashboard" />} />
    <Route path="invoices" element={<SubmodulePage moduleId={9} submoduleId="accounting-invoices" />} />
    <Route path="payments" element={<SubmodulePage moduleId={9} submoduleId="accounting-payments" />} />
    <Route path="taxes" element={<SubmodulePage moduleId={9} submoduleId="accounting-taxes" />} />
    <Route path="reports" element={<SubmodulePage moduleId={9} submoduleId="accounting-reports" />} />
    <Route path="settings" element={<SubmodulePage moduleId={9} submoduleId="accounting-settings" />} />
  </Route>
);
