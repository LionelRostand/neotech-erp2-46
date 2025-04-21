
import React, { useState } from 'react';
import { Eye, Pencil, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ShipmentViewDialog from './ShipmentViewDialog';
import ShipmentEditDialog from './ShipmentEditDialog';
import ShipmentDeleteDialog from './ShipmentDeleteDialog';
import ShipmentCreateDialog from './ShipmentCreateDialog'; // Add this new dialog for creation
import useFreightData from '@/hooks/modules/useFreightData';
import { Shipment } from '@/types/freight';
import { updateShipment, deleteShipment } from './services/shipmentService';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const FreightShipmentsPage: React.FC = () => {
  const { shipments, loading } = useFreightData();

  const [viewing, setViewing] = useState<Shipment | null>(null);
  const [editing, setEditing] = useState<Shipment | null>(null);
  const [deleting, setDeleting] = useState<Shipment | null>(null);
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);

  const handleSave = async (updated: Shipment) => {
    setSaving(true);
    try {
      await updateShipment(updated.id, updated);
      toast.success('Expédition mise à jour !');
    } catch (e) {
      toast.error("Erreur lors de la mise à jour");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setRemoving(true);
    try {
      await deleteShipment(deleting.id);
      toast.success('Expédition supprimée !');
      setDeleting(null);
    } catch (e) {
      toast.error("Erreur lors de la suppression");
    } finally {
      setRemoving(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Gestion des Expéditions</h1>
        <Button 
          variant="default" 
          size="sm" 
          onClick={() => setCreating(true)}
          leftIcon={<Plus className="h-4 w-4" />}
        >
          Nouvelle Expédition
        </Button>
      </div>
      <div className="rounded-md border bg-white">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Référence</th>
              <th className="px-4 py-2 text-left">Client</th>
              <th className="px-4 py-2 text-left">Origine</th>
              <th className="px-4 py-2 text-left">Destination</th>
              <th className="px-4 py-2 text-left">Prévue</th>
              <th className="px-4 py-2 text-left">Statut</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-6">Chargement...</td>
              </tr>
            ) : shipments.length > 0 ? (
              shipments.map((shipment: Shipment) => (
                <tr key={shipment.id} className="border-t">
                  <td className="px-4 py-2">{shipment.reference}</td>
                  <td className="px-4 py-2">{shipment.customer}</td>
                  <td className="px-4 py-2">{shipment.origin}</td>
                  <td className="px-4 py-2">{shipment.destination}</td>
                  <td className="px-4 py-2">
                    {shipment.scheduledDate ? format(new Date(shipment.scheduledDate), 'dd MMM yyyy', { locale: fr }) : '-'}
                  </td>
                  <td className="px-4 py-2 capitalize">{shipment.status}</td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setViewing(shipment)}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Voir</span>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setEditing(shipment)}>
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Modifier</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600" onClick={() => setDeleting(shipment)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Supprimer</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">Aucune expédition trouvée</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Dialogs */}
      {viewing && (
        <ShipmentViewDialog isOpen={!!viewing} onClose={() => setViewing(null)} shipment={viewing} />
      )}
      {editing && (
        <ShipmentEditDialog
          isOpen={!!editing}
          onClose={() => setEditing(null)}
          shipment={editing}
          onSave={handleSave}
        />
      )}
      {deleting && (
        <ShipmentDeleteDialog
          isOpen={!!deleting}
          onClose={() => setDeleting(null)}
          shipment={deleting}
          onConfirm={handleDelete}
          isDeleting={removing}
        />
      )}
      {creating && (
        <ShipmentCreateDialog
          isOpen={creating}
          onClose={() => setCreating(false)}
          onCreated={() => {
            setCreating(false);
            toast.success("Expédition créée avec succès !");
          }}
        />
      )}
    </div>
  );
};

export default FreightShipmentsPage;
