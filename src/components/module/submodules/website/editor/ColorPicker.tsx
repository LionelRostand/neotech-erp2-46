
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label?: string;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, label }) => {
  return (
    <div className="space-y-2">
      {label && <Label className="block text-sm font-medium">{label}</Label>}
      <div className="flex items-center space-x-2">
        <div 
          className="w-8 h-8 border rounded cursor-pointer" 
          style={{ backgroundColor: color }}
        />
        <Input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-8"
        />
      </div>
    </div>
  );
};
