
import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export interface PayslipFiltersOptions {
  employeeId?: string;
  month?: string;
  year?: number;
  status?: string;
  department?: string;
}

interface PayslipFiltersProps {
  employees: { id: string; name: string }[];
  onApplyFilters: (filters: PayslipFiltersOptions) => void;
  currentFilters?: PayslipFiltersOptions;
}

const PayslipFilters: React.FC<PayslipFiltersProps> = ({
  employees,
  onApplyFilters,
  currentFilters = {}
}) => {
  const [calendarOpen, setCalendarOpen] = React.useState(false);
  const [filters, setFilters] = React.useState<PayslipFiltersOptions>(currentFilters);

  const handleEmployeeChange = (value: string) => {
    const newFilters = {
      ...filters,
      employeeId: value === 'all' ? undefined : value
    };
    setFilters(newFilters);
    onApplyFilters(newFilters);
  };

  const handleMonthChange = (date: Date | undefined) => {
    if (date) {
      const monthName = format(date, 'MMMM', { locale: fr });
      const year = date.getFullYear();
      
      const newFilters = {
        ...filters,
        month: monthName,
        year: year
      };
      setFilters(newFilters);
      onApplyFilters(newFilters);
      setCalendarOpen(false);
    }
  };

  const handleStatusChange = (value: string) => {
    const newFilters = {
      ...filters,
      status: value === 'all' ? undefined : value
    };
    setFilters(newFilters);
    onApplyFilters(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {};
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
      <Select
        value={filters.employeeId || 'all'}
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
              `${filters.month} ${filters.year}`
            ) : (
              "Tous les mois"
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={filters.month && filters.year ? new Date(filters.year, new Date(Date.parse(`1 ${filters.month} ${filters.year}`)).getMonth(), 1) : undefined}
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
          <SelectItem value="Généré">Généré</SelectItem>
          <SelectItem value="Envoyé">Envoyé</SelectItem>
          <SelectItem value="Validé">Validé</SelectItem>
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
