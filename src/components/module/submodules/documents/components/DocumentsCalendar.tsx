
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { fr } from 'date-fns/locale';
import { useDocumentsData } from '@/hooks/useDocumentsData';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface DocumentsCalendarProps {
  onDateSelect?: (date: Date) => void;
}

const DocumentsCalendar: React.FC<DocumentsCalendarProps> = ({ onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { documents } = useDocumentsData();
  
  // Créer une liste de dates où des documents existent
  const documentDates = React.useMemo(() => {
    return documents.reduce((dates: Date[], doc) => {
      if (doc.uploadDate) {
        try {
          // Essayer de convertir la chaîne de date en objet Date
          const dateStr = doc.uploadDate;
          const date = new Date(dateStr);
          
          // Vérifier si la date est valide
          if (!isNaN(date.getTime())) {
            dates.push(date);
          }
        } catch (error) {
          console.error('Erreur lors de la conversion de la date:', error);
        }
      }
      return dates;
    }, []);
  }, [documents]);

  // Fonction pour compter le nombre de documents par date
  const getDocumentCountForDate = (date: Date): number => {
    return documentDates.filter(docDate => 
      docDate.getDate() === date.getDate() && 
      docDate.getMonth() === date.getMonth() && 
      docDate.getFullYear() === date.getFullYear()
    ).length;
  };

  const handleSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date && onDateSelect) {
      onDateSelect(date);
    }
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Calendrier des Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleSelect}
          locale={fr}
          className="rounded-md border"
          components={{
            DayContent: ({ date, ...props }) => {
              const count = getDocumentCountForDate(date);
              return (
                <div className="relative w-full h-full flex items-center justify-center">
                  <div {...props} />
                  {count > 0 && (
                    <Badge 
                      variant="secondary" 
                      className="absolute -bottom-1 -right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
                    >
                      {count}
                    </Badge>
                  )}
                </div>
              );
            },
          }}
        />
        
        {selectedDate && (
          <div className="mt-4 text-sm">
            <h3 className="font-medium">
              Documents du {format(selectedDate, 'dd MMMM yyyy', { locale: fr })}
            </h3>
            <div className="mt-2">
              {documents
                .filter(doc => {
                  try {
                    if (!doc.uploadDate) return false;
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
                .map(doc => (
                  <div key={doc.id} className="py-1 border-b last:border-0">
                    {doc.title}
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentsCalendar;
