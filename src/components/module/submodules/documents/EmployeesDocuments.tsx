
import React, { useState } from 'react';
import DocumentsFiles from './DocumentsFiles';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDocumentsData } from '@/hooks/useDocumentsData';
import { FrenchDatePicker } from './components/FrenchDatePicker';
import DocumentsCalendar from './components/DocumentsCalendar';

const EmployeesDocuments: React.FC = () => {
  const { documents, stats, isLoading } = useDocumentsData();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [currentView, setCurrentView] = useState<'files' | 'calendar'>('files');

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    // Si nous avons une date sélectionnée dans le calendrier, passons à la vue fichiers
    if (date) {
      setCurrentView('files');
    }
  };

  // Filtrer les documents par date sélectionnée si nécessaire
  const filteredDocuments = selectedDate 
    ? documents.filter(doc => {
        if (!doc.uploadDate) return false;
        try {
          const docDate = new Date(doc.uploadDate);
          return (
            docDate.getDate() === selectedDate.getDate() &&
            docDate.getMonth() === selectedDate.getMonth() &&
            docDate.getFullYear() === selectedDate.getFullYear()
          );
        } catch (e) {
          return false;
        }
      })
    : documents;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Documents RH</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Statistiques</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Documents totaux:</span>
                  <span className="font-medium">{stats.total}</span>
                </div>
                
                {Object.entries(stats.byType).map(([type, count]) => (
                  <div key={type} className="flex justify-between items-center text-sm">
                    <span>{type}:</span>
                    <span className="font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-4">
            <FrenchDatePicker 
              date={selectedDate}
              onSelect={handleDateSelect}
              placeholder="Filtrer par date"
            />
          </div>
          
          <div className="mt-4 hidden lg:block">
            <DocumentsCalendar onDateSelect={handleDateSelect} />
          </div>
        </div>
        
        <div className="lg:col-span-3">
          <Tabs defaultValue="files" className="w-full" onValueChange={(value) => setCurrentView(value as 'files' | 'calendar')}>
            <TabsList className="mb-4">
              <TabsTrigger value="files">Documents</TabsTrigger>
              <TabsTrigger value="calendar">Calendrier</TabsTrigger>
            </TabsList>
            
            <TabsContent value="files">
              <DocumentsFiles />
            </TabsContent>
            
            <TabsContent value="calendar" className="block lg:hidden">
              <DocumentsCalendar onDateSelect={handleDateSelect} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default EmployeesDocuments;
