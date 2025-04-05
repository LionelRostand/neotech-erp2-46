
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface PayslipFiltersProps {
  employees: { id: string; name: string }[];
  onFilterChange: (filters: any) => void;
  filters: {
    employee: string | null;
    month: Date | null;
    status: string | null;
  };
  setFilters: React.Dispatch<React.SetStateAction<{
    employee: string | null;
    month: Date | null;
    status: string | null;
  }>>;
}

const PayslipFilters: React.FC<PayslipFiltersProps> = ({
  employees,
  onFilterChange,
  filters,
  setFilters
}) => {
  const [calendarOpen, setCalendarOpen] = React.useState(false);

  const handleEmployeeChange = (value: string) => {
    const newFilters = {
      ...filters,
      employee: value === 'all' ? null : value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleMonthChange = (date: Date | undefined) => {
    if (date) {
      const newFilters = {
        ...filters,
        month: date
      };
      setFilters(newFilters);
      onFilterChange(newFilters);
      setCalendarOpen(false);
    }
  };

  const handleStatusChange = (value: string) => {
    const newFilters = {
      ...filters,
      status: value === 'all' ? null : value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      employee: null,
      month: null,
      status: null
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
      <Select
        value={filters.employee || 'all'}
        onValueChange={handleEmployeeChange}
      >
        <SelectTrigger className="w-full md:w-48">
          <SelectValue placeholder="Tous les employés" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les employés</SelectItem>
          {employees.map(employee => (
            <SelectItem key={employee.id} value={employee.id}>
              {employee.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full md:w-auto justify-start text-left font-normal"
            onClick={() => setCalendarOpen(true)}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {filters.month ? (
              format(filters.month, 'MMMM yyyy', { locale: fr })
            ) : (
              "Tous les mois"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="month"
            selected={filters.month || undefined}
            onSelect={handleMonthChange}
            initialFocus
            locale={fr}
          />
        </PopoverContent>
      </Popover>

      <Select
        value={filters.status || 'all'}
        onValueChange={handleStatusChange}
      >
        <SelectTrigger className="w-full md:w-40">
          <SelectValue placeholder="Tout statut" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous</SelectItem>
          <SelectItem value="paid">Payée</SelectItem>
          <SelectItem value="pending">En attente</SelectItem>
          <SelectItem value="draft">Brouillon</SelectItem>
        </SelectContent>
      </Select>

      <Button variant="outline" size="sm" onClick={handleReset} className="ml-auto">
        <Filter className="mr-2 h-4 w-4" />
        Réinitialiser
      </Button>
    </div>
  );
};

export default PayslipFilters;
