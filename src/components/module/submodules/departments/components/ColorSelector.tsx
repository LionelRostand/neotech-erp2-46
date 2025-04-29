
import React from 'react';
import { Check } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { departmentColors } from '../types';

interface ColorSelectorProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const ColorSelector: React.FC<ColorSelectorProps> = ({ value, onChange, disabled = false }) => {
  return (
    <Select
      value={value}
      onValueChange={onChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Sélectionner une couleur">
          <div className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded-full" 
              style={{ backgroundColor: value }}
            />
            <span>
              {departmentColors.find(color => color.value === value)?.label || 'Couleur personnalisée'}
            </span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {departmentColors.map((color) => (
          <SelectItem key={color.value} value={color.value} className="flex items-center gap-2">
            <div className="flex items-center gap-2 w-full">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: color.value }}
              />
              <span>{color.label}</span>
              {color.value === value && <Check className="ml-auto h-4 w-4" />}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ColorSelector;
