
import React from 'react';
import { RecruitmentPost } from '@/types/recruitment';
import { Card, CardContent } from '@/components/ui/card';
import { Building, Calendar, MapPin, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface KanbanColumnProps {
  id: string;
  title: string;
  items: RecruitmentPost[];
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ id, title, items = [] }) => {
  // Ensure items is always an array
  const safeItems = Array.isArray(items) ? items : [];
  
  const getPriorityColor = (priority: string = '') => {
    const p = priority?.toLowerCase();
    if (p === 'haute' || p === 'high') return 'bg-red-100 text-red-800 border-red-200';
    if (p === 'moyenne' || p === 'medium') return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-green-100 text-green-800 border-green-200';
  };

  return (
    <div className="flex-shrink-0 w-72">
      <div className="bg-muted/30 rounded-lg p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">{title}</h3>
          <Badge variant="outline" className="bg-white">
            {safeItems.length}
          </Badge>
        </div>
        
        <div className="space-y-3">
          {safeItems.length === 0 ? (
            <Card className="bg-white/50 border-dashed">
              <CardContent className="p-3 text-center text-sm text-muted-foreground">
                Aucun poste dans cette catégorie
              </CardContent>
            </Card>
          ) : (
            safeItems.map((item) => {
              if (!item) return null; // Safety check
              
              return (
                <Card key={item.id} className="bg-white">
                  <CardContent className="p-3">
                    <h4 className="font-medium text-sm">{item.position}</h4>
                    
                    <div className="mt-2 space-y-1 text-xs">
                      {item.department && (
                        <div className="flex items-center text-muted-foreground">
                          <Building className="h-3 w-3 mr-1" />
                          <span>{item.department}</span>
                        </div>
                      )}
                      
                      {item.location && (
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{item.location}</span>
                        </div>
                      )}
                      
                      {item.openDate && (
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>Ouvert le {item.openDate}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-2 flex items-center justify-between">
                      {item.priority && (
                        <Badge className={`${getPriorityColor(item.priority)} text-xs`}>
                          {item.priority}
                        </Badge>
                      )}
                      
                      {item.candidates && (
                        <Badge variant="outline" className="text-xs">
                          {item.candidates.length || 0} candidat(s)
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default KanbanColumn;
