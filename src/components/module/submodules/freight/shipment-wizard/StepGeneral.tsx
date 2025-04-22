
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFreightData } from "@/hooks/modules/useFreightData";

interface StepGeneralProps {
  generalInfo: any;
  updateGeneralInfo: (values: any) => void;
  onNext: () => void;
}

const shipmentTypes = [
  { value: "import", label: "Import" },
  { value: "export", label: "Export" },
  { value: "local", label: "Local" },
  { value: "international", label: "International" },
];

const StepGeneral = ({
  generalInfo,
  updateGeneralInfo,
  onNext,
}: StepGeneralProps) => {
  const { carriers, clients } = useFreightData();

  // Function to generate random reference if empty
  const generateReference = () => {
    const prefix = "SHP";
    const timestamp = new Date().getTime().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0");
    updateGeneralInfo({
      ...generalInfo,
      reference: `${prefix}-${timestamp}-${random}`,
    });
  };

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="font-medium mb-1 block">Référence</label>
          <div className="flex gap-2">
            <Input
              value={generalInfo.reference || ''}
              onChange={(e) =>
                updateGeneralInfo({ ...generalInfo, reference: e.target.value })
              }
              placeholder="Référence de l'expédition"
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={generateReference}
              className="whitespace-nowrap"
            >
              Générer
            </Button>
          </div>
        </div>
        <div>
          <label className="font-medium mb-1 block">Client</label>
          <select
            className="w-full border rounded p-2"
            value={generalInfo.client || ''}
            onChange={(e) =>
              updateGeneralInfo({ ...generalInfo, client: e.target.value })
            }
          >
            <option value="">Sélectionner un client</option>
            {clients &&
              clients.map((client: any) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label className="font-medium mb-1 block">Transporteur</label>
          <select
            className="w-full border rounded p-2"
            value={generalInfo.carrier || ''}
            onChange={(e) =>
              updateGeneralInfo({
                ...generalInfo,
                carrier: e.target.value,
                carrierName: carriers?.find((c: any) => c.id === e.target.value)?.name || '',
              })
            }
          >
            <option value="">Sélectionner un transporteur</option>
            {carriers &&
              carriers.map((carrier: any) => (
                <option key={carrier.id} value={carrier.id}>
                  {carrier.name}
                </option>
              ))}
          </select>
        </div>
        <div>
          <label className="font-medium mb-1 block">Type d'expédition</label>
          <select
            className="w-full border rounded p-2"
            value={generalInfo.shipmentType || ''}
            onChange={(e) =>
              updateGeneralInfo({
                ...generalInfo,
                shipmentType: e.target.value,
              })
            }
          >
            <option value="">Sélectionner un type</option>
            {shipmentTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-medium mb-1 block">Date d'envoi</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !generalInfo.scheduledDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {generalInfo.scheduledDate ? (
                  format(new Date(generalInfo.scheduledDate), "PPP")
                ) : (
                  <span>Sélectionner une date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={
                  generalInfo.scheduledDate
                    ? new Date(generalInfo.scheduledDate)
                    : undefined
                }
                onSelect={(date) =>
                  updateGeneralInfo({
                    ...generalInfo,
                    scheduledDate: date ? date.toISOString() : "",
                  })
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <label className="font-medium mb-1 block">
            Date de livraison estimée
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !generalInfo.estimatedDeliveryDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {generalInfo.estimatedDeliveryDate ? (
                  format(
                    new Date(generalInfo.estimatedDeliveryDate),
                    "PPP"
                  )
                ) : (
                  <span>Sélectionner une date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={
                  generalInfo.estimatedDeliveryDate
                    ? new Date(generalInfo.estimatedDeliveryDate)
                    : undefined
                }
                onSelect={(date) =>
                  updateGeneralInfo({
                    ...generalInfo,
                    estimatedDeliveryDate: date ? date.toISOString() : "",
                  })
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          Suivant
        </Button>
      </div>
    </form>
  );
};

export default StepGeneral;
