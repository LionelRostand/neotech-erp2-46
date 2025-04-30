
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/module/submodules/StatusBadge";
import { useLeaveData } from '@/hooks/useLeaveData';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CreateLeaveDialog from './CreateLeaveDialog';
import SubmoduleHeader from '../SubmoduleHeader';
import { LeaveActionMenu } from './components/LeaveActionMenu';

const EmployeesLeaves: React.FC = () => {
  const { leaves = [], stats = { total: 0, pending: 0, approved: 0, rejected: 0 }, isLoading, updateLeaveStatus } = useLeaveData();
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Make sure leaves is always an array, even if undefined
  const safeLeaves = Array.isArray(leaves) ? leaves : [];

  // Define columns with safe rendering
  const columns = [
    {
      header: "Employé",
      accessorKey: "employeeName",
      cell: ({ row }) => {
        const employeeName = row.original?.employeeName || "Employé inconnu";
        const photoURL = row.original?.employeePhoto || "";
        const initials = employeeName
          .split(' ')
          .map(n => n[0])
          .join('')
          .toUpperCase();
          
        return (
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={photoURL} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span>{employeeName}</span>
          </div>
        );
      }
    },
    {
      header: "Type",
      accessorKey: "type",
    },
    {
      header: "Date de début",
      accessorKey: "startDate",
    },
    {
      header: "Date de fin",
      accessorKey: "endDate",
    },
    {
      header: "Jours",
      accessorKey: "days",
    },
    {
      header: "Statut",
      accessorKey: "status",
      cell: ({ row }) => {
        const status = row.original?.status || "pending";
        let variant = "default";
        
        if (status === "Approuvé" || status === "approved") variant = "success";
        if (status === "En attente" || status === "pending") variant = "warning";
        if (status === "Refusé" || status === "rejected") variant = "destructive";
        
        return <StatusBadge status={status} variant={variant}>{status}</StatusBadge>;
      }
    },
    {
      header: "Actions",
      id: "actions",
      cell: ({ row }) => {
        return (
          <LeaveActionMenu 
            leave={row.original} 
            onStatusChange={updateLeaveStatus}
          />
        );
      }
    }
  ];

  return (
    <div className="container mx-auto py-4 space-y-6">
      <SubmoduleHeader
        title="Gestion des congés"
        description="Gérez les congés et absence du personnel"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total des demandes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">En attente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{stats.pending || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Approuvés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.approved || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Refusés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.rejected || 0}</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Demandes de congés</h2>
        <Button onClick={() => setDialogOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Nouvelle demande
        </Button>
      </div>
      
      <DataTable
        columns={columns}
        data={safeLeaves}
        isLoading={isLoading}
        emptyMessage="Aucune demande de congé trouvée"
      />
      
      <CreateLeaveDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSuccess={() => {
          // Custom success handling if needed
        }}
      />
    </div>
  );
};

export default EmployeesLeaves;
