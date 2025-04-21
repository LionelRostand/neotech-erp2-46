
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StepGeneral from "./shipment-wizard/StepGeneral";
import StepArticles from "./shipment-wizard/StepArticles";
import StepPricing from "./shipment-wizard/StepPricing";
import StepTracking from "./shipment-wizard/StepTracking";
import { createShipment } from "./services/shipmentService";
import { toast } from "sonner";
import { Timestamp } from "firebase/firestore";

const defaultForm = {
  reference: "",
  customer: "",
  origin: "",
  destination: "",
  totalWeight: 0,
  scheduledDate: new Date().toISOString(),
  shipmentType: "import",
  status: "draft",
  lines: [
    { id: Date.now().toString(), productName: "", quantity: 1, weight: 0, packageType: "box" }
  ],
  pricing: {
    basePrice: 10,
    geoZone: "National",
    shipmentKind: "standard",
    distance: 100,
    extraFees: 0,
  },
  tracking: {
    trackingNumber: `TRK${Math.floor(100000000 + Math.random()*900000000)}`,
    route: "",
    transportType: "road",
    estimatedTime: 24,
    distance: 100,
    status: "draft"
  }
};

const ShipmentWizardDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) => {
  const [form, setForm] = useState({ ...defaultForm });
  const [currentStep, setCurrentStep] = useState<"general" | "articles" | "pricing" | "tracking">("general");
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => {
    setForm({ ...defaultForm });
    setCurrentStep("general");
    onOpenChange(false);
  };

  // Navigation
  const next = () => {
    if (currentStep === "general") setCurrentStep("articles");
    else if (currentStep === "articles") setCurrentStep("pricing");
    else if (currentStep === "pricing") setCurrentStep("tracking");
  };
  const prev = () => {
    if (currentStep === "tracking") setCurrentStep("pricing");
    else if (currentStep === "pricing") setCurrentStep("articles");
    else if (currentStep === "articles") setCurrentStep("general");
  };

  // Ajout et édition par étapes
  const updateForm = (fields: any) => setForm((old) => ({ ...old, ...fields }));
  const updateLines = (lines: any) => setForm((f) => ({ ...f, lines, totalWeight: lines.reduce((sum: number, l: any) => sum + (l.weight*l.quantity), 0) }));
  const updatePricing = (pricing: any) => setForm((f) => ({ ...f, pricing }));
  const updateTracking = (tracking: any) => setForm((f) => ({ ...f, tracking }));

  // Actual shipment creation with Firebase
  const handleCreate = async () => {
    setSubmitting(true);
    try {
      // Prepare the data for Firebase
      const shipmentData = {
        reference: form.reference,
        customer: form.customer,
        origin: form.origin,
        destination: form.destination,
        totalWeight: form.totalWeight,
        shipmentType: form.shipmentType as 'import' | 'export' | 'local' | 'international',
        status: form.tracking.status || "draft" as 'draft' | 'confirmed' | 'in_transit' | 'delivered' | 'cancelled' | 'delayed',
        lines: form.lines,
        trackingNumber: form.tracking.trackingNumber,
        createdAt: new Date().toISOString(),
        scheduledDate: form.scheduledDate,
        estimatedDeliveryDate: new Date(Date.now() + (form.tracking.estimatedTime * 60 * 60 * 1000)).toISOString(),
        carrier: "default",
        carrierName: "Transport Standard",
        notes: "Créé via l'assistant d'expédition"
      };
      
      // Save to Firebase
      await createShipment(shipmentData);
      
      // Show success message
      toast.success(`Expédition ${form.reference} créée avec succès!`);
      
      // Close dialog and reset form
      handleClose();
    } catch (error) {
      console.error("Erreur lors de la création de l'expédition:", error);
      toast.error("Une erreur est survenue lors de la création de l'expédition");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Nouvelle Expédition</DialogTitle>
        </DialogHeader>
        <Tabs value={currentStep} onValueChange={val => setCurrentStep(val as any)} className="mt-2">
          <TabsList>
            <TabsTrigger value="general">Informations générales</TabsTrigger>
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="pricing">Tarification</TabsTrigger>
            <TabsTrigger value="tracking">Suivi & Route</TabsTrigger>
          </TabsList>
          <div className="pt-4" />
          <TabsContent value="general">
            <StepGeneral form={form} updateForm={updateForm} next={next} close={handleClose} submitting={submitting} />
          </TabsContent>
          <TabsContent value="articles">
            <StepArticles lines={form.lines} updateLines={updateLines} next={next} prev={prev} close={handleClose} />
          </TabsContent>
          <TabsContent value="pricing">
            <StepPricing
              form={form}
              updatePricing={updatePricing}
              next={next}
              prev={prev}
              close={handleClose}
            />
          </TabsContent>
          <TabsContent value="tracking">
            <StepTracking
              form={form}
              updateTracking={updateTracking}
              create={handleCreate}
              prev={prev}
              close={handleClose}
              submitting={submitting}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
export default ShipmentWizardDialog;
