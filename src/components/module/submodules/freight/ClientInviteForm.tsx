
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Check, Send } from 'lucide-react';

const ClientInviteForm: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    message: `Bonjour,

Nous vous invitons à rejoindre notre portail client pour suivre vos expéditions en temps réel.

Cordialement,
L'équipe logistique`
  });
  
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation simple
    if (!formData.email) {
      toast({
        title: "Champ obligatoire",
        description: "Veuillez saisir une adresse e-mail.",
        variant: "destructive"
      });
      return;
    }
    
    // Simuler l'envoi de l'invitation
    setIsSending(true);
    
    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
      
      toast({
        title: "Invitation envoyée",
        description: `Une invitation a été envoyée à ${formData.email}.`,
      });
      
      // Réinitialiser le formulaire après 2 secondes
      setTimeout(() => {
        setIsSent(false);
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          company: '',
          message: `Bonjour,

Nous vous invitons à rejoindre notre portail client pour suivre vos expéditions en temps réel.

Cordialement,
L'équipe logistique`
        });
      }, 2000);
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Inviter un nouveau client</CardTitle>
        <CardDescription>
          Envoyez une invitation par e-mail pour accéder au portail client
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Jean"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Dupont"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jean.dupont@entreprise.com"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company">Entreprise</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Entreprise SA"
              />
            </div>
            
            <div className="space-y-2 col-span-2">
              <Label htmlFor="message">Message d'invitation</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
              />
            </div>
            
            <div className="col-span-2">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSending || isSent}
              >
                {isSending ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Envoi en cours...
                  </span>
                ) : isSent ? (
                  <span className="flex items-center">
                    <Check className="mr-2 h-5 w-5" />
                    Invitation envoyée
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Send className="mr-2 h-5 w-5" />
                    Envoyer l'invitation
                  </span>
                )}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ClientInviteForm;
