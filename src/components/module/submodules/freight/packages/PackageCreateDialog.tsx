
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { packageTypes, mockCarriers } from '../mockPackages';
import CarrierSelector from './CarrierSelector';
import PackageDocumentsForm from './PackageDocumentsForm';
import { toast } from 'sonner';
import { Package } from '@/types/freight';

interface PackageCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const packageSchema = z.object({
  reference: z.string().min(1, { message: 'Référence requise' }),
  description: z.string().optional(),
  weight: z.coerce.number().min(0.01, { message: 'Poids requis' }),
  weightUnit: z.enum(['kg', 'lb']),
  length: z.coerce.number().optional(),
  width: z.coerce.number().optional(),
  height: z.coerce.number().optional(),
  dimensionsUnit: z.enum(['cm', 'in']),
  declaredValue: z.coerce.number().optional(),
  currency: z.string().default('EUR'),
  contents: z.string().optional(),
  packageType: z.string().min(1, { message: 'Type de colis requis' }),
  shipmentId: z.string().optional(),
});

type PackageFormValues = z.infer<typeof packageSchema>;

const PackageCreateDialog: React.FC<PackageCreateDialogProps> = ({ open, onOpenChange }) => {
  const [step, setStep] = useState(1);
  const [selectedCarrierId, setSelectedCarrierId] = useState<string | null>(null);
  const [documents, setDocuments] = useState<File[]>([]);
  
  const form = useForm<PackageFormValues>({
    resolver: zodResolver(packageSchema),
    defaultValues: {
      reference: 'PKG-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
      weightUnit: 'kg',
      dimensionsUnit: 'cm',
      currency: 'EUR',
      packageType: 'box',
    },
  });

  const resetForm = () => {
    form.reset();
    setStep(1);
    setSelectedCarrierId(null);
    setDocuments([]);
  };

  const onSubmit = (values: PackageFormValues) => {
    // Here you would normally send the data to your API
    console.log('Package data to be saved:', values);
    console.log('Selected carrier:', selectedCarrierId);
    console.log('Uploaded documents:', documents);

    // Create a new package object
    const newPackage: Partial<Package> = {
      id: 'pkg-' + Math.floor(100000 + Math.random() * 900000),
      reference: values.reference,
      description: values.description,
      weight: values.weight,
      weightUnit: values.weightUnit,
      dimensions: values.length && values.width && values.height ? {
        length: values.length,
        width: values.width,
        height: values.height,
        unit: values.dimensionsUnit
      } : undefined,
      declaredValue: values.declaredValue,
      currency: values.currency,
      contents: values.contents,
      packageType: values.packageType,
      shipmentId: values.shipmentId,
      carrierId: selectedCarrierId || undefined,
      carrierName: selectedCarrierId ? 
        mockCarriers.find(c => c.id === selectedCarrierId)?.name : undefined,
      status: 'draft',
      labelGenerated: false,
      createdAt: new Date().toISOString(),
      documents: []
    };

    // Show success message
    toast.success('Colis créé avec succès', {
      description: `Référence: ${values.reference}`
    });

    // Close dialog and reset form
    onOpenChange(false);
    resetForm();
  };

  const nextStep = () => {
    if (step === 1 && !form.formState.isValid) {
      form.trigger();
      return;
    }
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleCancel = () => {
    onOpenChange(false);
    resetForm();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Nouveau colis</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={`step-${step}`} className="w-full">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="step-1" disabled>Informations</TabsTrigger>
                <TabsTrigger value="step-2" disabled>Transporteur</TabsTrigger>
                <TabsTrigger value="step-3" disabled>Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="step-1" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="reference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Référence</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="packageType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de colis</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {packageTypes.map(type => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contents"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contenu</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="weight"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Poids</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.1" min="0.1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="weightUnit"
                      render={({ field }) => (
                        <FormItem className="w-24">
                          <FormLabel>Unité</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Unité" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="kg">kg</SelectItem>
                              <SelectItem value="lb">lb</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="declaredValue"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Valeur déclarée</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem className="w-24">
                          <FormLabel>Devise</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Devise" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="EUR">EUR</SelectItem>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="GBP">GBP</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div>
                  <FormLabel>Dimensions</FormLabel>
                  <div className="grid grid-cols-4 gap-4 mt-2">
                    <FormField
                      control={form.control}
                      name="length"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              step="0.1" 
                              placeholder="Longueur" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="width"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              step="0.1" 
                              placeholder="Largeur" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="height"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="0" 
                              step="0.1" 
                              placeholder="Hauteur" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dimensionsUnit"
                      render={({ field }) => (
                        <FormItem>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Unité" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="cm">cm</SelectItem>
                              <SelectItem value="in">in</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="step-2" className="space-y-4 mt-4">
                <CarrierSelector 
                  carriers={mockCarriers}
                  selectedCarrierId={selectedCarrierId}
                  onSelect={setSelectedCarrierId}
                />
              </TabsContent>

              <TabsContent value="step-3" className="space-y-4 mt-4">
                <PackageDocumentsForm 
                  documents={documents}
                  setDocuments={setDocuments}
                />
              </TabsContent>
            </Tabs>

            <DialogFooter className="flex justify-between">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Précédent
                </Button>
              ) : (
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Annuler
                </Button>
              )}

              {step < 3 ? (
                <Button type="button" onClick={nextStep}>
                  Suivant
                </Button>
              ) : (
                <Button type="submit">
                  Créer le colis
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PackageCreateDialog;
