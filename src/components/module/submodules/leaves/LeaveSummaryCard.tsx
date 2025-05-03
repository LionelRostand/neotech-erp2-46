
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface LeaveSummaryCardProps {
  title: string;
  count: number;
  status: 'pending' | 'approved' | 'rejected' | 'canceled';
}

const LeaveSummaryCard: React.FC<LeaveSummaryCardProps> = ({ title, count, status }) => {
  const statusColors = {
    pending: 'bg-yellow-500',
    approved: 'bg-green-500',
    rejected: 'bg-red-500',
    canceled: 'bg-gray-500',
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold">{count}</p>
          </div>
          <div className={`w-3 h-12 ${statusColors[status]} rounded-full`} />
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaveSummaryCard;
