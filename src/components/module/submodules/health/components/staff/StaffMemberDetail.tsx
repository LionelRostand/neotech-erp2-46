
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useForm, FormProvider, useFormContext, Controller } from "react-hook-form";
import { ArrowLeft, Mail, Phone, Building, UserCog, Calendar, Shield, Clock, Save, X } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { StaffMember } from "../../types/health-types";
import { toast } from "@/hooks/use-toast";

interface StaffMemberDetailProps {
  staffMember?: StaffMember;
  onBack: () => void;
  onSave: (data: StaffMember) => void;
}

const GeneralInfoTab = () => {
  const form = useFormContext();
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prénom</FormLabel>
              <FormControl>
                <Input placeholder="Prénom" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input placeholder="Nom" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@exemple.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Téléphone</FormLabel>
              <FormControl>
                <Input placeholder="06 XX XX XX XX" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Adresse</FormLabel>
            <FormControl>
              <Textarea placeholder="Adresse complète" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="dateHired"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date d'embauche</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date de naissance</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

const ProfessionalInfoTab = () => {
  const form = useFormContext();
  
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="role"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rôle</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un rôle" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="doctor">Médecin</SelectItem>
                <SelectItem value="nurse">Infirmier(e)</SelectItem>
                <SelectItem value="secretary">Secrétaire</SelectItem>
                <SelectItem value="technician">Technicien</SelectItem>
                <SelectItem value="pharmacist">Pharmacien</SelectItem>
                <SelectItem value="lab_technician">Technicien de laboratoire</SelectItem>
                <SelectItem value="director">Directeur</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="department"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Département</FormLabel>
            <FormControl>
              <Input placeholder="Département" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="specialization"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Spécialisation</FormLabel>
            <FormControl>
              <Input placeholder="Spécialisation" {...field} />
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
            <Select 
              onValueChange={field.onChange} 
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionnez un statut" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="on-leave">En congé</SelectItem>
                <SelectItem value="terminated">Terminé</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

const EmergencyContactTab = () => {
  const form = useFormContext();
  
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="emergencyContact.name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nom du contact</FormLabel>
            <FormControl>
              <Input placeholder="Nom complet" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="emergencyContact.relationship"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Relation</FormLabel>
            <FormControl>
              <Input placeholder="Ex: Conjoint, Parent, Ami" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="emergencyContact.phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Téléphone d'urgence</FormLabel>
            <FormControl>
              <Input placeholder="06 XX XX XX XX" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

const PermissionsTab = () => {
  const form = useFormContext();
  
  const permissionOptions = [
    { id: "patient_read", label: "Voir les dossiers patients" },
    { id: "patient_write", label: "Modifier les dossiers patients" },
    { id: "appointment_manage", label: "Gérer les rendez-vous" },
    { id: "prescription_write", label: "Rédiger des ordonnances" },
    { id: "admin_access", label: "Accès administrateur" },
    { id: "billing_access", label: "Accès facturation" },
    { id: "laboratory_access", label: "Accès laboratoire" },
    { id: "pharmacy_access", label: "Accès pharmacie" },
  ];
  
  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-500 mb-4">
        Configurez les autorisations d'accès pour ce membre du personnel.
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {permissionOptions.map((permission) => (
          <Controller
            key={permission.id}
            control={form.control}
            name="permissions"
            render={({ field }) => {
              const isSelected = field.value?.includes(permission.id);
              return (
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={isSelected}
                    onCheckedChange={(checked) => {
                      const updatedPermissions = checked
                        ? [...(field.value || []), permission.id]
                        : (field.value || []).filter((p: string) => p !== permission.id);
                      field.onChange(updatedPermissions);
                    }}
                    id={permission.id}
                  />
                  <Label htmlFor={permission.id}>{permission.label}</Label>
                </div>
              );
            }}
          />
        ))}
      </div>
    </div>
  );
};

const StaffMemberDetail: React.FC<StaffMemberDetailProps> = ({ 
  staffMember, 
  onBack,
  onSave
}) => {
  const [activeTab, setActiveTab] = useState('general');
  
  // Default values for a new staff member
  const defaultValues: Partial<StaffMember> = {
    id: '',
    firstName: '',
    lastName: '',
    role: 'nurse' as const,
    department: '',
    email: '',
    phone: '',
    address: '',
    dateHired: new Date().toISOString().split('T')[0],
    status: 'active' as const,
    permissions: [],
    specialization: '',
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  // Initialize form with existing staff member data or default values
  const form = useForm({
    defaultValues: staffMember || defaultValues
  });
  
  const handleSubmit = (data: any) => {
    try {
      // For a new staff member, generate an ID
      if (!data.id) {
        data.id = `STAFF${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
      }
      
      // Update timestamps
      data.updatedAt = new Date().toISOString();
      if (!data.createdAt) {
        data.createdAt = new Date().toISOString();
      }
      
      // Call the parent save function
      onSave(data);
      
      toast({
        title: "Succès",
        description: "Les informations du membre du personnel ont été enregistrées.",
      });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button variant="ghost" onClick={onBack} className="mr-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour
        </Button>
        <h2 className="text-2xl font-bold">
          {staffMember ? `${staffMember.firstName} ${staffMember.lastName}` : 'Nouveau membre du personnel'}
        </h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserCog className="h-5 w-5 mr-2 text-blue-500" />
            Informations du personnel
          </CardTitle>
          <CardDescription>
            Consultez et modifiez les informations de ce membre du personnel
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                  <TabsTrigger value="general">Général</TabsTrigger>
                  <TabsTrigger value="professional">Professionnel</TabsTrigger>
                  <TabsTrigger value="emergency">Contact d'urgence</TabsTrigger>
                  <TabsTrigger value="permissions">Permissions</TabsTrigger>
                </TabsList>
                
                <div className="mt-6">
                  <TabsContent value="general">
                    <GeneralInfoTab />
                  </TabsContent>
                  
                  <TabsContent value="professional">
                    <ProfessionalInfoTab />
                  </TabsContent>
                  
                  <TabsContent value="emergency">
                    <EmergencyContactTab />
                  </TabsContent>
                  
                  <TabsContent value="permissions">
                    <PermissionsTab />
                  </TabsContent>
                </div>
              </Tabs>
              
              <div className="flex justify-end space-x-2 mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onBack}
                >
                  <X className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer
                </Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffMemberDetail;
