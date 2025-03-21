
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Globe, CalendarCheck, MapPin, User, Clock, Car, CreditCard, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { TransportService } from './types/transport-types';
import { toast } from "sonner";

const TransportWebBooking = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    service: '' as TransportService,
    date: '',
    time: '',
    pickupAddress: '',
    dropoffAddress: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    passengers: '1',
    vehicleType: '',
    needsDriver: true,
    notes: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = () => {
    // Validate current step
    if (currentStep === 1) {
      if (!formData.service || !formData.date || !formData.time || !formData.pickupAddress || !formData.dropoffAddress) {
        toast.error("Veuillez remplir tous les champs obligatoires");
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        toast.error("Veuillez remplir tous les champs obligatoires");
        return;
      }
    } else if (currentStep === 3) {
      if (!formData.vehicleType) {
        toast.error("Veuillez sélectionner un type de véhicule");
        return;
      }
    }

    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real implementation, this would send the data to the server
    console.log("Booking submitted:", formData);
    
    // Show success message
    toast.success("Réservation envoyée avec succès! Nous vous contacterons bientôt pour confirmation.");
    
    // Reset form
    setFormData({
      service: '' as TransportService,
      date: '',
      time: '',
      pickupAddress: '',
      dropoffAddress: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      passengers: '1',
      vehicleType: '',
      needsDriver: true,
      notes: '',
    });
    
    // Reset to first step
    setCurrentStep(1);
  };

  const getServiceLabel = (service: string) => {
    switch (service) {
      case "airport-transfer": return "Transfert Aéroport";
      case "city-tour": return "Visite de ville";
      case "business-travel": return "Voyage d'affaires";
      case "wedding": return "Mariage";
      case "event": return "Événement";
      case "hourly-hire": return "Location à l'heure";
      case "long-distance": return "Longue distance";
      case "custom": return "Personnalisé";
      default: return service;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Réservation en Ligne</h2>
      </div>
      
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            <span>Interface de Réservation</span>
          </CardTitle>
          <CardDescription>
            Réservez nos services de transport en quelques étapes simples
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex flex-col items-center">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${currentStep >= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {step}
                  </div>
                  <span className="text-xs mt-1">
                    {step === 1 && "Service"}
                    {step === 2 && "Informations"}
                    {step === 3 && "Véhicule"}
                    {step === 4 && "Confirmation"}
                  </span>
                </div>
              ))}
            </div>
            <div className="w-full h-2 bg-muted rounded-full mt-2">
              <div 
                className="h-2 bg-primary rounded-full transition-all"
                style={{ width: `${(currentStep - 1) * 33.33}%` }}
              />
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            {/* Step 1: Service Details */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="service">Type de service *</Label>
                  <Select
                    value={formData.service}
                    onValueChange={(value) => handleSelectChange('service', value)}
                  >
                    <SelectTrigger id="service">
                      <SelectValue placeholder="Sélectionnez un service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="airport-transfer">Transfert Aéroport</SelectItem>
                      <SelectItem value="city-tour">Visite de ville</SelectItem>
                      <SelectItem value="business-travel">Voyage d'affaires</SelectItem>
                      <SelectItem value="wedding">Mariage</SelectItem>
                      <SelectItem value="event">Événement</SelectItem>
                      <SelectItem value="hourly-hire">Location à l'heure</SelectItem>
                      <SelectItem value="long-distance">Longue distance</SelectItem>
                      <SelectItem value="custom">Personnalisé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date *</Label>
                    <div className="relative">
                      <CalendarCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="date"
                        name="date"
                        type="date"
                        className="pl-10"
                        value={formData.date}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="time">Heure *</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="time"
                        name="time"
                        type="time"
                        className="pl-10"
                        value={formData.time}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="pickupAddress">Adresse de prise en charge *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="pickupAddress"
                      name="pickupAddress"
                      placeholder="Adresse complète, code postal, ville"
                      className="pl-10"
                      value={formData.pickupAddress}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="dropoffAddress">Adresse de destination *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="dropoffAddress"
                      name="dropoffAddress"
                      placeholder="Adresse complète, code postal, ville"
                      className="pl-10"
                      value={formData.dropoffAddress}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Step 2: Customer Information */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Prénom *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="firstName"
                        name="firstName"
                        placeholder="Prénom"
                        className="pl-10"
                        value={formData.firstName}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="lastName">Nom *</Label>
                    <Input 
                      id="lastName"
                      name="lastName"
                      placeholder="Nom"
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email"
                    name="email"
                    type="email"
                    placeholder="email@exemple.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Téléphone *</Label>
                  <Input 
                    id="phone"
                    name="phone"
                    placeholder="+33 6 12 34 56 78"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="passengers">Nombre de passagers</Label>
                  <Input 
                    id="passengers"
                    name="passengers"
                    type="number"
                    min="1"
                    max="20"
                    value={formData.passengers}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}
            
            {/* Step 3: Vehicle Selection */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="vehicleType">Type de véhicule *</Label>
                  <Select
                    value={formData.vehicleType}
                    onValueChange={(value) => handleSelectChange('vehicleType', value)}
                  >
                    <SelectTrigger id="vehicleType">
                      <SelectValue placeholder="Sélectionnez un véhicule" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedan">Berline (max. 4 personnes)</SelectItem>
                      <SelectItem value="suv">SUV (max. 5 personnes)</SelectItem>
                      <SelectItem value="van">Van (max. 8 personnes)</SelectItem>
                      <SelectItem value="minibus">Minibus (max. 16 personnes)</SelectItem>
                      <SelectItem value="luxury">Berline de luxe (max. 3 personnes)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="needsDriver"
                    checked={formData.needsDriver}
                    onChange={(e) => setFormData(prev => ({ ...prev, needsDriver: e.target.checked }))}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                  <Label htmlFor="needsDriver">Besoin d'un chauffeur</Label>
                </div>
                
                <div>
                  <Label htmlFor="notes">Remarques ou demandes spéciales</Label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Informations complémentaires, bagages, demandes particulières..."
                    value={formData.notes}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}
            
            {/* Step 4: Confirmation */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Résumé de votre réservation</h3>
                
                <div className="bg-muted p-4 rounded-lg space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-sm text-muted-foreground">Service:</div>
                    <div className="text-sm font-medium">{getServiceLabel(formData.service)}</div>
                    
                    <div className="text-sm text-muted-foreground">Date et heure:</div>
                    <div className="text-sm font-medium">{formData.date} à {formData.time}</div>
                    
                    <div className="text-sm text-muted-foreground">Prise en charge:</div>
                    <div className="text-sm font-medium">{formData.pickupAddress}</div>
                    
                    <div className="text-sm text-muted-foreground">Destination:</div>
                    <div className="text-sm font-medium">{formData.dropoffAddress}</div>
                    
                    <div className="text-sm text-muted-foreground">Client:</div>
                    <div className="text-sm font-medium">{formData.firstName} {formData.lastName}</div>
                    
                    <div className="text-sm text-muted-foreground">Contact:</div>
                    <div className="text-sm font-medium">{formData.email} / {formData.phone}</div>
                    
                    <div className="text-sm text-muted-foreground">Passagers:</div>
                    <div className="text-sm font-medium">{formData.passengers}</div>
                    
                    <div className="text-sm text-muted-foreground">Véhicule:</div>
                    <div className="text-sm font-medium">
                      {formData.vehicleType === 'sedan' && 'Berline (max. 4 personnes)'}
                      {formData.vehicleType === 'suv' && 'SUV (max. 5 personnes)'}
                      {formData.vehicleType === 'van' && 'Van (max. 8 personnes)'}
                      {formData.vehicleType === 'minibus' && 'Minibus (max. 16 personnes)'}
                      {formData.vehicleType === 'luxury' && 'Berline de luxe (max. 3 personnes)'}
                    </div>
                    
                    <div className="text-sm text-muted-foreground">Chauffeur:</div>
                    <div className="text-sm font-medium">{formData.needsDriver ? 'Oui' : 'Non'}</div>
                  </div>
                  
                  {formData.notes && (
                    <>
                      <Separator />
                      <div>
                        <div className="text-sm text-muted-foreground">Remarques:</div>
                        <div className="text-sm mt-1">{formData.notes}</div>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm mb-2">En confirmant cette réservation, vous acceptez nos conditions générales de service. Un membre de notre équipe vous contactera pour confirmer votre réservation et vous fournir un devis précis.</p>
                  
                  <div className="flex items-center space-x-2 mt-2">
                    <input
                      type="checkbox"
                      id="terms"
                      className="h-4 w-4 rounded border-gray-300"
                      required
                    />
                    <Label htmlFor="terms">J'accepte les conditions générales</Label>
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-between mt-8">
              {currentStep > 1 ? (
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handlePrevStep}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Précédent
                </Button>
              ) : (
                <div></div>
              )}
              
              {currentStep < 4 ? (
                <Button 
                  type="button" 
                  onClick={handleNextStep}
                  className="flex items-center gap-1"
                >
                  Suivant
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button 
                  type="submit"
                  className="flex items-center gap-1"
                >
                  <CreditCard className="h-4 w-4 mr-1" />
                  Confirmer la réservation
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="personal" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="personal">Clientèle Personnelle</TabsTrigger>
          <TabsTrigger value="business">Clientèle Professionnelle</TabsTrigger>
        </TabsList>
        <TabsContent value="personal" className="p-4 border rounded-md mt-2">
          <h3 className="text-lg font-semibold mb-2">Services pour particuliers</h3>
          <p>Notre service de réservation en ligne est parfait pour les particuliers souhaitant organiser leurs déplacements. Que ce soit pour un transfert aéroport, une visite touristique ou un événement spécial comme un mariage, notre flotte variée de véhicules répond à tous vos besoins.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Transferts Aéroport</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Service ponctuel de prise en charge à l'aéroport avec assistance bagages.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Visites Touristiques</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Découvrez la ville avec un chauffeur connaissant les meilleurs sites.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Événements Spéciaux</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Mariages, anniversaires, cérémonies - des véhicules adaptés à chaque occasion.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="business" className="p-4 border rounded-md mt-2">
          <h3 className="text-lg font-semibold mb-2">Services pour professionnels</h3>
          <p>Les entreprises peuvent bénéficier de notre plateforme de réservation pour gérer les déplacements professionnels. Avec des options de facturation entreprise et la possibilité de créer des comptes professionnels, nous simplifions la gestion des transports pour votre société.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Voyages d'Affaires</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Service premium pour vos collaborateurs et clients importants.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Transport d'Équipe</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Solutions pour déplacer vos équipes vers des événements ou séminaires.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Facturation Entreprise</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">Options de paiement différé et facturation mensuelle pour les professionnels.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TransportWebBooking;
