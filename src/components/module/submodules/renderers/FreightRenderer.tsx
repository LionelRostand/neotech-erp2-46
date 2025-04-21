
import React from 'react';
import { useParams } from 'react-router-dom';
import FreightShipmentsPage from '../freight/FreightShipmentsPage';
import FreightRoutes from '../freight/FreightRoutesPage';
import ContainersList from '../freight/containers/ContainersList';

export const FreightRenderer: React.FC<{ submoduleId: string }> = ({ submoduleId }) => {
  const { trackingCode } = useParams<{ trackingCode?: string }>();

  switch (submoduleId) {
    case 'freight-dashboard':
      return <div>Tableau de bord Freight</div>;
    case 'freight-shipments':
      return <FreightShipmentsPage />;
    case 'freight-routes':
      return <FreightRoutes />;
    case 'freight-containers':
      return <ContainersList />;
    case 'freight-tracking':
      return <div>Tracking{trackingCode ? ` - ${trackingCode}` : ''}</div>;
    case 'freight-carriers':
      return <div>Transporteurs</div>;
    case 'freight-pricing':
      return <div>Tarification</div>;
    case 'freight-documents':
      return <div>Documents</div>;
    case 'freight-client-portal':
      return <div>Portail client</div>;
    case 'freight-settings':
      return <div>Paramètres</div>;
    default:
      return <div>Module freight: {submoduleId}</div>;
  }
};
