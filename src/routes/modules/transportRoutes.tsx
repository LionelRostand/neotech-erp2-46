
import React from 'react';
import { Route } from "react-router-dom";
import ModuleLayout from "@/components/module/ModuleLayout";
import SubmodulePage from "@/components/module/SubmodulePage";
import TransportSettingsWrapper from '@/components/module/submodules/transport/settings/TransportSettingsWrapper';

export const TransportRoutes = (
  <Route key="transport" path="/modules/transport" element={<ModuleLayout moduleId={7} />}>
    <Route index element={<SubmodulePage moduleId={7} submoduleId="transport-dashboard" />} />
    <Route path="dashboard" element={<SubmodulePage moduleId={7} submoduleId="transport-dashboard" />} />
    <Route path="reservations" element={<SubmodulePage moduleId={7} submoduleId="transport-reservations" />} />
    <Route path="planning" element={<SubmodulePage moduleId={7} submoduleId="transport-planning" />} />
    <Route path="fleet" element={<SubmodulePage moduleId={7} submoduleId="transport-fleet" />} />
    <Route path="drivers" element={<SubmodulePage moduleId={7} submoduleId="transport-drivers" />} />
    <Route path="geolocation" element={<SubmodulePage moduleId={7} submoduleId="transport-geolocation" />} />
    <Route path="payments" element={<SubmodulePage moduleId={7} submoduleId="transport-payments" />} />
    <Route path="customer-service" element={<SubmodulePage moduleId={7} submoduleId="transport-customer-service" />} />
    <Route path="loyalty" element={<SubmodulePage moduleId={7} submoduleId="transport-loyalty" />} />
    <Route path="web-booking" element={<SubmodulePage moduleId={7} submoduleId="transport-web-booking" />} />
    <Route path="settings" element={<TransportSettingsWrapper />} />
  </Route>
);
