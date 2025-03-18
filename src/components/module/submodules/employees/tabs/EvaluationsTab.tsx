
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

const EvaluationsTab: React.FC = () => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-6">Évaluations</h3>
        <p className="text-gray-500">Dernière évaluation réalisée le 15/12/2022.</p>
        <p className="text-sm text-gray-400 mt-4">Fonctionnalité en cours de développement.</p>
      </CardContent>
    </Card>
  );
};

export default EvaluationsTab;
