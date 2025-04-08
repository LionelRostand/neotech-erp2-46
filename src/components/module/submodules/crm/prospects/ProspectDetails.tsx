
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Prospect } from '../types/crm-types';
import { formatDate } from '@/lib/formatters';
import { Building, Globe, Phone, Mail, MapPin, Calendar, CreditCard, Info } from 'lucide-react';

interface ProspectDetailsProps {
  prospect: Prospect;
}

const ProspectDetails: React.FC<ProspectDetailsProps> = ({ prospect }) => {
  // Helper function to get the badge class based on status
  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
        return 'bg-purple-100 text-purple-800';
      case 'meeting':
        return 'bg-green-100 text-green-800';
      case 'proposal':
        return 'bg-amber-100 text-amber-800';
      case 'negotiation':
        return 'bg-orange-100 text-orange-800';
      case 'converted':
        return 'bg-green-100 text-green-800';
      case 'lost':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to get status display text
  const getStatusText = (status: string): string => {
    switch (status) {
      case 'new':
        return 'Nouveau';
      case 'contacted':
        return 'Contacté';
      case 'meeting':
        return 'Rendez-vous';
      case 'proposal':
        return 'Proposition';
      case 'negotiation':
        return 'Négociation';
      case 'converted':
        return 'Converti';
      case 'lost':
        return 'Perdu';
      default:
        return 'Inconnu';
    }
  };

  // Helper function to format company size
  const getCompanySize = (size?: string): string => {
    switch (size) {
      case 'small':
        return 'Petite (1-50)';
      case 'medium':
        return 'Moyenne (51-250)';
      case 'large':
        return 'Grande (251-1000)';
      case 'enterprise':
        return 'Très grande (1000+)';
      default:
        return 'Non spécifié';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between">
        <div>
          <h2 className="text-2xl font-bold">{prospect.company}</h2>
          <p className="text-muted-foreground">{prospect.industry || 'Secteur non spécifié'}</p>
        </div>
        <Badge className={getStatusBadgeClass(prospect.status)}>
          {getStatusText(prospect.status)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Informations sur l'entreprise</h3>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Taille:</span>
              <span>{getCompanySize(prospect.size)}</span>
            </div>
            
            {prospect.website && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Site web:</span>
                <a href={prospect.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  {prospect.website}
                </a>
              </div>
            )}
            
            {prospect.address && (
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <span className="font-medium">Adresse:</span>
                <span>{prospect.address}</span>
              </div>
            )}
            
            {prospect.source && (
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Source:</span>
                <span>{prospect.source}</span>
              </div>
            )}
            
            {prospect.estimatedValue !== undefined && prospect.estimatedValue > 0 && (
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Valeur estimée:</span>
                <span>{prospect.estimatedValue.toLocaleString()} €</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Informations de contact</h3>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">Contact:</span>
              <span>{prospect.contactName || prospect.name || 'Non spécifié'}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Email:</span>
              <a href={`mailto:${prospect.contactEmail || prospect.email}`} className="text-blue-600 hover:underline">
                {prospect.contactEmail || prospect.email || 'Non spécifié'}
              </a>
            </div>
            
            {(prospect.contactPhone || prospect.phone) && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Téléphone:</span>
                <a href={`tel:${prospect.contactPhone || prospect.phone}`} className="text-blue-600 hover:underline">
                  {prospect.contactPhone || prospect.phone}
                </a>
              </div>
            )}
            
            {prospect.lastContact && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Dernier contact:</span>
                <span>{prospect.lastContact}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Ajouté le:</span>
              <span>{new Date(prospect.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
      
      {prospect.notes && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold border-b pb-2">Notes</h3>
          <p className="whitespace-pre-line">{prospect.notes}</p>
        </div>
      )}
    </div>
  );
};

export default ProspectDetails;
