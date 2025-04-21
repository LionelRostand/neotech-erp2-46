import React from 'react';
import FreightShipmentsPage from '../freight/FreightShipmentsPage';
import FreightClientPortal from '../freight/FreightClientPortal';
import FreightPackages from '../freight/FreightPackages';
import FreightRoutesPage from '../freight/FreightRoutesPage';
import FreightClientsPage from '../freight/clients/FreightClientsPage';
import FreightSecuritySettings from '../freight/FreightSecuritySettings';
import ContainerViewDialog from "../freight/containers/ContainerViewDialog";
import ContainerEditDialog from "../freight/containers/ContainerEditDialog";
import ContainerDeleteDialog from "../freight/containers/ContainerDeleteDialog";
import { Eye, Pencil, Trash2 } from "lucide-react";
import type { Container } from "@/types/freight";

type FreightSubmoduleProps = {
  submoduleId: string;
};

export const FreightRenderer: React.FC<FreightSubmoduleProps> = ({ submoduleId }) => {
  switch (submoduleId) {
    case 'freight-dashboard':
      return <FreightDashboard />;
    case 'freight-shipments':
      return <FreightShipmentsPage />;
    case 'freight-routes':
      return <FreightRoutesPage />;
    case 'freight-tracking':
      return <FreightTracking />;
    case 'freight-containers':
      return <FreightContainers />;
    case 'freight-carriers':
      return <FreightCarriers />;
    case 'freight-pricing':
      return <FreightPricing />;
    case 'freight-settings':
      return <FreightSecuritySettings />;
    case 'freight-documents':
      return <FreightDocuments />;
    case 'freight-client-portal':
      return <FreightClientPortal />;
    case 'freight-packages':
      return <FreightPackages />;
    default:
      return <DefaultFreightContent />;
  }
};

const FreightDashboard = () => (
  <div className="container mx-auto py-8">
    <h1 className="text-2xl font-bold mb-6">Tableau de bord Logistique</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="font-semibold text-lg mb-2">Expéditions récentes</h2>
        <p className="text-gray-500">Aucune donnée disponible</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="font-semibold text-lg mb-2">Clients actifs</h2>
        <p className="text-gray-500">Aucune donnée disponible</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="font-semibold text-lg mb-2">Transporteurs</h2>
        <p className="text-gray-500">Aucune donnée disponible</p>
      </div>
    </div>
  </div>
);

const FreightTracking = () => (
  <div className="container mx-auto py-8">
    <h1 className="text-2xl font-bold mb-6">Suivi des Expéditions</h1>
    <p className="text-gray-500">À implémenter</p>
  </div>
);

const FreightContainers: React.FC = () => {
  const MOCK_CONTAINERS: Container[] = [
    {
      id: "1",
      number: "C1001",
      type: "Dry",
      size: "20ft",
      status: "En transit",
      carrierName: "COSCO",
      origin: "Shanghai",
      destination: "Le Havre",
      departureDate: "2024-04-02",
      arrivalDate: "2024-06-01",
      location: "Port de Shanghai",
      client: "Entreprise X",
      departure: "Shanghai",
      arrival: "Le Havre"
    },
    {
      id: "2",
      number: "C1002",
      type: "Reefer",
      size: "40ft",
      status: "Livré",
      carrierName: "MAERSK",
      origin: "Rotterdam",
      destination: "Dakar",
      departureDate: "2024-05-01",
      arrivalDate: "2024-07-15",
      location: "Rotterdam",
      client: "Entreprise Y",
      departure: "Rotterdam",
      arrival: "Dakar"
    }
  ];

  const [selected, setSelected] = React.useState<Container | null>(null);
  const [viewOpen, setViewOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  const [containers, setContainers] = React.useState<Container[]>(MOCK_CONTAINERS);

  const handleView = (container: Container) => {
    setSelected(container);
    setViewOpen(true);
  };

  const handleEdit = (container: Container) => {
    setSelected(container);
    setEditOpen(true);
  };

  const handleEditSubmit = (values: Partial<Container>) => {
    if (!selected) return;
    setSubmitting(true);
    setTimeout(() => {
      setContainers(containers.map(c => (c.id === selected.id ? { ...c, ...values } : c)));
      setSubmitting(false);
      setEditOpen(false);
    }, 1000);
  };

  const handleDelete = (container: Container) => {
    setSelected(container);
    setDeleteOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selected) return;
    setDeleting(true);
    setTimeout(() => {
      setContainers(containers.filter(c => c.id !== selected.id));
      setDeleting(false);
      setDeleteOpen(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Gestion des Conteneurs</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white divide-y divide-gray-200 rounded shadow">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left">Numéro</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Taille</th>
              <th className="px-4 py-2">Statut</th>
              <th className="px-4 py-2">Transporteur</th>
              <th className="px-4 py-2">Origine</th>
              <th className="px-4 py-2">Destination</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {containers.map(container => (
              <tr key={container.id}>
                <td className="px-4 py-2">{container.number}</td>
                <td className="px-4 py-2">{container.type}</td>
                <td className="px-4 py-2">{container.size}</td>
                <td className="px-4 py-2">{container.status}</td>
                <td className="px-4 py-2">{container.carrierName}</td>
                <td className="px-4 py-2">{container.origin}</td>
                <td className="px-4 py-2">{container.destination}</td>
                <td className="px-4 py-2 text-right flex gap-2 justify-end">
                  <button className="p-2 hover:bg-accent rounded" onClick={() => handleView(container)}>
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-accent rounded" onClick={() => handleEdit(container)}>
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-red-100 rounded" onClick={() => handleDelete(container)}>
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
            {containers.length === 0 && (
              <tr>
                <td colSpan={8} className="py-6 text-center text-gray-500">Aucun conteneur trouvé.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <ContainerViewDialog open={viewOpen} onOpenChange={val => setViewOpen(val)} container={selected} />
      <ContainerEditDialog open={editOpen} onOpenChange={val => setEditOpen(val)} container={selected} onSubmit={handleEditSubmit} submitting={submitting} />
      <ContainerDeleteDialog open={deleteOpen} onOpenChange={val => setDeleteOpen(val)} container={selected} onDelete={handleDeleteConfirm} deleting={deleting} />
    </div>
  );
};

const FreightCarriers = () => (
  <div className="container mx-auto py-8">
    <h1 className="text-2xl font-bold mb-6">Transporteurs</h1>
    <p className="text-gray-500">À implémenter</p>
  </div>
);

const FreightPricing = () => (
  <div className="container mx-auto py-8">
    <h1 className="text-2xl font-bold mb-6">Tarification</h1>
    <p className="text-gray-500">À implémenter</p>
  </div>
);

const FreightDocuments = () => (
  <div className="container mx-auto py-8">
    <h1 className="text-2xl font-bold mb-6">Documents de Transport</h1>
    <p className="text-gray-500">À implémenter</p>
  </div>
);

const DefaultFreightContent = () => (
  <div className="container mx-auto py-8">
    <h1 className="text-2xl font-bold mb-6">Module Logistique</h1>
    <p className="text-gray-500">Sélectionnez une option dans le menu</p>
  </div>
);
