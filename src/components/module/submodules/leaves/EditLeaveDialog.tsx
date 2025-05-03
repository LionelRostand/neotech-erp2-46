
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { toast } from 'sonner';
import { updateLeaveRequest } from './services/leaveService';

// Schema for leave request form validation
const leaveRequestSchema = z.object({
  type: z.enum(['paid', 'unpaid', 'sick', 'maternity', 'paternity', 'other']),
  startDate: z.string().min(1, { message: "La date de début est requise" }),
  endDate: z.string().min(1, { message: "La date de fin est requise" }),
  reason: z.string().optional(),
});

interface EditLeaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leaveRequest: any; // Use a more specific type if available
  onSuccess: () => void;
}

const EditLeaveDialog: React.FC<EditLeaveDialogProps> = ({
  open,
  onOpenChange,
  leaveRequest,
  onSuccess
}) => {
  // Set up form with default values from the leave request
  const form = useForm<z.infer<typeof leaveRequestSchema>>({
    resolver: zodResolver(leaveRequestSchema),
    defaultValues: {
      type: leaveRequest?.type || 'paid',
      startDate: leaveRequest?.startDate ? new Date(leaveRequest.startDate).toISOString().split('T')[0] : '',
      endDate: leaveRequest?.endDate ? new Date(leaveRequest.endDate).toISOString().split('T')[0] : '',
      reason: leaveRequest?.reason || '',
    },
  });
  
  // Reset form when leave request changes
  React.useEffect(() => {
    if (leaveRequest && open) {
      // Format dates for the form (YYYY-MM-DD)
      const formattedStartDate = leaveRequest.startDate 
        ? new Date(leaveRequest.startDate).toISOString().split('T')[0]
        : '';
      const formattedEndDate = leaveRequest.endDate 
        ? new Date(leaveRequest.endDate).toISOString().split('T')[0]
        : '';
      
      form.reset({
        type: leaveRequest.type || 'paid',
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        reason: leaveRequest.reason || '',
      });
    }
  }, [leaveRequest, open, form]);
  
  // Handle form submission
  const onSubmit = async (data: z.infer<typeof leaveRequestSchema>) => {
    if (!leaveRequest?.id) return;
    
    try {
      await updateLeaveRequest(leaveRequest.id, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
      
      toast.success("Demande de congé mise à jour avec succès");
      onSuccess();
    } catch (error) {
      console.error("Error updating leave request:", error);
      toast.error("Échec de la mise à jour de la demande");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier la demande de congé</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de congé</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez le type de congé" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="paid">Congé payé</SelectItem>
                      <SelectItem value="unpaid">Sans solde</SelectItem>
                      <SelectItem value="sick">Maladie</SelectItem>
                      <SelectItem value="maternity">Maternité</SelectItem>
                      <SelectItem value="paternity">Paternité</SelectItem>
                      <SelectItem value="other">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
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
                    <FormLabel>Date de fin</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Raison (optionnel)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Décrivez la raison de votre demande de congé"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit">
                Mettre à jour
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditLeaveDialog;
