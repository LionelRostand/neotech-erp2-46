
import React from 'react';
import { Route } from "react-router-dom";
import ModuleLayout from "@/components/module/ModuleLayout";
import SubmodulePage from "@/components/module/SubmodulePage";
import TransportSettingsWrapper from '@/components/module/submodules/transport/settings/TransportSettingsWrapper';
import SelectPatch from '@/components/module/submodules/transport/patches/select-patch';
import GeolocationMapPatch from '@/components/module/submodules/transport/patches/geolocation-patch';
import LeafletCssPatch from '@/components/module/submodules/transport/patches/leaflet-css-patch';
import WebBookingPreview from '@/components/module/submodules/transport/web-booking/WebBookingPreview';
import NotFound from '@/pages/NotFound';

// Composant d'enveloppe pour appliquer SelectPatch et map patches à chaque sous-module
const WithPatches: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <SelectPatch />
    <GeolocationMapPatch />
    <LeafletCssPatch />
    {children}
  </>
);

export const TransportRoutes = (
  <Route key="transport" path="/modules/transport" element={<ModuleLayout moduleId={7} />}>
    <Route index element={<WithPatches><SubmodulePage moduleId={7} submoduleId="transport-dashboard" /></WithPatches>} />
    <Route path="dashboard" element={<WithPatches><SubmodulePage moduleId={7} submoduleId="transport-dashboard" /></WithPatches>} />
    <Route path="reservations" element={<WithPatches><SubmodulePage moduleId={7} submoduleId="transport-reservations" /></WithPatches>} />
    <Route path="planning" element={<WithPatches><SubmodulePage moduleId={7} submoduleId="transport-planning" /></WithPatches>} />
    <Route path="fleet" element={<WithPatches><SubmodulePage moduleId={7} submoduleId="transport-fleet" /></WithPatches>} />
    <Route path="drivers" element={<WithPatches><SubmodulePage moduleId={7} submoduleId="transport-drivers" /></WithPatches>} />
    <Route path="geolocation" element={<WithPatches><SubmodulePage moduleId={7} submoduleId="transport-geolocation" /></WithPatches>} />
    <Route path="payments" element={<WithPatches><SubmodulePage moduleId={7} submoduleId="transport-payments" /></WithPatches>} />
    <Route path="customer-service" element={<WithPatches><SubmodulePage moduleId={7} submoduleId="transport-customer-service" /></WithPatches>} />
    <Route path="loyalty" element={<WithPatches><SubmodulePage moduleId={7} submoduleId="transport-loyalty" /></WithPatches>} />
    <Route path="web-booking" element={<WithPatches><SubmodulePage moduleId={7} submoduleId="transport-web-booking" /></WithPatches>} />
    <Route path="settings" element={<TransportSettingsWrapper />} />
    
    {/* Web Booking Site Preview Routes - catch all preview paths properly */}
    <Route path="web-booking/preview" element={<WithPatches><WebBookingPreview isEditing={false} preview={true} /></WithPatches>} />
    <Route path="web-booking/preview/vehicules" element={<WithPatches><WebBookingPreview isEditing={false} preview={true} currentPage="vehicules" /></WithPatches>} />
    <Route path="web-booking/preview/tarifs" element={<WithPatches><WebBookingPreview isEditing={false} preview={true} currentPage="tarifs" /></WithPatches>} />
    <Route path="web-booking/preview/contact" element={<WithPatches><WebBookingPreview isEditing={false} preview={true} currentPage="contact" /></WithPatches>} />
    <Route path="web-booking/edit" element={<WithPatches><WebBookingPreview isEditing={true} /></WithPatches>} />
    
    {/* Catch any other transport paths with a 404 */}
    <Route path="*" element={<NotFound />} />
  </Route>
);
