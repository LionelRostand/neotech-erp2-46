
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Eye, Pencil, Trash2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import { Avatar } from '@/components/ui/avatar';
import { AvatarImage } from '@/components/ui/avatar';
import { AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { updateLeaveRequestStatus, deleteLeaveRequest } from './services/leaveService';
import ViewLeaveDialog from './ViewLeaveDialog';
import EditLeaveDialog from './EditLeaveDialog';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { getInitials } from '@/lib/utils';

const LeaveRequestsTable = ({ leaveRequests, isLoading, onSuccess }) => {
  const navigate = useNavigate();
  const { employees } = useHrModuleData();

  // State for dialogs
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLeaveRequest, setSelectedLeaveRequest] = useState(null);

  // Status badge colors
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    canceled: "bg-gray-100 text-gray-800"
  };

  // Type badge colors
  const typeColors = {
    paid: "bg-blue-100 text-blue-800",
    unpaid: "bg-purple-100 text-purple-800",
    sick: "bg-orange-100 text-orange-800",
    maternity: "bg-pink-100 text-pink-800",
    paternity: "bg-indigo-100 text-indigo-800",
    other: "bg-teal-100 text-teal-800"
  };

  // Handle view leave request
  const handleView = (request) => {
    setSelectedLeaveRequest(request);
    setViewDialogOpen(true);
  };

  // Handle edit leave request
  const handleEdit = (request) => {
    setSelectedLeaveRequest(request);
    setEditDialogOpen(true);
  };

  // Handle delete leave request
  const handleDeleteClick = (request) => {
    setSelectedLeaveRequest(request);
    setDeleteDialogOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (selectedLeaveRequest) {
      try {
        await deleteLeaveRequest(selectedLeaveRequest.id);
        toast.success("Demande de congé supprimée avec succès");
        setDeleteDialogOpen(false);
        onSuccess();
      } catch (error) {
        console.error("Error deleting leave request:", error);
        toast.error("Échec de la suppression de la demande");
      }
    }
  };

  // Handle approve leave request
  const handleApprove = async (request) => {
    try {
      await updateLeaveRequestStatus(request.id, 'approved');
      toast.success("Demande de congé approuvée");
      onSuccess();
    } catch (error) {
      console.error("Error approving leave request:", error);
      toast.error("Échec de l'approbation de la demande");
    }
  };

  // Handle reject leave request
  const handleReject = async (request) => {
    try {
      await updateLeaveRequestStatus(request.id, 'rejected');
      toast.success("Demande de congé rejetée");
      onSuccess();
    } catch (error) {
      console.error("Error rejecting leave request:", error);
      toast.error("Échec du rejet de la demande");
    }
  };

  // Find employee name
  const findEmployeeName = (employeeId) => {
    const employee = employees.find((emp) => emp.id === employeeId);
    return employee ? `${employee.firstName} ${employee.lastName}` : "Employé inconnu";
  };

  // Format date safely
  const formatDateSafely = (dateStr) => {
    if (!dateStr) return "Date invalide";
    try {
      return format(new Date(dateStr), 'dd/MM/yyyy', {
        locale: fr
      });
    } catch (err) {
      console.error("Date parsing error:", err);
      return "Date invalide";
    }
  };

  // Find employee photo
  const findEmployeePhoto = (employeeId) => {
    const employee = employees.find((emp) => emp.id === employeeId);
    return employee?.photoURL || employee?.photo || '';
  };

  const columns = [
    {
      header: "Employé",
      accessorKey: "employeeId",
      cell: ({ row }) => {
        const employeeId = row.original.employeeId;
        const employeeName = findEmployeeName(employeeId);
        const photoURL = findEmployeePhoto(employeeId);
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              {photoURL ? (
                <AvatarImage src={photoURL} alt={employeeName} />
              ) : (
                <AvatarFallback>{getInitials(employeeName)}</AvatarFallback>
              )}
            </Avatar>
            <span>{employeeName}</span>
          </div>
        );
      }
    },
    {
      header: "Type",
      accessorKey: "type",
      cell: ({ row }) => {
        const type = row.original.type;
        const typeLabel = {
          paid: "Congé payé",
          unpaid: "Sans solde",
          sick: "Maladie",
          maternity: "Maternité",
          paternity: "Paternité",
          other: "Autre"
        }[type] || type;
        const colorClass = typeColors[type] || "bg-gray-100 text-gray-800";
        return <Badge className={colorClass}>{typeLabel}</Badge>;
      }
    },
    {
      header: "Date de début",
      accessorKey: "startDate",
      cell: ({ row }) => {
        return formatDateSafely(row.original.startDate);
      }
    },
    {
      header: "Date de fin",
      accessorKey: "endDate",
      cell: ({ row }) => {
        return formatDateSafely(row.original.endDate);
      }
    },
    {
      header: "Durée",
      cell: ({ row }) => {
        const request = row.original;
        // Check if both dates exist before calculating duration
        if (!request.startDate || !request.endDate) {
          return "N/A";
        }
        try {
          const start = new Date(request.startDate);
          const end = new Date(request.endDate);
          const diffTime = end.getTime() - start.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 because inclusive
          return `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
        } catch (error) {
          console.error("Error calculating duration:", error);
          return "N/A";
        }
      }
    },
    {
      header: "Statut",
      accessorKey: "status",
      cell: ({ row }) => {
        const status = row.original.status;
        const statusLabel = {
          pending: "En attente",
          approved: "Approuvé",
          rejected: "Rejeté",
          canceled: "Annulé"
        }[status] || status;
        const colorClass = statusColors[status] || "bg-gray-100 text-gray-800";
        return <Badge className={colorClass}>{statusLabel}</Badge>;
      }
    },
    {
      header: "Actions",
      cell: ({ row }) => {
        const request = row.original;
        const isPending = request.status === 'pending';
        return (
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={() => handleView(request)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleEdit(request)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(request)}>
              <Trash2 className="h-4 w-4" />
            </Button>
            {isPending && (
              <>
                <Button variant="ghost" size="icon" className="text-green-600" onClick={() => handleApprove(request)}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-red-600" onClick={() => handleReject(request)}>
                  <X className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        );
      }
    }
  ];

  // Process leave requests for sorting
  const processedLeaveRequests = leaveRequests.map((request) => {
    // Ensure startDate and endDate are valid before processing
    let sortableStartDate, sortableEndDate;
    try {
      sortableStartDate = request.startDate ? new Date(request.startDate).toISOString() : null;
    } catch (e) {
      sortableStartDate = null;
    }
    try {
      sortableEndDate = request.endDate ? new Date(request.endDate).toISOString() : null;
    } catch (e) {
      sortableEndDate = null;
    }
    return {
      ...request,
      sortableStartDate,
      sortableEndDate
    };
  });

  return (
    <div>
      <DataTable 
        columns={columns} 
        data={processedLeaveRequests} 
        isLoading={isLoading}
        emptyMessage="Aucune demande de congé trouvée"
      />
      
      {selectedLeaveRequest && (
        <ViewLeaveDialog
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
          leaveRequest={selectedLeaveRequest}
        />
      )}
      
      {selectedLeaveRequest && (
        <EditLeaveDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          leaveRequest={selectedLeaveRequest}
          onSuccess={() => {
            setEditDialogOpen(false);
            onSuccess();
          }}
        />
      )}
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette demande de congé ? Cette action ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-600 hover:bg-red-700">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LeaveRequestsTable;
