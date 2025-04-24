
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Link } from 'react-router-dom';

interface DataCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  link?: string;
}

export const DataCard: React.FC<DataCardProps> = ({ title, value, icon, link }) => {
  const content = (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className="p-2 bg-primary/10 rounded-full">
        {icon}
      </div>
    </div>
  );

  if (link) {
    return (
      <Link to={link} className="block hover:opacity-80 transition-opacity">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            {content}
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        {content}
      </CardContent>
    </Card>
  );
};
