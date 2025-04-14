
import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Evaluation } from '@/hooks/useEvaluationsData';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useHrModuleData } from '@/hooks/useHrModuleData';
import { toast } from 'sonner';

// Define the form schema with Zod
const formSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  evaluatorId: z.string().optional(),
  date: z.string().min(1, "La date est requise"),
  status: z.enum(["Planifiée", "Complétée", "Annulée"]),
  score: z.coerce.number().min(0).max(100).optional(),
  comments: z.string().optional(),
  strengths: z.string().optional(),
  improvements: z.string().optional(),
});

export interface EditEvaluationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  evaluation: Evaluation | null;
  onSuccess?: () => void;
}

const EditEvaluationDialog: React.FC<EditEvaluationDialogProps> = ({
  open,
  onOpenChange,
  evaluation,
  onSuccess
}) => {
  const { employees } = useHrModuleData();
  
  // Create form with default values from the evaluation
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: evaluation?.title || '',
      evaluatorId: evaluation?.evaluatorId || '',
      date: evaluation?.date ? new Date(evaluation.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      status: evaluation?.status || 'Planifiée',
      score: evaluation?.score || 0,
      comments: evaluation?.comments || '',
      strengths: evaluation?.strengths?.join('\n') || '',
      improvements: evaluation?.improvements?.join('\n') || '',
    },
  });

  React.useEffect(() => {
    if (evaluation && open) {
      // Reset form with updated values when evaluation changes
      form.reset({
        title: evaluation.title || '',
        evaluatorId: evaluation.evaluatorId || '',
        date: evaluation.date ? new Date(evaluation.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        status: evaluation.status || 'Planifiée',
        score: evaluation.score || 0,
        comments: evaluation.comments || '',
        strengths: evaluation.strengths?.join('\n') || '',
        improvements: evaluation.improvements?.join('\n') || '',
      });
    }
  }, [evaluation, open, form]);

  const handleSave = (values: z.infer<typeof formSchema>) => {
    if (!evaluation) {
      toast.error("Aucune évaluation sélectionnée");
      return;
    }
    
    // Convert form data to Evaluation format
    const updatedEvaluation: Partial<Evaluation> = {
      ...evaluation,
      title: values.title,
      evaluatorId: values.evaluatorId,
      date: values.date,
      status: values.status,
      score: values.score,
      comments: values.comments,
      strengths: values.strengths ? values.strengths.split('\n').filter(str => str.trim() !== '') : [],
      improvements: values.improvements ? values.improvements.split('\n').filter(str => str.trim() !== '') : [],
    };
    
    // Here you would typically update the evaluation in your data store
    console.log("Updated evaluation:", updatedEvaluation);
    toast.success("Évaluation mise à jour");
    
    if (onSuccess) {
      onSuccess();
    }
    onOpenChange(false);
  };

  if (!evaluation) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Modifier l'évaluation</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre</FormLabel>
                  <FormControl>
                    <Input placeholder="Titre de l'évaluation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="evaluatorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Évaluateur</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un évaluateur" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {employees?.map(employee => (
                          <SelectItem key={employee.id} value={employee.id}>
                            {employee.firstName} {employee.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Statut de l'évaluation" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Planifiée">Planifiée</SelectItem>
                        <SelectItem value="Complétée">Complétée</SelectItem>
                        <SelectItem value="Annulée">Annulée</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="score"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Score (0-100)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" max="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="comments"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commentaires</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Commentaires généraux sur l'évaluation" 
                      className="min-h-[80px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="strengths"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Points forts (un par ligne)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Liste des points forts" 
                      className="min-h-[80px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="improvements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Axes d'amélioration (un par ligne)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Liste des axes d'amélioration" 
                      className="min-h-[80px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit">
                Enregistrer
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditEvaluationDialog;
