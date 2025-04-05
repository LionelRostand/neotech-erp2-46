
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Insurance {
  id: string;
  name: string;
  type: string;
  coverage: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  status: 'active' | 'inactive' | 'pending';
}

interface InsuranceGridProps {
  insurances: Insurance[];
  onView: (insurance: Insurance) => void;
  onEdit: (insurance: Insurance) => void;
  onDelete: (insurance: Insurance) => void;
}

const InsuranceGrid: React.FC<InsuranceGridProps> = ({
  insurances,
  onView,
  onEdit,
  onDelete
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'inactive':
        return <Badge className="bg-red-500">Inactive</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500">En attente</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
      {insurances.map(insurance => (
        <Card key={insurance.id} className="overflow-hidden">
          <CardHeader className="p-4 pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{insurance.name}</CardTitle>
              {getStatusBadge(insurance.status)}
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-2 mt-2">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Type:</span> {insurance.type}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Couverture:</span> {insurance.coverage}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Contact:</span> {insurance.contactName}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Email:</span> {insurance.contactEmail}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Téléphone:</span> {insurance.contactPhone}
              </p>
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0 flex justify-end gap-2">
            <Button size="sm" variant="ghost" onClick={() => onView(insurance)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onEdit(insurance)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onDelete(insurance)}>
              <Trash className="h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default InsuranceGrid;
