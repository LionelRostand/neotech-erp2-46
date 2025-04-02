
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CustomerContactFormProps {
  isEditable: boolean;
}

const CustomerContactForm: React.FC<CustomerContactFormProps> = ({ isEditable }) => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Reset form after submission
    if (!isEditable) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      alert('Message envoyé avec succès!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nom complet</Label>
        <Input
          id="name"
          placeholder="Votre nom"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          readOnly={isEditable}
          className={isEditable ? 'bg-gray-100' : ''}
        />
      </div>
      
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="votre@email.com"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          readOnly={isEditable}
          className={isEditable ? 'bg-gray-100' : ''}
        />
      </div>
      
      <div>
        <Label htmlFor="phone">Téléphone</Label>
        <Input
          id="phone"
          placeholder="Votre numéro de téléphone"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          readOnly={isEditable}
          className={isEditable ? 'bg-gray-100' : ''}
        />
      </div>
      
      <div>
        <Label htmlFor="subject">Sujet</Label>
        {isEditable ? (
          <Input
            id="subject"
            placeholder="Sujet de votre message"
            value={formData.subject}
            readOnly
            className="bg-gray-100"
          />
        ) : (
          <Select value={formData.subject} onValueChange={(value) => handleChange('subject', value)}>
            <SelectTrigger id="subject">
              <SelectValue placeholder="Sélectionnez un sujet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="reservation">Question sur une réservation</SelectItem>
              <SelectItem value="vehicule">Information sur les véhicules</SelectItem>
              <SelectItem value="tarifs">Demande de tarifs</SelectItem>
              <SelectItem value="autre">Autre demande</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
      
      <div>
        <Label htmlFor="message">Message</Label>
        <textarea
          id="message"
          className={`w-full min-h-[120px] p-3 border rounded-md resize-none ${isEditable ? 'bg-gray-100' : ''}`}
          placeholder="Votre message"
          value={formData.message}
          onChange={(e) => handleChange('message', e.target.value)}
          readOnly={isEditable}
        ></textarea>
      </div>
      
      <div>
        <Button 
          type="submit" 
          className={`w-full ${isEditable ? 'bg-[#ff5f00] hover:bg-[#ff7c33] pointer-events-none' : 'bg-[#ff5f00] hover:bg-[#ff7c33]'}`}
        >
          {isEditable ? 'Aperçu du bouton' : 'Envoyer votre message'}
        </Button>
      </div>
    </form>
  );
};

export default CustomerContactForm;
