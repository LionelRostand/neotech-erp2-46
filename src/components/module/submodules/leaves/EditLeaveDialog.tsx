
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { updateLeaveRequest } from './services/leaveService';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface EditLeaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leaveRequest: any;
  onSuccess: () => void;
}

const formSchema = z.object({
  type: z.enum(['paid', 'unpaid', 'sick', 'maternity', 'paternity', 'other']),
  startDate: z.string().min(1, { message: 'La date de début est requise' }),
  endDate: z.string().min(1, { message: 'La date de fin est requise' }),
  reason: z.string().optional(),
  status: z.enum(['pending', 'approved', 'rejected', 'canceled']),
});

const EditLeaveDialog: React.FC<EditLeaveDialogProps> = ({
  open,
  onOpenChange,
  leaveRequest,
  onSuccess
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: leaveRequest?.type || 'paid',
      startDate: leaveRequest?.startDate ? new Date(leaveRequest.startDate).toISOString().split('T')[0] : '',
      endDate: leaveRequest?.endDate ? new Date(leaveRequest.endDate).toISOString().split('T')[0] : '',
      reason: leaveRequest?.reason || '',
      status: leaveRequest?.status || 'pending',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!leaveRequest?.id) return;

    try {
      await updateLeaveRequest(leaveRequest.id, {
        ...values,
        updatedAt: new Date().toISOString(),
      });
      toast.success("Demande de congé modifiée avec succès");
      onSuccess();
    } catch (error) {
      console.error("Erreur lors de la modification de la demande de congé:", error);
      toast.error("Échec de la modification de la demande");
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un type de congé" />
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

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Motif (optionnel)</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un statut" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="approved">Approuvé</SelectItem>
                      <SelectItem value="rejected">Rejeté</SelectItem>
                      <SelectItem value="canceled">Annulé</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
              <Button type="submit">Enregistrer</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditLeaveDialog;
