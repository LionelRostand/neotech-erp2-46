
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, X, Search, FileText, Calendar, Clock } from 'lucide-react';
import { useLeaveData } from '@/hooks/useLeaveData';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import LeaveDetailsDialog from './LeaveDetailsDialog';

interface LeaveRequestsListProps {
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const LeaveRequestsList: React.FC<LeaveRequestsListProps> = ({ 
  onApprove, 
  onReject 
}) => {
  const { leaves, isLoading } = useLeaveData();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  
  // Filter leaves based on search query and status
  const filteredLeaves = React.useMemo(() => {
    if (!leaves) return [];
    
    return leaves.filter(leave => {
      // Status filter
      if (statusFilter !== 'all') {
        const normalizedStatus = statusFilter.toLowerCase();
        const leaveStatus = leave.status.toLowerCase();
        
        if (normalizedStatus === 'approved' && 
            !(leaveStatus === 'approved' || leaveStatus === 'approuvé')) {
          return false;
        }
        
        if (normalizedStatus === 'rejected' && 
            !(leaveStatus === 'rejected' || leaveStatus === 'refusé')) {
          return false;
        }
        
        if (normalizedStatus === 'pending' && 
            !(leaveStatus === 'pending' || leaveStatus === 'en attente')) {
          return false;
        }
      }
      
      // Search query filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        return (
          leave.employeeName.toLowerCase().includes(query) ||
          leave.type.toLowerCase().includes(query) ||
          leave.department.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  }, [leaves, searchQuery, statusFilter]);
  
  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower.includes('approved') || statusLower.includes('approuvé')) {
      return <Badge className="bg-green-100 text-green-800">Approuvé</Badge>;
    }
    if (statusLower.includes('rejected') || statusLower.includes('refusé')) {
      return <Badge className="bg-red-100 text-red-800">Refusé</Badge>;
    }
    return <Badge className="bg-amber-100 text-amber-800">En attente</Badge>;
  };
  
  const getInitials = (name: string) => {
    try {
      return name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase();
    } catch (e) {
      return 'U';
    }
  };
  
  const handleOpenDetails = (leave) => {
    setSelectedLeave(leave);
    setIsDetailsDialogOpen(true);
  };
  
  const handleCloseDetails = () => {
    setIsDetailsDialogOpen(false);
    setSelectedLeave(null);
  };
  
  // Check if a leave is in pending status
  const isPending = (status: string) => {
    const statusLower = status.toLowerCase();
    return statusLower === 'pending' || statusLower === 'en attente';
  };
  
  if (isLoading) {
    return (
      <div className="text-center py-6">
        <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" role="status"></div>
        <p className="mt-2 text-sm text-gray-600">Chargement des demandes...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Rechercher..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select 
          value={statusFilter} 
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="approved">Approuvé</SelectItem>
            <SelectItem value="rejected">Refusé</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {filteredLeaves.length === 0 ? (
        <div className="text-center py-10 border rounded-md">
          <FileText className="h-10 w-10 mx-auto text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-900">Aucune demande trouvée</h3>
          <p className="text-gray-500 mt-1">
            {searchQuery || statusFilter !== 'all' 
              ? "Aucune demande ne correspond à vos critères de recherche." 
              : "Aucune demande de congé n'a été soumise."}
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employé</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Période</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Demande</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeaves.map(leave => (
                <TableRow key={leave.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        {leave.employeePhoto ? (
                          <AvatarImage src={leave.employeePhoto} alt={leave.employeeName} />
                        ) : null}
                        <AvatarFallback>{getInitials(leave.employeeName)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{leave.employeeName}</div>
                        <div className="text-xs text-gray-500">{leave.department}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{leave.type}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <div>
                        <div className="text-sm">
                          {leave.startDate} - {leave.endDate}
                        </div>
                        <div className="text-xs text-gray-500">
                          {leave.days} jour{leave.days > 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(leave.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      <span className="text-sm">{leave.requestDate}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {isPending(leave.status) ? (
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => onApprove(leave.id)}
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <Check className="h-4 w-4 mr-1" /> Approuver
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => onReject(leave.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="h-4 w-4 mr-1" /> Refuser
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleOpenDetails(leave)}
                      >
                        <FileText className="h-4 w-4 mr-1" /> Détails
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      <LeaveDetailsDialog 
        isOpen={isDetailsDialogOpen}
        onClose={handleCloseDetails}
        leave={selectedLeave}
      />
    </div>
  );
};

export default LeaveRequestsList;
