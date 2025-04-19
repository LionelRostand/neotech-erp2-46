
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { taxRateSchema, TaxRateFormValues } from "./taxRateSchema";
import { toast } from "sonner";
import { TaxRate } from "../../types/accounting-types";

interface CreateTaxRateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<TaxRate>) => void;
}

const CreateTaxRateDialog: React.FC<CreateTaxRateDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
}) => {
  const form = useForm<TaxRateFormValues>({
    resolver: zodResolver(taxRateSchema),
    defaultValues: {
      name: "",
      rate: 0,
      description: "",
      isDefault: false,
    },
  });

  const handleSubmit = async (values: TaxRateFormValues) => {
    try {
      await onSubmit({
        ...values,
        active: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      form.reset();
      onOpenChange(false);
      toast.success("Taux de TVA créé avec succès");
    } catch (error) {
      console.error("Error creating tax rate:", error);
      toast.error("Erreur lors de la création du taux de TVA");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nouveau taux de TVA</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="TVA standard..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Taux (%)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.1"
                      placeholder="20" 
                      {...field}
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Description optionnelle..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isDefault"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Taux par défaut</FormLabel>
                    <FormDescription>
                      Ce taux sera utilisé par défaut pour les nouveaux éléments
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Annuler
              </Button>
              <Button type="submit">
                Créer
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaxRateDialog;
