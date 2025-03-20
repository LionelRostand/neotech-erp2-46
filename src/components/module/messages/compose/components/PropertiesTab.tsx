
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tag, X } from 'lucide-react';
import { MessageCategory, MessagePriority } from '../../types/message-types';

interface PropertiesTabProps {
  priority: MessagePriority;
  category: MessageCategory | undefined;
  tags: string[];
  currentTag: string;
  onPriorityChange: (value: MessagePriority) => void;
  onCategoryChange: (value: MessageCategory | undefined) => void;
  onCurrentTagChange: (value: string) => void;
  onAddTag: () => void;
  onRemoveTag: (tag: string) => void;
}

const PropertiesTab: React.FC<PropertiesTabProps> = ({
  priority,
  category,
  tags,
  currentTag,
  onPriorityChange,
  onCategoryChange,
  onCurrentTagChange,
  onAddTag,
  onRemoveTag
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Priorité */}
        <div className="space-y-2">
          <Label htmlFor="priority">Priorité</Label>
          <Select 
            value={priority} 
            onValueChange={(value) => onPriorityChange(value as MessagePriority)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une priorité" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Basse</SelectItem>
              <SelectItem value="normal">Normale</SelectItem>
              <SelectItem value="high">Haute</SelectItem>
              <SelectItem value="urgent">Urgente</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Catégorie */}
        <div className="space-y-2">
          <Label htmlFor="category">Catégorie</Label>
          <Select 
            value={category || ""} 
            onValueChange={(value) => onCategoryChange(value as MessageCategory || undefined)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une catégorie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Non catégorisé</SelectItem>
              <SelectItem value="general">Général</SelectItem>
              <SelectItem value="commercial">Commercial</SelectItem>
              <SelectItem value="support">Support</SelectItem>
              <SelectItem value="technical">Technique</SelectItem>
              <SelectItem value="administrative">Administratif</SelectItem>
              <SelectItem value="other">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Tags */}
      <div className="space-y-2">
        <Label htmlFor="tags">Tags</Label>
        <div className="flex items-center space-x-2">
          <Input
            value={currentTag}
            onChange={(e) => onCurrentTagChange(e.target.value)}
            placeholder="Ajouter un tag"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onAddTag();
              }
            }}
          />
          <Button 
            type="button" 
            variant="outline"
            onClick={onAddTag}
          >
            <Tag className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map(tag => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 p-0"
                onClick={() => onRemoveTag(tag)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
          {tags.length === 0 && (
            <span className="text-sm text-muted-foreground">
              Aucun tag ajouté
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertiesTab;
