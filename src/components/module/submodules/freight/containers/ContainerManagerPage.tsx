import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { COLLECTIONS } from "@/lib/firebase-collections";
import { doc, updateDoc, deleteDoc, addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { useFreightData } from "@/hooks/modules/useFreightData";
import CreateEditContainerDialog from "./CreateEditContainerDialog";
import DeleteContainerDialog from "./DeleteContainerDialog";

const generateContainerNumber = () => {
  // Format: CTR-YYYYMMDD-XXXXX (5 chiffres pseudo-aléatoires)
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.floor(10000 + Math.random() * 90000).toString();
  return `CTR-${datePart}-${randomPart}`;
};

const ContainerManagerPage: React.FC = () => {
  const { containers = [], carriers = [], clients = [], routes = [], loading } = useFreightData();
  const [openDialog, setOpenDialog] = useState<"create" | "edit" | "delete" | null>(null);
  const [currentContainer, setCurrentContainer] = useState<any>(null);

  const handleNew = () => {
    setCurrentContainer(null);
    setOpenDialog("create");
  };

  const handleEdit = (container: any) => {
    setCurrentContainer(container);
    setOpenDialog("edit");
  };

  const handleDelete = (container: any) => {
    setCurrentContainer(container);
    setOpenDialog("delete");
  };

  const closeDialog = () => {
    setOpenDialog(null);
    setCurrentContainer(null);
  };

  const carrierOptions = useMemo(() => 
    Array.isArray(carriers) ? carriers.map((c: any) => ({
      label: c.name,
      value: c.id
    })) : [], [carriers]);
    
  const clientOptions = useMemo(() => 
    Array.isArray(clients) ? clients.map((c: any) => ({
      label: c.name || c.clientName,
      value: c.id
    })) : [], [clients]);
    
  const routeOptions = useMemo(() =>
    Array.isArray(routes) ? routes.map((r: any) => ({
      label: `${r.name} (${r.origin} → ${r.destination})`,
      value: r.id,
      origin: r.origin,
      destination: r.destination,
    })) : [], [routes]);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Gestion des Conteneurs</h2>
        <Button onClick={handleNew}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Conteneur
        </Button>
      </div>
      <div className="bg-white rounded shadow p-4">
        {loading ? (
          <div>Chargement...</div>
        ) : !containers || containers.length === 0 ? (
          <div className="text-center text-muted-foreground p-8">
            Aucun conteneur enregistré pour le moment.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b font-semibold text-left">
                <th>Numéro</th>
                <th>Type</th>
                <th>Taille</th>
                <th>Status</th>
                <th>Transporteur</th>
                <th>Client</th>
                <th>Origine</th>
                <th>Destination</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {containers.map((container: any) => (
                <tr key={container.id} className="border-b">
                  <td>{container.number}</td>
                  <td>{container.type}</td>
                  <td>{container.size}</td>
                  <td>{container.status}</td>
                  <td>{container.carrierName}</td>
                  <td>{container.client}</td>
                  <td>{container.origin}</td>
                  <td>{container.destination}</td>
                  <td>
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(container)} title="Modifier">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleDelete(container)} title="Supprimer">
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <CreateEditContainerDialog
        open={openDialog === "create" || openDialog === "edit"}
        onClose={closeDialog}
        container={openDialog === "edit" ? currentContainer : null}
        carrierOptions={carrierOptions}
        clientOptions={clientOptions}
        routeOptions={routeOptions}
        defaultNumber={openDialog === "create" ? generateContainerNumber() : undefined}
      />

      <DeleteContainerDialog
        open={openDialog === "delete"}
        onClose={closeDialog}
        container={currentContainer}
      />
    </div>
  );
};

export default ContainerManagerPage;
