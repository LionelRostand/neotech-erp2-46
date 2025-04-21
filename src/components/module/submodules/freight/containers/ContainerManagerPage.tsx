
import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useFreightData } from "@/hooks/modules/useFreightData";
import CreateEditContainerDialog from "./CreateEditContainerDialog";
import DeleteContainerDialog from "./DeleteContainerDialog";
import ContainerStatusBadge from "./ContainerStatusBadge";
import ContainerDetailsDialog from "./ContainerDetailsDialog";

const ContainerManagerPage: React.FC = () => {
  const { containers, carriers, clients, routes, loading } = useFreightData();
  const [openDialog, setOpenDialog] = useState<"create" | "edit" | "delete" | null>(null);
  const [currentContainer, setCurrentContainer] = useState<any>(null);

  // Vue détaillée dans une modale
  const [showDetails, setShowDetails] = useState(false);

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

  const handleShowDetails = (container: any) => {
    setCurrentContainer(container);
    setShowDetails(true);
  };

  const closeDialog = () => {
    setOpenDialog(null);
    setCurrentContainer(null);
  };

  const closeDetails = () => setShowDetails(false);

  // Optimisation pour l'autocomplete des options
  const carrierOptions = useMemo(() => carriers.map((c: any) => ({
    label: c.name,
    value: c.id
  })), [carriers]);
  const clientOptions = useMemo(() => clients.map((c: any) => ({
    label: c.name || c.clientName,
    value: c.id
  })), [clients]);
  const routeOptions = useMemo(() =>
    routes.map((r: any) => ({
      label: `${r.name} (${r.origin} → ${r.destination})`,
      value: r.id,
      origin: r.origin,
      destination: r.destination,
    }))
  , [routes]);

  return (
    <div className="max-w-6xl mx-auto px-2 md:px-6 py-4 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold tracking-tight">Gestion des Conteneurs</h2>
        <Button onClick={handleNew}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow p-3 overflow-x-auto">
        <table className="w-full text-sm border-separate border-spacing-y-1">
          <thead>
            <tr>
              <th className="sticky top-0 bg-white z-10 px-3 py-2 text-left">Numéro</th>
              <th className="sticky top-0 bg-white z-10 px-3 py-2 text-left">Type</th>
              <th className="sticky top-0 bg-white z-10 px-3 py-2 text-left">Taille</th>
              <th className="sticky top-0 bg-white z-10 px-3 py-2 text-left">Statut</th>
              <th className="sticky top-0 bg-white z-10 px-3 py-2 text-left">Transporteur</th>
              <th className="sticky top-0 bg-white z-10 px-3 py-2 text-left">Client</th>
              <th className="sticky top-0 bg-white z-10 px-3 py-2 text-left">Origine</th>
              <th className="sticky top-0 bg-white z-10 px-3 py-2 text-left">Destination</th>
              <th className="sticky top-0 bg-white z-10 px-3 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-8 text-muted-foreground">
                  Chargement des conteneurs…
                </td>
              </tr>
            ) : containers.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-8 text-muted-foreground">
                  Aucun conteneur enregistré pour le moment.
                </td>
              </tr>
            ) : (
              containers.map((container: any, idx: number) => (
                <tr key={container.id} className={idx % 2 === 0 ? "bg-gray-50 hover:bg-purple-50 transition" : "hover:bg-purple-50 transition"}>
                  <td className="px-3 py-2 font-semibold cursor-pointer text-primary underline"
                      title="Voir détails"
                      onClick={() => handleShowDetails(container)}>
                    {container.number}
                  </td>
                  <td className="px-3 py-2">{container.type}</td>
                  <td className="px-3 py-2">{container.size}</td>
                  <td className="px-3 py-2">
                    <ContainerStatusBadge status={container.status} />
                  </td>
                  <td className="px-3 py-2">{container.carrierName}</td>
                  <td className="px-3 py-2">{container.client}</td>
                  <td className="px-3 py-2">{container.origin}</td>
                  <td className="px-3 py-2">{container.destination}</td>
                  <td className="px-3 py-2">
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="hover:bg-purple-100" onClick={() => handleEdit(container)} title="Modifier">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="hover:bg-purple-100" onClick={() => handleDelete(container)} title="Supprimer">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <CreateEditContainerDialog
        open={openDialog === "create" || openDialog === "edit"}
        onClose={closeDialog}
        container={openDialog === "edit" ? currentContainer : null}
        carrierOptions={carrierOptions}
        clientOptions={clientOptions}
        routeOptions={routeOptions}
      />

      <DeleteContainerDialog
        open={openDialog === "delete"}
        onClose={closeDialog}
        container={currentContainer}
      />

      <ContainerDetailsDialog
        open={showDetails}
        onClose={closeDetails}
        container={currentContainer}
      />
    </div>
  );
};

export default ContainerManagerPage;
