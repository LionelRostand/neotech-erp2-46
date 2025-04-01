
import React, { useState } from 'react';
import { Package } from '@/types/freight';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Clock, ArrowRight } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import StatusBadge from '@/components/StatusBadge';
import { formatPackageStatus, getStatusColor } from './utils/statusUtils';
import { mockPackages } from '../mockPackages';

interface TrackingHistoryProps {
  onPackageSelect: (packageData: Package) => void;
}

const TrackingHistory: React.FC<TrackingHistoryProps> = ({ onPackageSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter packages based on search term
  const filteredPackages = mockPackages.filter(pkg => 
    pkg.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (pkg.trackingNumber && pkg.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (pkg.description && pkg.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  // Take only the 5 most recent packages for display
  const recentPackages = [...filteredPackages]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Historique de suivi
        </CardTitle>
        <CardDescription>
          Recherchez dans l'historique des colis précédemment suivis
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher par référence ou numéro de suivi"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Référence</TableHead>
                  <TableHead>N° de suivi</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPackages.length > 0 ? (
                  recentPackages.map((pkg) => (
                    <TableRow key={pkg.id}>
                      <TableCell className="font-medium">{pkg.reference}</TableCell>
                      <TableCell>{pkg.trackingNumber || '-'}</TableCell>
                      <TableCell>
                        {format(new Date(pkg.createdAt), 'dd MMM yyyy', { locale: fr })}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={getStatusColor(pkg.status)}>
                          {formatPackageStatus(pkg.status)}
                        </StatusBadge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => onPackageSelect(pkg)}>
                          Voir <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Aucun résultat trouvé.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrackingHistory;
