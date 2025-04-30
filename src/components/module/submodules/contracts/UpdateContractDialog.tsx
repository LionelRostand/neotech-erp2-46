
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Contract } from '@/hooks/useContractsData';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { COLLECTIONS } from '@/lib/firebase-collections';
import { updateDocument } from '@/hooks/firestore/update-operations';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Schéma de validation du formulaire
const contractFormSchema = z.object({
  type: z.string().min(1, "Le type de contrat est requis"),
  position: z.string().min(1, "Le poste est requis"),
  startDate: z.string().min(1, "La date de début est requise"),
  endDate: z.string().optional(),
  salary: z.coerce.number().optional(),
  department: z.string().min(1, "Le département est requis"),
});

type ContractFormValues = z.infer<typeof contractFormSchema>;

interface UpdateContractDialogProps {
  contract: Contract | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const UpdateContractDialog: React.FC<UpdateContractDialogProps> = ({ 
  contract, 
  open, 
  onOpenChange,
  onSuccess
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ContractFormValues>({
    resolver: zodResolver(contractFormSchema),
    defaultValues: {
      type: contract?.type || '',
      position: contract?.position || '',
      startDate: contract?.startDate || '',
      endDate: contract?.endDate || '',
      salary: contract?.salary,
      department: contract?.department || '',
    },
  });

  // Mise à jour des valeurs par défaut lorsque le contrat change
  React.useEffect(() => {
    if (contract) {
      form.reset({
        type: contract.type || '',
        position: contract.position || '',
        startDate: contract.startDate || '',
        endDate: contract.endDate || '',
        salary: contract.salary,
        department: contract.department || '',
      });
    }
  }, [contract, form]);

  const onSubmit = async (data: ContractFormValues) => {
    if (!contract || !contract.id) {
      toast.error("Impossible de mettre à jour ce contrat: identifiant manquant");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateDocument(COLLECTIONS.HR.CONTRACTS, contract.id, {
        ...data,
        // Conserver les champs qui ne sont pas modifiés dans le formulaire
        employeeId: contract.employeeId,
      });
      
      toast.success("Le contrat a été mis à jour avec succès");
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Erreur lors de la mise à jour du contrat:", error);
      toast.error("Une erreur s'est produite lors de la mise à jour du contrat");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!contract) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier le contrat</DialogTitle>
          <DialogDescription>
            Modifier les informations du contrat de {contract.employeeName}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de contrat</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CDI">CDI</SelectItem>
                      <SelectItem value="CDD">CDD</SelectItem>
                      <SelectItem value="Intérim">Intérim</SelectItem>
                      <SelectItem value="Stage">Stage</SelectItem>
                      <SelectItem value="Apprentissage">Apprentissage</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Poste</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de début</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date de fin (optionnel pour CDI)</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Département</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salaire (€/an)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field}
                        value={field.value === undefined ? '' : field.value}
                        onChange={(e) => {
                          const value = e.target.value ? parseFloat(e.target.value) : undefined;
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mise à jour...
                  </>
                ) : (
                  "Mettre à jour"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateContractDialog;
