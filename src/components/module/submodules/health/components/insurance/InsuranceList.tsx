import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Eye, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useCollectionData } from '@/hooks/useCollectionData';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { formatCurrency, formatDate } from '@/lib/formatters';
import ViewInsuranceDialog from './ViewInsuranceDialog';
import EditInsuranceDialog from './EditInsuranceDialog';
import DeleteInsuranceDialog from './DeleteInsuranceDialog';

interface InsuranceListProps {
  data: any[];
  isLoading: boolean;
  error: any;
  filters: {
    type: string;
    status: string;
    provider: string;
  };
}

const InsuranceList: React.FC<InsuranceListProps> = ({ data, isLoading, error, filters }) => {
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedInsurance, setSelectedInsurance] = useState<any>(null);
  
  // Get insurance providers
  const { 
    data: providers 
  } = useCollectionData(
    COLLECTIONS.HEALTH.INSURANCE, // Use the correct path
    []
  );

  const filteredData = data.filter(item => {
    const typeMatch = filters.type === 'all' || item.type === filters.type;
    const statusMatch = filters.status === 'all' || item.status === filters.status;
    const providerMatch = filters.provider === 'all' || item.provider === filters.provider;
    return typeMatch && statusMatch && providerMatch;
  });

  const handleView = (insurance: any) => {
    setSelectedInsurance(insurance);
    setViewDialogOpen(true);
  };

  const handleEdit = (insurance: any) => {
    setSelectedInsurance(insurance);
    setEditDialogOpen(true);
  };

  const handleDelete = (insurance: any) => {
    setSelectedInsurance(insurance);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedInsurance) return;

    try {
      const insuranceRef = doc(db, COLLECTIONS.HEALTH.INSURANCE, selectedInsurance.id);
      await deleteDoc(insuranceRef);
      toast.success('Insurance deleted successfully!');
    } catch (error: any) {
      toast.error(`Failed to delete insurance: ${error.message}`);
    } finally {
      setDeleteDialogOpen(false);
      setSelectedInsurance(null);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!data || data.length === 0) {
    return <p>No insurance policies found.</p>;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Policy Number</TableHead>
            <TableHead>Patient Name</TableHead>
            <TableHead>Coverage Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.map((insurance) => (
            <TableRow key={insurance.id}>
              <TableCell>{insurance.type}</TableCell>
              <TableCell>{insurance.provider}</TableCell>
              <TableCell>{insurance.policyNumber}</TableCell>
              <TableCell>{insurance.patientName}</TableCell>
              <TableCell>{formatCurrency(insurance.coverageAmount)}</TableCell>
              <TableCell>
                <Badge variant={insurance.status === 'active' ? 'default' : 'secondary'}>
                  {insurance.status}
                </Badge>
              </TableCell>
              <TableCell>{formatDate(insurance.startDate)}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleView(insurance)}>
                      <Eye className="mr-2 h-4 w-4" /> View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEdit(insurance)}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(insurance)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ViewInsuranceDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        insurance={selectedInsurance}
      />
      <EditInsuranceDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        insurance={selectedInsurance}
      />
      <DeleteInsuranceDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        insurance={selectedInsurance}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default InsuranceList;
