
import React from 'react';
import { Route } from "react-router-dom";
import ModuleLayout from "@/components/module/ModuleLayout";
import SubmodulePage from "@/components/module/SubmodulePage";

export const OtherModulesRoutes = [
  <Route key="academy" path="/modules/academy/*" element={<ModuleLayout moduleId={4} />} />,
  <Route key="restaurant" path="/modules/restaurant/*" element={<ModuleLayout moduleId={5} />} />,
  
  // Garage module routes
  <Route key="garage" path="/modules/garage" element={<ModuleLayout moduleId={6} />}>
    <Route 
      path="dashboard" 
      element={<SubmodulePage moduleId={6} submoduleId="garage-dashboard" />} 
    />
    <Route 
      path="clients" 
      element={<SubmodulePage moduleId={6} submoduleId="garage-clients" />} 
    />
    <Route 
      path="vehicles" 
      element={<SubmodulePage moduleId={6} submoduleId="garage-vehicles" />} 
    />
    <Route 
      path="appointments" 
      element={<SubmodulePage moduleId={6} submoduleId="garage-appointments" />} 
    />
    <Route 
      path="repairs" 
      element={<SubmodulePage moduleId={6} submoduleId="garage-repairs" />} 
    />
    <Route 
      path="invoices" 
      element={<SubmodulePage moduleId={6} submoduleId="garage-invoices" />} 
    />
    <Route 
      path="suppliers" 
      element={<SubmodulePage moduleId={6} submoduleId="garage-suppliers" />} 
    />
    <Route 
      path="inventory" 
      element={<SubmodulePage moduleId={6} submoduleId="garage-inventory" />} 
    />
    <Route 
      path="loyalty" 
      element={<SubmodulePage moduleId={6} submoduleId="garage-loyalty" />} 
    />
    <Route 
      path="settings" 
      element={<SubmodulePage moduleId={6} submoduleId="garage-settings" />} 
    />
  </Route>,
  
  <Route key="ecommerce" path="/modules/ecommerce/*" element={<ModuleLayout moduleId={10} />} />,
  
  // Salon module routes
  <Route key="salon" path="/modules/salon" element={<ModuleLayout moduleId={19} />}>
    <Route 
      path="dashboard" 
      element={<SubmodulePage moduleId={19} submoduleId="salon-dashboard" />} 
    />
    <Route 
      path="clients" 
      element={<SubmodulePage moduleId={19} submoduleId="salon-clients" />} 
    />
    <Route 
      path="appointments" 
      element={<SubmodulePage moduleId={19} submoduleId="salon-appointments" />} 
    />
    <Route 
      path="stylists" 
      element={<SubmodulePage moduleId={19} submoduleId="salon-stylists" />} 
    />
    <Route 
      path="services" 
      element={<SubmodulePage moduleId={19} submoduleId="salon-services" />} 
    />
    <Route 
      path="products" 
      element={<SubmodulePage moduleId={19} submoduleId="salon-products" />} 
    />
    <Route 
      path="billing" 
      element={<SubmodulePage moduleId={19} submoduleId="salon-billing" />} 
    />
    <Route 
      path="loyalty" 
      element={<SubmodulePage moduleId={19} submoduleId="salon-loyalty" />} 
    />
    <Route 
      path="inventory" 
      element={<SubmodulePage moduleId={19} submoduleId="salon-inventory" />} 
    />
    <Route 
      path="reports" 
      element={<SubmodulePage moduleId={19} submoduleId="salon-reports" />} 
    />
    <Route 
      path="booking" 
      element={<SubmodulePage moduleId={19} submoduleId="salon-booking" />} 
    />
    <Route 
      path="settings" 
      element={<SubmodulePage moduleId={19} submoduleId="salon-settings" />} 
    />
  </Route>
];
