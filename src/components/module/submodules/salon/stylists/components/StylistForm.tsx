
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Upload } from "lucide-react";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";

interface StylistFormProps {
  stylist?: any;
  onClose: () => void;
  onSave: (data: any) => void;
}

const specialtiesList = [
  "Coupe femme", "Coupe homme", "Coloration", "Mèches", "Balayage", 
  "Chignon", "Lissage", "Extensions", "Permanente", "Coiffage", "Barbe", "Soin"
];

const StylistForm: React.FC<StylistFormProps> = ({ stylist, onClose, onSave }) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: stylist ? {
      ...stylist,
    } : {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      experience: 0,
      specialties: [],
      status: 'available',
      bio: '',
      commissionRate: 30,
    }
  });

  const selectedSpecialties = watch('specialties') || [];
  
  const addSpecialty = (specialty: string) => {
    if (!selectedSpecialties.includes(specialty)) {
      setValue('specialties', [...selectedSpecialties, specialty]);
    }
  };

  const removeSpecialty = (specialty: string) => {
    setValue('specialties', selectedSpecialties.filter(s => s !== specialty));
  };

  const onSubmit = (data) => {
    onSave({
      id: stylist?.id || Date.now().toString(),
      ...data
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 flex flex-col items-center space-y-4">
          <Avatar className="w-32 h-32">
            <AvatarImage src={stylist?.avatar || ""} />
            <AvatarFallback className="text-2xl">
              {stylist ? stylist.firstName.charAt(0) + stylist.lastName.charAt(0) : "SC"}
            </AvatarFallback>
          </Avatar>
          <Button type="button" variant="outline" className="w-full">
            <Upload className="mr-2 h-4 w-4" />
            Changer la photo
          </Button>
        </div>

        <div className="col-span-2 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                {...register('firstName', { required: 'Le prénom est requis' })}
                placeholder="Prénom du coiffeur"
              />
              {errors.firstName && <p className="text-sm text-red-500">{errors.firstName.message?.toString()}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                {...register('lastName', { required: 'Le nom est requis' })}
                placeholder="Nom du coiffeur"
              />
              {errors.lastName && <p className="text-sm text-red-500">{errors.lastName.message?.toString()}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email', { 
                  required: 'L\'email est requis',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Adresse email invalide'
                  }
                })}
                placeholder="email@exemple.com"
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email.message?.toString()}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                {...register('phone', { required: 'Le téléphone est requis' })}
                placeholder="06 12 34 56 78"
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone.message?.toString()}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="experience">Années d'expérience</Label>
              <Input
                id="experience"
                type="number"
                min="0"
                {...register('experience', { 
                  required: 'L\'expérience est requise',
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: 'L\'expérience ne peut pas être négative'
                  }
                })}
              />
              {errors.experience && <p className="text-sm text-red-500">{errors.experience.message?.toString()}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="commissionRate">Taux de commission (%)</Label>
              <Input
                id="commissionRate"
                type="number"
                min="0"
                max="100"
                {...register('commissionRate', { 
                  required: 'Le taux de commission est requis',
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: 'Le taux ne peut pas être négatif'
                  },
                  max: {
                    value: 100,
                    message: 'Le taux ne peut pas dépasser 100%'
                  }
                })}
              />
              {errors.commissionRate && <p className="text-sm text-red-500">{errors.commissionRate.message?.toString()}</p>}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <Label>Statut actuel</Label>
        <RadioGroup 
          defaultValue={stylist?.status || 'available'} 
          onValueChange={v => setValue('status', v)}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="available" id="available" />
            <Label htmlFor="available" className="text-green-600">Disponible</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="busy" id="busy" />
            <Label htmlFor="busy" className="text-blue-600">Occupé</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="off" id="off" />
            <Label htmlFor="off" className="text-orange-600">Absent</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label>Spécialités</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedSpecialties.map((specialty, idx) => (
            <Badge key={idx} variant="secondary" className="flex items-center gap-1">
              {specialty}
              <button 
                type="button" 
                onClick={() => removeSpecialty(specialty)}
                className="ml-1 rounded-full h-4 w-4 inline-flex items-center justify-center text-gray-500 hover:bg-gray-200"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {specialtiesList.filter(s => !selectedSpecialties.includes(s)).map((specialty, idx) => (
            <Badge 
              key={idx} 
              variant="outline" 
              className="cursor-pointer hover:bg-accent"
              onClick={() => addSpecialty(specialty)}
            >
              <Plus className="h-3 w-3 mr-1" />
              {specialty}
            </Badge>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Biographie</Label>
        <Textarea
          id="bio"
          {...register('bio')}
          placeholder="Expérience professionnelle, formations, particularités..."
          rows={4}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button type="submit">
          {stylist ? 'Enregistrer les modifications' : 'Ajouter ce coiffeur'}
        </Button>
      </div>
    </form>
  );
};

export default StylistForm;
