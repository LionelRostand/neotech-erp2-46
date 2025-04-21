
import React from 'react';
import { Route } from "react-router-dom";
import ModuleLayout from "@/components/module/ModuleLayout";
import SubmodulePage from "@/components/module/SubmodulePage";
import CreateShipmentPage from "@/components/module/submodules/freight/CreateShipmentPage";
import FreightClientsPage from "@/components/module/submodules/freight/clients/FreightClientsPage";
import FreightRoutesPage from "@/components/module/submodules/freight/FreightRoutesPage";
import ContainersListWithCreate from "@/components/module/submodules/freight/containers/ContainersListWithCreate";

export const FreightRoutes = (
  <Route key="freight" path="/modules/freight" element={<ModuleLayout moduleId={2} />}>
    <Route index element={<SubmodulePage moduleId={2} submoduleId="freight-dashboard" />} />
    <Route path="dashboard" element={<SubmodulePage moduleId={2} submoduleId="freight-dashboard" />} />
    <Route path="shipments" element={<SubmodulePage moduleId={2} submoduleId="freight-shipments" />} />
    <Route path="create-shipment" element={<CreateShipmentPage />} />
    <Route path="routes" element={<SubmodulePage moduleId={2} submoduleId="freight-routes" />} />
    <Route path="containers" element={<ContainersListWithCreate />} />
    <Route path="carriers" element={<SubmodulePage moduleId={2} submoduleId="freight-carriers" />} />
    <Route path="tracking" element={<SubmodulePage moduleId={2} submoduleId="freight-tracking" />} />
    <Route path="tracking/:trackingCode" element={<SubmodulePage moduleId={2} submoduleId="freight-tracking" />} />
    <Route path="pricing" element={<SubmodulePage moduleId={2} submoduleId="freight-pricing" />} />
    <Route path="documents" element={<SubmodulePage moduleId={2} submoduleId="freight-documents" />} />
    <Route path="client-portal" element={<SubmodulePage moduleId={2} submoduleId="freight-client-portal" />} />
    <Route path="settings" element={<SubmodulePage moduleId={2} submoduleId="freight-settings" />} />
    <Route path="clients" element={<FreightClientsPage />} />
  </Route>
);
