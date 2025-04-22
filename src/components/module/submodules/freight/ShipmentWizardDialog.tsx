
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StepGeneral from "./shipment-wizard/StepGeneral";
import StepArticles from "./shipment-wizard/StepArticles";
import StepTracking from "./shipment-wizard/StepTracking";
import StepPricing from "./shipment-wizard/StepPricing";
import StepRecap from "./shipment-wizard/StepRecap";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

interface ShipmentWizardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  children?: React.ReactNode;
}

const ShipmentWizardDialog: React.FC<ShipmentWizardDialogProps> = ({
  open,
  onOpenChange,
  onSuccess,
  children,
}) => {
  // Wizard state
  const [currentStep, setCurrentStep] = useState("general");
  const [wizardForm, setWizardForm] = useState({
    reference: "",
    customer: "",
    customerName: "",
    carrier: "",
    carrierName: "",
    shipmentType: "export",
    status: "draft",
    scheduledDate: "",
    estimatedDeliveryDate: "",
    lines: [],
    trackingNumber: "",
    routeId: "",
    notes: "",
    totalWeight: 0,
    pricing: {
      basePrice: 10,
      geoZone: "National",
      shipmentKind: "standard",
      distance: 0,
      extraFees: 0,
    },
  });

  // Helper functions
  const goToStep = (step: string) => {
    setCurrentStep(step);
  };

  const handleUpdateForm = (data: any) => {
    setWizardForm((prev) => {
      const newState = { ...prev, ...data };
      
      // Calculate total weight whenever lines are updated
      if (data.lines) {
        newState.totalWeight = data.lines.reduce(
          (sum: number, line: any) => sum + Number(line.weight) * Number(line.quantity),
          0
        );
      }
      
      return newState;
    });
  };

  const handleUpdateLines = (lines: any[]) => {
    handleUpdateForm({ lines });
  };

  const handleUpdatePricing = (pricing: any) => {
    handleUpdateForm({ pricing });
  };

  const handleClose = () => {
    onOpenChange(false);
    // Wait for dialog animation to complete before resetting form
    setTimeout(() => {
      setCurrentStep("general");
      setWizardForm({
        reference: "",
        customer: "",
        customerName: "",
        carrier: "",
        carrierName: "",
        shipmentType: "export",
        status: "draft",
        scheduledDate: "",
        estimatedDeliveryDate: "",
        lines: [],
        trackingNumber: "",
        routeId: "",
        notes: "",
        totalWeight: 0,
        pricing: {
          basePrice: 10,
          geoZone: "National",
          shipmentKind: "standard",
          distance: 0,
          extraFees: 0,
        },
      });
    }, 300);
  };

  const handleSuccess = () => {
    if (onSuccess) {
      onSuccess();
    }
    handleClose();
    toast.success("Expédition créée avec succès!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Créer une nouvelle expédition</DialogTitle>
          <DialogDescription>
            Remplissez les informations pour créer une nouvelle expédition
          </DialogDescription>
        </DialogHeader>

        <Tabs value={currentStep} className="mt-4" onValueChange={goToStep}>
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="general">Informations</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="tracking">Suivi & Route</TabsTrigger>
            <TabsTrigger value="pricing">Prix</TabsTrigger>
            <TabsTrigger value="recap">Récapitulatif</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <StepGeneral
              form={wizardForm}
              updateForm={handleUpdateForm}
              prev={() => {}}
              next={() => goToStep("articles")}
              close={handleClose}
            />
          </TabsContent>

          <TabsContent value="articles">
            <StepArticles
              lines={wizardForm.lines || []}
              updateLines={handleUpdateLines}
              prev={() => goToStep("general")}
              next={() => goToStep("tracking")}
              close={handleClose}
            />
          </TabsContent>

          <TabsContent value="tracking">
            <StepTracking
              form={wizardForm}
              updateForm={handleUpdateForm}
              prev={() => goToStep("articles")}
              next={() => goToStep("pricing")}
              close={handleClose}
            />
          </TabsContent>

          <TabsContent value="pricing">
            <StepPricing
              form={wizardForm}
              updatePricing={handleUpdatePricing}
              prev={() => goToStep("tracking")}
              next={() => goToStep("recap")}
              close={handleClose}
            />
          </TabsContent>

          <TabsContent value="recap">
            <StepRecap
              form={wizardForm}
              prev={() => goToStep("pricing")}
              onSuccess={handleSuccess}
              close={handleClose}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ShipmentWizardDialog;
