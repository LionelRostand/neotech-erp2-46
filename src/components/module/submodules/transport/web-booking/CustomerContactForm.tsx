
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Le nom doit contenir au moins 2 caractères' }),
  email: z.string().email({ message: 'Veuillez entrer une adresse email valide' }),
  subject: z.string().min(5, { message: 'Le sujet doit contenir au moins 5 caractères' }),
  messageType: z.string(),
  message: z.string().min(10, { message: 'Le message doit contenir au moins 10 caractères' }),
});

type FormValues = z.infer<typeof formSchema>;

interface CustomerContactFormProps {
  isEditable?: boolean;
  onSubmitted?: () => void;
}

const CustomerContactForm: React.FC<CustomerContactFormProps> = ({ isEditable = false, onSubmitted }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      messageType: 'question',
      message: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulation d'envoi du message au service client
      console.log('Message envoyé au service client:', data);
      
      // Dans une application réelle, ici vous feriez un appel API pour enregistrer le message
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulation délai réseau
      
      toast({
        title: "Message envoyé",
        description: "Votre message a bien été transmis à notre équipe de service client.",
      });
      
      form.reset();
      if (onSubmitted) onSubmitted();
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message', error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du message. Veuillez réessayer.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`p-6 rounded-lg ${isEditable ? 'border border-dashed border-gray-300' : 'bg-white shadow-sm'}`}>
      <div className="flex items-center mb-6">
        <MessageSquare className="h-5 w-5 mr-2 text-primary" />
        <h3 className="text-lg font-medium">Contactez notre service client</h3>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre nom" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="votre@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sujet</FormLabel>
                  <FormControl>
                    <Input placeholder="Sujet de votre message" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="messageType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type de message</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="question">Question</SelectItem>
                      <SelectItem value="reservation">Question sur une réservation</SelectItem>
                      <SelectItem value="problem">Signalement d'un problème</SelectItem>
                      <SelectItem value="feedback">Commentaire ou suggestion</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Détaillez votre message ici..." 
                    className="min-h-[120px]" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full md:w-auto" disabled={isSubmitting}>
            {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CustomerContactForm;
