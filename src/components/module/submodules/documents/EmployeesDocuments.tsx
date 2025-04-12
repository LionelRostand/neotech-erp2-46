
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDocumentsData } from '@/hooks/useDocumentsData';
import { format, isValid } from 'date-fns';
import { fr } from 'date-fns/locale';
import { DocumentsCalendar } from './components/DocumentsCalendar';
import DocumentsFiles from './DocumentsFiles';

const EmployeesDocuments: React.FC = () => {
  const { documents, isLoading, error } = useDocumentsData();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentView, setCurrentView] = useState('all');
  
  // Format date string safely to prevent any errors
  const safeFormatDate = (dateString: string | null | undefined): string => {
    try {
      if (!dateString) return '';
      
      // Handle problematic values
      if (dateString === 'Invalid Date' || dateString === 'NaN' || dateString === 'undefined') {
        return '';
      }
      
      // Handle numeric string timestamps
      let date: Date;
      if (/^\d+$/.test(dateString)) {
        const timestamp = parseInt(dateString, 10);
        date = new Date(timestamp);
      } else {
        // Standard date parsing
        date = new Date(dateString);
      }
      
      // Validate the date
      if (!isValid(date) || date.getFullYear() < 1900 || date.getFullYear() > 2100) {
        return '';
      }
      
      return format(date, 'MMMM yyyy', { locale: fr });
    } catch (error) {
      console.error('Error formatting date in EmployeesDocuments:', error);
      return '';
    }
  };
  
  // Safely get documents for the selected date
  const filteredDocuments = useMemo(() => {
    if (!selectedDate) return documents;
    
    return documents.filter(doc => {
      try {
        const dateStr = doc.uploadDate || doc.createdAt || doc.date;
        if (!dateStr) return false;
        
        // Try numeric timestamps first
        let docDate: Date;
        if (/^\d+$/.test(dateStr)) {
          const timestamp = parseInt(dateStr, 10);
          docDate = new Date(timestamp);
        } else {
          docDate = new Date(dateStr);
        }
        
        if (!isValid(docDate)) return false;
        
        // Compare just the date part (yyyy-mm-dd)
        return docDate.getFullYear() === selectedDate.getFullYear() &&
               docDate.getMonth() === selectedDate.getMonth() &&
               docDate.getDate() === selectedDate.getDate();
      } catch (error) {
        console.error('Error filtering document by date:', error);
        return false;
      }
    });
  }, [documents, selectedDate]);
  
  // Get the month stats
  const monthStats = useMemo(() => {
    if (!documents || documents.length === 0) return [];
    
    const monthsMap = new Map<string, number>();
    
    // Count documents by month safely
    documents.forEach(doc => {
      try {
        const dateStr = doc.uploadDate || doc.createdAt || doc.date;
        if (!dateStr) return;
        
        let docDate: Date;
        
        // Handle numeric timestamps
        if (/^\d+$/.test(dateStr)) {
          const timestamp = parseInt(dateStr, 10);
          docDate = new Date(timestamp);
        } else {
          docDate = new Date(dateStr);
        }
        
        // Validate the date
        if (!isValid(docDate) || docDate.getFullYear() < 1900 || docDate.getFullYear() > 2100) {
          return;
        }
        
        const monthKey = format(docDate, 'yyyy-MM');
        monthsMap.set(monthKey, (monthsMap.get(monthKey) || 0) + 1);
      } catch (error) {
        console.error('Error processing document date:', error);
      }
    });
    
    // Convert map to array of objects
    return Array.from(monthsMap.entries())
      .map(([monthKey, count]) => {
        try {
          const [year, month] = monthKey.split('-').map(Number);
          const date = new Date(year, month - 1);
          
          if (!isValid(date)) {
            return { month: monthKey, count, label: 'Date invalide' };
          }
          
          return {
            month: monthKey,
            count,
            label: safeFormatDate(date.toISOString())
          };
        } catch (error) {
          console.error('Error creating month stat:', error);
          return { month: monthKey, count, label: 'Date invalide' };
        }
      })
      .sort((a, b) => b.month.localeCompare(a.month))
      .slice(0, 6);
  }, [documents]);
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="md:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Documents des employés</CardTitle>
              <CardDescription>
                Consultez et gérez tous les documents relatifs à vos employés
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={currentView} onValueChange={setCurrentView}>
                <TabsList className="mb-4">
                  <TabsTrigger value="all">Tous les documents</TabsTrigger>
                  <TabsTrigger value="calendar">Calendrier</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-4">
                  <DocumentsFiles />
                </TabsContent>
                
                <TabsContent value="calendar" className="mt-4">
                  {selectedDate && (
                    <div className="mb-4 p-3 bg-muted rounded-md">
                      <p className="text-sm font-medium">
                        Documents du {format(selectedDate, 'dd MMMM yyyy', { locale: fr })}
                      </p>
                      <button 
                        className="text-xs text-primary hover:underline mt-1"
                        onClick={() => setSelectedDate(null)}
                      >
                        Voir tous les documents
                      </button>
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <DocumentsCalendar 
                      documents={documents} 
                      onSelectDate={setSelectedDate} 
                    />
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">
                      {selectedDate 
                        ? `Documents du ${format(selectedDate, 'dd MMMM yyyy', { locale: fr })}` 
                        : 'Tous les documents'}
                    </h3>
                    
                    {filteredDocuments.length === 0 ? (
                      <p className="text-muted-foreground text-sm">Aucun document trouvé pour cette date</p>
                    ) : (
                      <div className="space-y-2">
                        {filteredDocuments.map(doc => (
                          <div key={doc.id} className="p-3 border rounded-md hover:bg-muted/20">
                            <div className="font-medium">{doc.title}</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              {doc.type} • {doc.uploadDate}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Documents par mois</CardTitle>
              <CardDescription>Répartition des documents par mois</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-60">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                </div>
              ) : monthStats.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-60 text-center text-muted-foreground">
                  <p>Aucune donnée disponible</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {monthStats.map(stat => (
                    <div key={stat.month} className="flex items-center">
                      <div className="w-36 text-sm">{stat.label}</div>
                      <div className="flex-1">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary"
                            style={{ 
                              width: `${Math.min(100, (stat.count / Math.max(...monthStats.map(s => s.count))) * 100)}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-10 text-right text-sm font-medium">{stat.count}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Types de documents</CardTitle>
              <CardDescription>Répartition par catégorie</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                </div>
              ) : documents.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-center text-muted-foreground">
                  <p>Aucune donnée disponible</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(
                    documents.reduce<Record<string, number>>((acc, doc) => {
                      const type = doc.type || 'Autre';
                      acc[type] = (acc[type] || 0) + 1;
                      return acc;
                    }, {})
                  )
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([type, count]) => (
                      <div key={type} className="flex items-center">
                        <div className="w-32 truncate text-sm" title={type}>
                          {type}
                        </div>
                        <div className="flex-1">
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary"
                              style={{ 
                                width: `${(count / documents.length) * 100}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                        <div className="w-10 text-right text-sm font-medium">{count}</div>
                      </div>
                    ))
                  }
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EmployeesDocuments;
