
import React, { useState } from "react";
import NewContainerDialog from "./NewContainerDialog";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface Container {
  id: string;
  number: string;
  type: string;
  size: string;
  status: string;
  carrierName: string;
  origin: string;
  destination: string;
  departureDate: string;
  arrivalDate: string;
}

const data: Container[] = [
  {
    id: "1",
    number: "CONTAINER123",
    type: "Standard",
    size: "20ft",
    status: "In Transit",
    carrierName: "TransFrance",
    origin: "Paris",
    destination: "Marseille",
    departureDate: "2024-07-15",
    arrivalDate: "2024-07-20",
  },
  {
    id: "2",
    number: "CONTAINER456",
    type: "Refrigerated",
    size: "40ft",
    status: "At Port",
    carrierName: "Express Europe",
    origin: "Lyon",
    destination: "Bordeaux",
    departureDate: "2024-07-10",
    arrivalDate: "2024-07-18",
  },
];

interface ContainersListWithCreateProps {
  addDialogOpen?: boolean;
  onCloseAddDialog?: () => void;
}

const ContainersListWithCreate: React.FC<ContainersListWithCreateProps> = ({
  addDialogOpen,
  onCloseAddDialog
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  
  // Use either the controlled props or local state
  const dialogOpen = addDialogOpen !== undefined ? addDialogOpen : openDialog;
  const handleDialogOpenChange = (open: boolean) => {
    setOpenDialog(open);
    if (!open && onCloseAddDialog) {
      onCloseAddDialog();
    }
  };

  return (
    <div>
      {/* Bouton supprimé selon demande */}
      <Table>
        <TableCaption>A list of your recent containers.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Number</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Carrier</TableHead>
            <TableHead>Origin</TableHead>
            <TableHead>Destination</TableHead>
            <TableHead>Departure Date</TableHead>
            <TableHead>Arrival Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((container) => (
            <TableRow key={container.id}>
              <TableCell className="font-medium">{container.number}</TableCell>
              <TableCell>{container.type}</TableCell>
              <TableCell>{container.size}</TableCell>
              <TableCell>{container.status}</TableCell>
              <TableCell>{container.carrierName}</TableCell>
              <TableCell>{container.origin}</TableCell>
              <TableCell>{container.destination}</TableCell>
              <TableCell>{container.departureDate}</TableCell>
              <TableCell>{container.arrivalDate}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <NewContainerDialog 
        open={dialogOpen} 
        onOpenChange={handleDialogOpenChange} 
      />
    </div>
  );
};

export default ContainersListWithCreate;
