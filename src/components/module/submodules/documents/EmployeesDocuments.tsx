import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDocumentsData } from '@/hooks/useDocumentsData';
import { DocumentsCalendar } from './components/DocumentsCalendar';
import { format, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DocumentsTable } from './components/DocumentsTable';
import { DocumentsTabs } from './components/DocumentsTabs';

const EmployeesDocuments = () => {
  const { documents, stats, isLoading } = useDocumentsData();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  // Safe date parser
  const safeParseDate = (dateStr: string | undefined): Date | null => {
    if (!dateStr) return null;
    
    try {
      // Check if it's already in DD/MM/YYYY format
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
        const [day, month, year] = dateStr.split('/').map(Number);
        const parsedDate = new Date(year, month - 1, day);
        return !isNaN(parsedDate.getTime()) ? parsedDate : null;
      }
      
      // Otherwise try standard parsing
      const date = new Date(dateStr);
      return !isNaN(date.getTime()) ? date : null;
    } catch (e) {
      console.warn('Error parsing date:', dateStr, e);
      return null;
    }
  };
  
  // Safe format function that won't throw
  const safeFormat = (date: Date | null, formatString: string): string => {
    if (!date || !isValid(date)) return '';
    
    try {
      return format(date, formatString, { locale: fr });
    } catch (e) {
      console.error('Error formatting date:', e);
      return '';
    }
  };
  
  // Filter documents by selected date
  const filteredDocuments = useMemo(() => {
    if (!selectedDate) return documents;
    
    return documents.filter(doc => {
      const docDate = safeParseDate(doc.uploadDate);
      if (!docDate) return false;
      
      try {
        const selectedDateStr = safeFormat(selectedDate, 'yyyy-MM-dd');
        const docDateStr = safeFormat(docDate, 'yyyy-MM-dd');
        
        return selectedDateStr === docDateStr;
      } catch (e) {
        console.error('Error comparing dates:', e);
        return false;
      }
    });
  }, [documents, selectedDate]);
  
  // Group documents by type - using a safer implementation
  const documentsByType = useMemo(() => {
    try {
      return filteredDocuments.reduce((acc, doc) => {
        const type = doc.type || 'Autre';
        if (!acc[type]) {
          acc[type] = [];
        }
        acc[type].push(doc);
        return acc;
      }, {} as Record<string, typeof documents>);
    } catch (error) {
      console.error('Error grouping documents by type:', error);
      return {};
    }
  }, [filteredDocuments]);
  
  // Get document types in order
  const documentTypes = useMemo(() => {
    return Object.keys(documentsByType).sort();
  }, [documentsByType]);
  
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };
  
  const clearDateFilter = () => {
    setSelectedDate(null);
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Documents RH</CardTitle>
              <CardDescription>
                Gestion centralisée des documents des employés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DocumentsTabs 
                documents={filteredDocuments} 
                documentsByType={documentsByType} 
                documentTypes={documentTypes}
                isLoading={isLoading}
                selectedDate={selectedDate}
                onClearDateFilter={clearDateFilter}
              />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Calendrier</CardTitle>
              <CardDescription>
                Documents par date
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DocumentsCalendar 
                documents={documents} 
                onSelectDate={handleDateSelect} 
              />
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Statistiques</CardTitle>
                <CardDescription>
                  Aperçu des documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total des documents</span>
                    <span className="text-sm font-bold">{stats.total}</span>
                  </div>
                  
                  <div className="h-px bg-border my-2" />
                  
                  {Object.entries(stats.byType).map(([type, count]) => (
                    <div key={type} className="flex justify-between items-center">
                      <span className="text-sm">{type}</span>
                      <span className="text-sm">{count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeesDocuments;
