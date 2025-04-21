
import React from "react";

interface ContainerStatusSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const STATUSES = [
  { value: "vide", label: "Vide" },
  { value: "chargement", label: "En chargement" },
  { value: "plein", label: "Plein" },
  { value: "en transit", label: "En transit" },
  { value: "livré", label: "Livré" },
];

const ContainerStatusSelect: React.FC<ContainerStatusSelectProps> = ({
  value,
  onChange,
}) => (
  <select
    className="border rounded px-2 py-2 w-full"
    value={value}
    onChange={(e) => onChange(e.target.value)}
  >
    {STATUSES.map((status) => (
      <option key={status.value} value={status.value}>
        {status.label}
      </option>
    ))}
  </select>
);

export default ContainerStatusSelect;
