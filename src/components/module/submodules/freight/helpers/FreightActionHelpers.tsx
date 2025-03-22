
import React, { useState } from 'react';
import { 
  Edit, 
  Trash2, 
  Eye, 
  Download, 
  Printer, 
  FileText, 
  Send, 
  Archive, 
  CalendarCheck, 
  BarChart4,
  BarChart,
  Mail,
  Building,
  Phone,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// Action Buttons Component
export const ActionButtons = ({ 
  type = "default", 
  onEdit, 
  onDelete, 
  onView, 
  onDownload,
  onPrint,
  onUse
}: { 
  type?: "default" | "document" | "template",
  onEdit?: () => void, 
  onDelete?: () => void,
  onView?: () => void,
  onDownload?: () => void,
  onPrint?: () => void,
  onUse?: () => void
}) => {
  return (
    <div className="flex justify-end gap-2">
      {type === "document" && (
        <>
          {onView && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" onClick={onView}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Visualiser</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {onDownload && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" onClick={onDownload}>
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Télécharger</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {onPrint && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" onClick={onPrint}>
                    <Printer className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Imprimer</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </>
      )}
      
      {type === "template" && (
        <>
          {onEdit && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" onClick={onEdit}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Modifier</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          
          {onUse && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" onClick={onUse}>
                    <FileText className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Utiliser</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </>
      )}
      
      {type === "default" && (
        <>
          {onEdit && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" onClick={onEdit}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Modifier</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </>
      )}
      
      {onDelete && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" className="text-destructive" onClick={onDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Supprimer</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </div>
  );
};

// Client Invite Dialog Component
export const ClientInviteDialog = ({ 
  isOpen, 
  onClose, 
  onInvite 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onInvite: (data: any) => void 
}) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    role: "client",
    message: ""
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleRoleChange = (value: string) => {
    setFormData({
      ...formData,
      role: value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onInvite(formData);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Inviter un nouveau client</DialogTitle>
          <DialogDescription>
            Envoyez une invitation d'accès au portail client.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Prénom"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Nom"
                required
              />
            </div>
            
            <div className="space-y-2 col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@entreprise.com"
                required
              />
            </div>
            
            <div className="space-y-2 col-span-2">
              <Label htmlFor="company">Entreprise</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Nom de l'entreprise"
                required
              />
            </div>
            
            <div className="space-y-2 col-span-2">
              <Label htmlFor="role">Niveau d'accès</Label>
              <Select
                value={formData.role}
                onValueChange={handleRoleChange}
              >
                <SelectTrigger id="role">
                  <SelectValue placeholder="Sélectionner un niveau d'accès" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Client standard</SelectItem>
                  <SelectItem value="admin">Administrateur</SelectItem>
                  <SelectItem value="readonly">Lecture seule</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 col-span-2">
              <Label htmlFor="message">Message personnalisé</Label>
              <Textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Message optionnel à inclure dans l'email d'invitation"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Annuler</Button>
            </DialogClose>
            <Button type="submit">Envoyer l'invitation</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Pricing Dialog Component
export const PricingDialog = ({ 
  isOpen, 
  onClose, 
  pricing, 
  onSave 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  pricing?: any, 
  onSave: (data: any) => void 
}) => {
  const [formData, setFormData] = useState({
    name: pricing?.name || "",
    basePrice: pricing?.basePrice || "0",
    weightFactor: pricing?.weightFactor || "0",
    distanceFactor: pricing?.distanceFactor || "0",
    volumeFactor: pricing?.volumeFactor || "0",
    description: pricing?.description || ""
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert string values to numbers for calculation
    const numericData = {
      ...formData,
      basePrice: parseFloat(formData.basePrice),
      weightFactor: parseFloat(formData.weightFactor),
      distanceFactor: parseFloat(formData.distanceFactor),
      volumeFactor: parseFloat(formData.volumeFactor)
    };
    onSave(numericData);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{pricing ? 'Modifier le modèle de tarification' : 'Nouveau modèle de tarification'}</DialogTitle>
          <DialogDescription>
            {pricing ? 'Modifier les détails du modèle de tarification existant.' : 'Créer un nouveau modèle de tarification pour les expéditions.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="name">Nom du modèle</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Tarif standard"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="basePrice">Prix de base (€)</Label>
              <Input
                id="basePrice"
                name="basePrice"
                type="number"
                step="0.01"
                min="0"
                value={formData.basePrice}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="weightFactor">Facteur poids (€/kg)</Label>
              <Input
                id="weightFactor"
                name="weightFactor"
                type="number"
                step="0.01"
                min="0"
                value={formData.weightFactor}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="distanceFactor">Facteur distance (€/km)</Label>
              <Input
                id="distanceFactor"
                name="distanceFactor"
                type="number"
                step="0.01"
                min="0"
                value={formData.distanceFactor}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="volumeFactor">Facteur volume (€/m³)</Label>
              <Input
                id="volumeFactor"
                name="volumeFactor"
                type="number"
                step="0.01"
                min="0"
                value={formData.volumeFactor}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2 col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description du modèle de tarification"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Annuler</Button>
            </DialogClose>
            <Button type="submit">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Promotion Dialog Component
export const PromotionDialog = ({ 
  isOpen, 
  onClose, 
  promotion, 
  onSave 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  promotion?: any, 
  onSave: (data: any) => void 
}) => {
  const [formData, setFormData] = useState({
    name: promotion?.name || "",
    code: promotion?.code || "",
    discount: promotion?.discount || "0",
    startDate: promotion?.startDate || new Date().toISOString().split('T')[0],
    endDate: promotion?.endDate || "",
    status: promotion?.status || "active",
    description: promotion?.description || ""
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleStatusChange = (value: string) => {
    setFormData({
      ...formData,
      status: value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert discount from string to number
    const numericData = {
      ...formData,
      discount: parseFloat(formData.discount)
    };
    onSave(numericData);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{promotion ? 'Modifier la promotion' : 'Nouvelle promotion'}</DialogTitle>
          <DialogDescription>
            {promotion ? 'Modifier les détails de la promotion existante.' : 'Créer une nouvelle promotion pour les clients.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="name">Nom de la promotion</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Promotion d'été"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="code">Code promotionnel</Label>
              <Input
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="Ex: ETE2023"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="discount">Réduction (%)</Label>
              <Input
                id="discount"
                name="discount"
                type="number"
                min="0"
                max="100"
                value={formData.discount}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startDate">Date de début</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endDate">Date de fin</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2 col-span-2">
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Sélectionner un statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="scheduled">Planifié</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description de la promotion"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Annuler</Button>
            </DialogClose>
            <Button type="submit">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Document Dialog Component
export const DocumentDialog = ({ 
  isOpen, 
  onClose, 
  onSave,
  document
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onSave: (data: any) => void,
  document?: any
}) => {
  const [formData, setFormData] = useState({
    name: document?.name || "",
    type: document?.type || "invoice",
    relatedShipment: document?.relatedShipment || "",
    file: document?.file || null,
    description: document?.description || ""
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleTypeChange = (value: string) => {
    setFormData({
      ...formData,
      type: value
    });
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({
        ...formData,
        file: e.target.files[0]
      });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{document ? 'Modifier le document' : 'Nouveau document'}</DialogTitle>
          <DialogDescription>
            {document ? 'Modifier les détails du document existant.' : 'Ajouter un nouveau document lié à une expédition.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="name">Nom du document</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ex: Facture EXP-1030"
                required
              />
            </div>
            
            <div className="space-y-2 col-span-2">
              <Label htmlFor="type">Type de document</Label>
              <Select
                value={formData.type}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="invoice">Facture</SelectItem>
                  <SelectItem value="bol">Connaissement</SelectItem>
                  <SelectItem value="customs">Document douanier</SelectItem>
                  <SelectItem value="contract">Contrat</SelectItem>
                  <SelectItem value="certificate">Certificat</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 col-span-2">
              <Label htmlFor="relatedShipment">Expédition liée</Label>
              <Input
                id="relatedShipment"
                name="relatedShipment"
                value={formData.relatedShipment}
                onChange={handleChange}
                placeholder="Ex: EXP-1030"
              />
            </div>
            
            <div className="space-y-2 col-span-2">
              <Label htmlFor="file">Fichier</Label>
              <Input
                id="file"
                name="file"
                type="file"
                onChange={handleFileChange}
                className="cursor-pointer"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
              />
              {formData.file && (
                <p className="text-sm text-muted-foreground mt-1">{typeof formData.file === 'string' ? formData.file : formData.file.name}</p>
              )}
            </div>
            
            <div className="space-y-2 col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description du document"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Annuler</Button>
            </DialogClose>
            <Button type="submit">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Price Calculator Component
export const PriceCalculator = () => {
  const [formData, setFormData] = useState({
    priceModel: "",
    weight: 0,
    volume: 0,
    distance: 0,
    additionalOptions: [],
    promoCode: ""
  });
  
  const [calculatedPrice, setCalculatedPrice] = useState<number | null>(null);
  
  const priceModels = [
    { id: "standard", name: "Standard" },
    { id: "express", name: "Express" },
    { id: "economic", name: "Économique" },
    { id: "international", name: "International" }
  ];
  
  const additionalOptions = [
    { id: "insurance", name: "Assurance", price: 15 },
    { id: "packaging", name: "Emballage spécial", price: 10 },
    { id: "notification", name: "Notifications SMS", price: 5 },
    { id: "priority", name: "Traitement prioritaire", price: 20 }
  ];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handlePriceModelChange = (value: string) => {
    setFormData({
      ...formData,
      priceModel: value
    });
  };
  
  const handleOptionChange = (optionId: string, checked: boolean) => {
    const currentOptions = [...formData.additionalOptions];
    
    if (checked) {
      if (!currentOptions.includes(optionId)) {
        currentOptions.push(optionId);
      }
    } else {
      const index = currentOptions.indexOf(optionId);
      if (index !== -1) {
        currentOptions.splice(index, 1);
      }
    }
    
    setFormData({
      ...formData,
      additionalOptions: currentOptions
    });
  };
  
  const calculatePrice = () => {
    // Base prices for different models
    const baseRates = {
      standard: { base: 15, weight: 1.2, volume: 5, distance: 0.5 },
      express: { base: 30, weight: 2, volume: 7, distance: 0.8 },
      economic: { base: 10, weight: 0.8, volume: 3, distance: 0.3 },
      international: { base: 50, weight: 3, volume: 10, distance: 0.2 }
    };
    
    // Fake promo code discount
    const promoDiscounts: {[key: string]: number} = {
      "SUMMER23": 0.15,
      "WELCOME10": 0.1,
      "SHIP25": 0.25
    };
    
    // Selected model rates or default to standard
    const selectedModel = formData.priceModel;
    const rates = selectedModel && baseRates[selectedModel as keyof typeof baseRates] 
      ? baseRates[selectedModel as keyof typeof baseRates] 
      : baseRates.standard;
    
    // Calculate base price
    let price = rates.base;
    
    // Add weight price
    price += formData.weight * rates.weight;
    
    // Add volume price
    price += formData.volume * rates.volume;
    
    // Add distance price
    price += formData.distance * rates.distance;
    
    // Add optional services
    formData.additionalOptions.forEach(optionId => {
      const option = additionalOptions.find(opt => opt.id === optionId);
      if (option) {
        price += option.price;
      }
    });
    
    // Apply promo code if valid
    if (formData.promoCode && promoDiscounts[formData.promoCode]) {
      const discount = promoDiscounts[formData.promoCode];
      price = price * (1 - discount);
    }
    
    setCalculatedPrice(price);
  };
  
  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    calculatePrice();
  };
  
  const handlePrint = () => {
    if (calculatedPrice === null) {
      // Calculate before printing if not already calculated
      calculatePrice();
    }
    
    // Create a printable version
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const selectedModel = priceModels.find(model => model.id === formData.priceModel)?.name || 'Standard';
      
      // Generate HTML content for printing
      printWindow.document.write(`
        <html>
          <head>
            <title>Devis d'expédition</title>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; padding: 20px; }
              h1, h2 { color: #333; }
              .container { max-width: 800px; margin: 0 auto; }
              .header { text-align: center; margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 20px; }
              .section { margin-bottom: 20px; }
              .details { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
              .item { margin-bottom: 10px; }
              .label { font-weight: bold; }
              .total { font-size: 1.2em; font-weight: bold; margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; }
              .footer { margin-top: 50px; font-size: 0.8em; text-align: center; color: #777; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Devis d'expédition</h1>
                <p>Date: ${new Date().toLocaleDateString()}</p>
              </div>
              
              <div class="section">
                <h2>Paramètres du calcul</h2>
                <div class="details">
                  <div class="item">
                    <div class="label">Modèle de tarification:</div>
                    <div>${selectedModel}</div>
                  </div>
                  <div class="item">
                    <div class="label">Poids:</div>
                    <div>${formData.weight} kg</div>
                  </div>
                  <div class="item">
                    <div class="label">Volume:</div>
                    <div>${formData.volume} m³</div>
                  </div>
                  <div class="item">
                    <div class="label">Distance:</div>
                    <div>${formData.distance} km</div>
                  </div>
                </div>
              </div>
              
              ${formData.additionalOptions.length > 0 ? `
                <div class="section">
                  <h2>Options supplémentaires</h2>
                  <ul>
                    ${formData.additionalOptions.map(optId => {
                      const option = additionalOptions.find(opt => opt.id === optId);
                      return option ? `<li>${option.name} (${option.price} €)</li>` : '';
                    }).join('')}
                  </ul>
                </div>
              ` : ''}
              
              ${formData.promoCode ? `
                <div class="section">
                  <h2>Promotion appliquée</h2>
                  <p>Code: ${formData.promoCode}</p>
                </div>
              ` : ''}
              
              <div class="total">
                Prix total estimé: ${calculatedPrice?.toFixed(2)} €
              </div>
              
              <div class="footer">
                <p>Ce devis est fourni à titre indicatif et peut être sujet à des modifications.</p>
                <p>Pour toute question, veuillez nous contacter au 01 23 45 67 89.</p>
              </div>
            </div>
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      // Slight delay to ensure content is loaded before printing
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };
  
  const handleExport = () => {
    if (calculatedPrice === null) {
      // Calculate before exporting if not already calculated
      calculatePrice();
    }
    
    // Create a CSV content
    const selectedModel = priceModels.find(model => model.id === formData.priceModel)?.name || 'Standard';
    
    const csvContent = [
      ['Devis d\'expédition', new Date().toISOString().split('T')[0]],
      [],
      ['Paramètres du calcul'],
      ['Modèle de tarification', selectedModel],
      ['Poids (kg)', formData.weight],
      ['Volume (m³)', formData.volume],
      ['Distance (km)', formData.distance],
      [],
      ['Options supplémentaires']
    ];
    
    formData.additionalOptions.forEach(optId => {
      const option = additionalOptions.find(opt => opt.id === optId);
      if (option) {
        csvContent.push([option.name, `${option.price} €`]);
      }
    });
    
    if (formData.promoCode) {
      csvContent.push([], ['Promotion appliquée', formData.promoCode]);
    }
    
    csvContent.push([], ['Prix total estimé', `${calculatedPrice?.toFixed(2)} €`]);
    
    // Convert to CSV format
    const csvString = csvContent.map(row => row.join(',')).join('\n');
    
    // Create a Blob with the CSV data
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    
    // Create a download link
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `devis-expedition-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <form onSubmit={handleCalculate} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="priceModel">Modèle de tarification</Label>
            <Select
              value={formData.priceModel}
              onValueChange={handlePriceModelChange}
            >
              <SelectTrigger id="priceModel">
                <SelectValue placeholder="Sélectionner un modèle" />
              </SelectTrigger>
              <SelectContent>
                {priceModels.map(model => (
                  <SelectItem key={model.id} value={model.id}>{model.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="weight">Poids (kg)</Label>
            <Input
              id="weight"
              name="weight"
              type="number"
              min="0"
              step="0.1"
              value={formData.weight}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="volume">Volume (m³)</Label>
            <Input
              id="volume"
              name="volume"
              type="number"
              min="0"
              step="0.01"
              value={formData.volume}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="distance">Distance (km)</Label>
            <Input
              id="distance"
              name="distance"
              type="number"
              min="0"
              value={formData.distance}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Options supplémentaires</Label>
            <div className="grid grid-cols-2 gap-2">
              {additionalOptions.map(option => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={option.id}
                    checked={formData.additionalOptions.includes(option.id)}
                    onCheckedChange={(checked) => {
                      handleOptionChange(option.id, checked === true);
                    }}
                  />
                  <Label htmlFor={option.id} className="text-sm">
                    {option.name} ({option.price} €)
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="promoCode">Code promotionnel</Label>
            <Input
              id="promoCode"
              name="promoCode"
              value={formData.promoCode}
              onChange={handleChange}
              placeholder="Ex: SUMMER23"
            />
          </div>
          
          <Button type="submit" className="w-full">Calculer le tarif</Button>
        </form>
      </div>
      
      <div>
        {calculatedPrice !== null ? (
          <Card>
            <CardHeader>
              <CardTitle>Résultat du calcul</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-sm text-muted-foreground">Modèle:</div>
                  <div>{priceModels.find(model => model.id === formData.priceModel)?.name || 'Standard'}</div>
                  
                  <div className="text-sm text-muted-foreground">Poids:</div>
                  <div>{formData.weight} kg</div>
                  
                  <div className="text-sm text-muted-foreground">Volume:</div>
                  <div>{formData.volume} m³</div>
                  
                  <div className="text-sm text-muted-foreground">Distance:</div>
                  <div>{formData.distance} km</div>
                </div>
                
                {formData.additionalOptions.length > 0 && (
                  <div>
                    <div className="text-sm font-medium mb-2">Options supplémentaires:</div>
                    <ul className="list-disc pl-5 space-y-1">
                      {formData.additionalOptions.map(optId => {
                        const option = additionalOptions.find(opt => opt.id === optId);
                        return option ? (
                          <li key={optId} className="text-sm">
                            {option.name} ({option.price} €)
                          </li>
                        ) : null;
                      })}
                    </ul>
                  </div>
                )}
                
                {formData.promoCode && (
                  <div>
                    <div className="text-sm font-medium mb-2">Promotion appliquée:</div>
                    <div className="text-sm">{formData.promoCode}</div>
                  </div>
                )}
                
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium">Prix total:</span>
                    <span className="text-xl font-bold">{calculatedPrice.toFixed(2)} €</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="h-4 w-4 mr-2" />
                Imprimer
              </Button>
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-6 bg-muted rounded-lg">
              <BarChart className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <h3 className="text-lg font-medium">Calculateur de tarifs</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Remplissez le formulaire et cliquez sur "Calculer le tarif" pour obtenir une estimation
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper functions for FreightDocuments.tsx
export const viewDocument = (document: any, { toast }: { toast: any }) => {
  // Simulate viewing a document
  toast({
    title: "Document ouvert",
    description: `Le document "${document.name}" a été ouvert en lecture.`,
  });
  
  // In a real implementation, this would open a document viewer
  window.open(`#/preview/document/${document.id}`, "_blank");
};

export const downloadDocument = (document: any, { toast }: { toast: any }) => {
  // Simulate downloading a document
  toast({
    title: "Téléchargement démarré",
    description: `Le document "${document.name}" est en cours de téléchargement.`,
  });
  
  // In a real implementation, this would trigger a file download
  setTimeout(() => {
    toast({
      title: "Téléchargement terminé",
      description: `Le document "${document.name}" a été téléchargé avec succès.`,
    });
  }, 1500);
};

export const printDocument = (document: any, { toast }: { toast: any }) => {
  // Simulate printing a document
  toast({
    title: "Impression en cours",
    description: `Le document "${document.name}" est envoyé à l'imprimante.`,
  });
};

export const exportDocuments = ({ toast }: { toast: any }) => {
  // Simulate exporting documents
  toast({
    title: "Export en cours",
    description: "Préparation de l'export des documents sélectionnés.",
  });
  
  // In a real implementation, this would create and download a zip file
  setTimeout(() => {
    toast({
      title: "Export terminé",
      description: "Les documents ont été exportés avec succès.",
    });
    
    // Create a fake CSV file and trigger download
    const csvContent = "id,name,type,format,size,date,shipment,creator\n" +
      "1,Facture EXP-1030,invoice,pdf,245 KB,2023-10-15,EXP-1030,Jean Dupont\n" +
      "2,Connaissement #BL-4582,bol,pdf,512 KB,2023-10-14,EXP-1029,Marie Martin\n" +
      "3,Documents douaniers,customs,pdf,1.2 MB,2023-10-14,EXP-1028,Pierre Dubois";
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'documents_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, 2000);
};

export const viewArchives = ({ toast }: { toast: any }) => {
  // Simulate viewing archives
  toast({
    title: "Archives ouvertes",
    description: "Consultation des archives de documents d'expédition.",
  });
  
  // In a real implementation, this would navigate to the archives page
  window.location.href = "#/modules/freight/documents/archives";
};
