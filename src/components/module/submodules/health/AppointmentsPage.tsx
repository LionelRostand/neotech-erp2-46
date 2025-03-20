
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarIcon, Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import AppointmentsTable from './components/AppointmentsTable';
import AppointmentCalendar from './components/AppointmentCalendar';
import NewAppointmentForm from './components/NewAppointmentForm';

const AppointmentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('view');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<'list' | 'calendar'>('list');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Gestion des Rendez-vous</h2>
        <div className="flex gap-2">
          {activeTab === 'view' && (
            <>
              <div className="flex items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="flex h-10 gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, 'P', { locale: fr })
                      ) : (
                        <span>Sélectionner une date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                
                <div className="flex bg-muted rounded-md p-1">
                  <Button 
                    variant={view === 'list' ? 'default' : 'ghost'} 
                    size="sm" 
                    onClick={() => setView('list')}
                  >
                    Liste
                  </Button>
                  <Button 
                    variant={view === 'calendar' ? 'default' : 'ghost'} 
                    size="sm" 
                    onClick={() => setView('calendar')}
                  >
                    Calendrier
                  </Button>
                </div>
              </div>
              
              <Button 
                onClick={() => setActiveTab('new')}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouveau Rendez-vous
              </Button>
            </>
          )}
          {activeTab === 'new' && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setActiveTab('view')}
            >
              Retour aux rendez-vous
            </Button>
          )}
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="hidden">
          <TabsTrigger value="view">Rendez-vous</TabsTrigger>
          <TabsTrigger value="new">Nouveau Rendez-vous</TabsTrigger>
        </TabsList>
        
        <TabsContent value="view" className="space-y-4">
          {view === 'list' && (
            <div className="flex items-center gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un rendez-vous..."
                  className="pl-8"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <Card>
            <CardContent className="pt-6">
              {view === 'list' ? (
                <AppointmentsTable />
              ) : (
                <AppointmentCalendar selectedDate={selectedDate} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="new">
          <Card>
            <CardContent className="pt-6">
              <NewAppointmentForm onSuccess={() => setActiveTab('view')} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppointmentsPage;
