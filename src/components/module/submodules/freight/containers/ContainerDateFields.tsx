
import React from "react";
import { DatePicker } from "@/components/ui/date-picker";

interface ContainerDateFieldsProps {
  entryDate: Date | undefined;
  exitDate: Date | undefined;
  setEntryDate: (date: Date | undefined) => void;
  setExitDate: (date: Date | undefined) => void;
}

const ContainerDateFields: React.FC<ContainerDateFieldsProps> = ({
  entryDate,
  exitDate,
  setEntryDate,
  setExitDate,
}) => (
  <div className="flex gap-2">
    <div className="flex-1">
      <label className="block text-xs font-medium mb-1">Date d'entrée</label>
      <DatePicker date={entryDate} onSelect={setEntryDate} placeholder="Date entrée" />
    </div>
    <div className="flex-1">
      <label className="block text-xs font-medium mb-1">Date de sortie</label>
      <DatePicker date={exitDate} onSelect={setExitDate} placeholder="Date sortie" />
    </div>
  </div>
);

export default ContainerDateFields;
