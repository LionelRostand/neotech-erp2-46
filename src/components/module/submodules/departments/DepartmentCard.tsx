
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DepartmentCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const DepartmentCard: React.FC<DepartmentCardProps> = ({ title, children, className }) => {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};

export default DepartmentCard;
