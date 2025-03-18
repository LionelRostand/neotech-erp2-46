
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const CongesTab: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-6">Congés</h3>
        <p className="text-gray-500">Cet employé dispose de 25 jours de congés restants pour l'année en cours.</p>
        <p className="text-sm text-gray-400 mt-4">Fonctionnalité en cours de développement.</p>
      </CardContent>
    </Card>
  );
};

export default CongesTab;
