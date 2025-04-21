
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { COLLECTIONS } from "@/lib/firebase-collections";
import { Container as ContainerType } from "@/types/freight";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ContainerCreateDialog from "./ContainerCreateDialog";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface Props {
  onEditContainer: (container: ContainerType) => void;
}

const ContainersListWithCreate: React.FC<Props> = ({ onEditContainer }) => {
  const [isCreating, setIsCreating] = useState(false);

  // Fetch containers from Firestore
  const { data: containers, isLoading } = useQuery({
    queryKey: ["freight", "containers"],
    queryFn: async () => {
      const q = query(
        collection(db, COLLECTIONS.FREIGHT.CONTAINERS),
        orderBy("createdAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ContainerType[];
    },
  });

  // Format dates for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: fr });
    } catch (e) {
      return dateString;
    }
  };

  // Render status badge with color
  const renderStatus = (status: string) => {
    let bgColor = "bg-gray-100 text-gray-800";
    
    if (status === "vide") bgColor = "bg-yellow-100 text-yellow-800";
    if (status === "chargement") bgColor = "bg-blue-100 text-blue-800";
    if (status === "plein") bgColor = "bg-green-100 text-green-800";
    if (status === "en transit") bgColor = "bg-purple-100 text-purple-800";
    if (status === "livré") bgColor = "bg-gray-100 text-gray-800";
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor}`}>
        {status || "Non défini"}
      </span>
    );
  };

  if (isLoading) {
    return <div className="py-4 text-center">Chargement des conteneurs...</div>;
  }

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Référence
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Origine
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Destination
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Départ
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {containers?.length > 0 ? (
              containers.map((container) => (
                <tr key={container.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {container.number || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {container.type || "N/A"} ({container.size || "N/A"})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {container.client || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {renderStatus(container.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {container.origin || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {container.destination || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(container.departureDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onEditContainer(container)}
                    >
                      Modifier
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">
                  Aucun conteneur trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ContainerCreateDialog 
        open={isCreating} 
        onOpenChange={setIsCreating} 
      />
    </>
  );
};

export default ContainersListWithCreate;
