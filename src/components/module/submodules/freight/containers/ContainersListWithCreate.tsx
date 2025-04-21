
import React from "react";
import ContainerCreateDialog from "./ContainerCreateDialog";
import { Button } from "@/components/ui/button";
// Remplacez ceci par votre hook réel pour récupérer la liste
// import useFreightContainers from "@/hooks/freight/useFreightContainers";
import { toast } from "sonner";

// Dummy hook/fonction pour exemple, à remplacer par votre logique réelle.
const useFreightContainers = () => {
  const [containers, setContainers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    // Fake loading: à remplacer par votre fetch réel à la collection "freight_containers"
    setTimeout(() => {
      setContainers([]);
      setLoading(false);
    }, 700);
  }, []);

  return { containers, loading, refetch: () => {} };
};

const ContainersListWithCreate = () => {
  const [openDialog, setOpenDialog] = React.useState(false);
  const { containers, loading, refetch } = useFreightContainers();

  const handleCreated = (container: any) => {
    toast.success("Nouveau conteneur ajouté !");
    setOpenDialog(false);
    refetch(); // Recharger la liste des conteneurs depuis Firestore
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Gestion des Conteneurs</h2>
        <Button variant="default" onClick={() => setOpenDialog(true)}>
          + Ajouter un conteneur
        </Button>
      </div>
      <ContainerCreateDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        onCreated={handleCreated}
      />
      {/* Afficher la liste ici */}
      <div>
        {loading ? (
          <div className="py-8 text-center text-muted-foreground">Chargement...</div>
        ) : containers.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">Aucun conteneur trouvé.</div>
        ) : (
          <ul className="divide-y border rounded bg-white shadow">
            {containers.map((c) => (
              <li key={c.number} className="p-4">
                <div className="font-semibold">N° {c.number}</div>
                <div>{c.type}, {c.size} - {c.status}</div>
                {/* Ajoutez ici plus de champs si besoin */}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ContainersListWithCreate;
