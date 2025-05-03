
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { BadgeData } from '@/components/module/submodules/employees/badges/BadgeTypes';
import { updateBadge } from '@/components/module/submodules/employees/services/badgeService';

interface EditBadgeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  badge: BadgeData | null;
  onBadgeUpdated: (badge: BadgeData) => void;
}

const formSchema = z.object({
  badgeNumber: z.string().min(1, { message: 'Le numéro de badge est requis' }),
  accessLevel: z.enum(['visitor', 'employee', 'manager', 'admin']),
  validFrom: z.string().min(1, { message: 'La date de début est requise' }),
  validUntil: z.string().optional(),
  status: z.enum(['active', 'inactive', 'revoked', 'lost']),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const EditBadgeDialog: React.FC<EditBadgeDialogProps> = ({
  isOpen,
  onOpenChange,
  badge,
  onBadgeUpdated
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      badgeNumber: badge?.badgeNumber || '',
      accessLevel: badge?.accessLevel || 'employee',
      validFrom: badge?.validFrom || new Date().toISOString().split('T')[0],
      validUntil: badge?.validUntil || '',
      status: badge?.status || 'active',
      notes: badge?.notes || '',
    },
  });

  // Mettre à jour les valeurs du formulaire lorsque le badge change
  useEffect(() => {
    if (badge) {
      form.reset({
        badgeNumber: badge.badgeNumber || '',
        accessLevel: badge.accessLevel || 'employee',
        validFrom: badge.validFrom || new Date().toISOString().split('T')[0],
        validUntil: badge.validUntil || '',
        status: badge.status || 'active',
        notes: badge.notes || '',
      });
    }
  }, [badge, form]);

  const onSubmit = async (values: FormData) => {
    if (!badge || !badge.id) return;

    try {
      setIsSubmitting(true);
      
      const updatedBadgeData: Partial<BadgeData> = {
        badgeNumber: values.badgeNumber,
        accessLevel: values.accessLevel,
        validFrom: values.validFrom,
        validUntil: values.validUntil || null,
        status: values.status,
        notes: values.notes || '',
        updatedAt: new Date().toISOString(),
      };
      
      await updateBadge(badge.id, updatedBadgeData);
      
      const updatedBadge: BadgeData = {
        ...badge,
        ...updatedBadgeData
      };
      
      toast.success(`Badge mis à jour avec succès`);
      onBadgeUpdated(updatedBadge);
      onOpenChange(false);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du badge:", error);
      toast.error("Échec de la mise à jour du badge");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!badge) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier le badge</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="badgeNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Numéro de badge</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accessLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Niveau d'accès</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un niveau d'accès" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="visitor">Visiteur</SelectItem>
                      <SelectItem value="employee">Employé</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="admin">Administrateur</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="validFrom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valide à partir du</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="validUntil"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valide jusqu'au</FormLabel>
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
                      <SelectItem value="active">Actif</SelectItem>
                      <SelectItem value="inactive">Inactif</SelectItem>
                      <SelectItem value="revoked">Révoqué</SelectItem>
                      <SelectItem value="lost">Perdu</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optionnel)</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Mise à jour..." : "Mettre à jour le badge"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditBadgeDialog;
