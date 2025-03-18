
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { formatPackageStatus } from '../utils/statusUtils';

interface PackageStatusBadgeProps {
  status: string;
}

const PackageStatusBadge: React.FC<PackageStatusBadgeProps> = ({ status }) => {
  const colorMap: Record<string, string> = {
    delivered: "bg-green-100 text-green-800",
    shipped: "bg-blue-100 text-blue-800",
    ready: "bg-purple-100 text-purple-800",
    draft: "bg-gray-100 text-gray-800",
    returned: "bg-amber-100 text-amber-800",
    lost: "bg-red-100 text-red-800",
    exception: "bg-red-100 text-red-800",
    delayed: "bg-amber-100 text-amber-800",
    in_transit: "bg-blue-100 text-blue-800",
    processing: "bg-purple-100 text-purple-800",
    registered: "bg-gray-100 text-gray-800",
    out_for_delivery: "bg-teal-100 text-teal-800"
  };

  const color = colorMap[status] || "bg-gray-100 text-gray-800";

  return (
    <Badge variant="outline" className={`${color} border-none font-medium px-3 py-1`}>
      {formatPackageStatus(status)}
    </Badge>
  );
};

export default PackageStatusBadge;
