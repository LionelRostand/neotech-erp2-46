
import React from 'react';
import { Switch } from "@/components/ui/switch";

interface FeatureToggleProps {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const FeatureToggle: React.FC<FeatureToggleProps> = ({
  title,
  description,
  checked,
  onChange
}) => {
  return (
    <div className="flex items-center justify-between p-4 border rounded-md">
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      <Switch 
        checked={checked}
        onCheckedChange={onChange}
      />
    </div>
  );
};
