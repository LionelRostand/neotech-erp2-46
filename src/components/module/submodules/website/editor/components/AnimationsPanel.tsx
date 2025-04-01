
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Play } from 'lucide-react';

export interface AnimationConfig {
  type: string;
  duration: number;
  delay: number;
  curve: string;
  repeat: number;
  direction: 'normal' | 'reverse' | 'alternate';
}

interface AnimationsPanelProps {
  onApplyAnimation: (config: AnimationConfig) => void;
}

const AnimationsPanel: React.FC<AnimationsPanelProps> = ({ onApplyAnimation }) => {
  const [animation, setAnimation] = useState<AnimationConfig>({
    type: 'fade-in',
    duration: 1000,
    delay: 0,
    curve: 'ease-in-out',
    repeat: 0,
    direction: 'normal'
  });

  const handleChange = (key: keyof AnimationConfig, value: string | number) => {
    setAnimation(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApply = () => {
    onApplyAnimation(animation);
  };

  const previewAnimation = () => {
    // Prévisualisation de l'animation serait implémentée ici
    console.log('Prévisualisation:', animation);
  };

  return (
    <div className="p-4 space-y-8">
      <div className="space-y-6">
        <h3 className="text-sm font-semibold text-muted-foreground tracking-wide uppercase">
          Configuration de l'animation
        </h3>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="animation-type">Type d'animation</Label>
            <Select 
              value={animation.type} 
              onValueChange={(value) => handleChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fade-in">Fondu (Fade In)</SelectItem>
                <SelectItem value="slide-up">Glissement vers le haut</SelectItem>
                <SelectItem value="slide-down">Glissement vers le bas</SelectItem>
                <SelectItem value="slide-left">Glissement vers la gauche</SelectItem>
                <SelectItem value="slide-right">Glissement vers la droite</SelectItem>
                <SelectItem value="zoom-in">Zoom avant</SelectItem>
                <SelectItem value="zoom-out">Zoom arrière</SelectItem>
                <SelectItem value="bounce">Rebond</SelectItem>
                <SelectItem value="rotate">Rotation</SelectItem>
                <SelectItem value="pulse">Pulse</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="duration">Durée (ms): {animation.duration}</Label>
            </div>
            <Slider 
              id="duration"
              value={[animation.duration]}
              min={100}
              max={5000}
              step={100}
              onValueChange={(value) => handleChange('duration', value[0])}
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="delay">Délai (ms): {animation.delay}</Label>
            </div>
            <Slider 
              id="delay"
              value={[animation.delay]}
              min={0}
              max={2000}
              step={100}
              onValueChange={(value) => handleChange('delay', value[0])}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="curve">Courbe d'animation</Label>
            <Select 
              value={animation.curve} 
              onValueChange={(value) => handleChange('curve', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Courbe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="linear">Linéaire</SelectItem>
                <SelectItem value="ease">Ease</SelectItem>
                <SelectItem value="ease-in">Ease In</SelectItem>
                <SelectItem value="ease-out">Ease Out</SelectItem>
                <SelectItem value="ease-in-out">Ease In Out</SelectItem>
                <SelectItem value="cubic-bezier">Cubic Bezier</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="repeat">Répétitions</Label>
            <Select 
              value={animation.repeat.toString()} 
              onValueChange={(value) => handleChange('repeat', parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Répétitions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Aucune</SelectItem>
                <SelectItem value="1">1 fois</SelectItem>
                <SelectItem value="2">2 fois</SelectItem>
                <SelectItem value="3">3 fois</SelectItem>
                <SelectItem value="5">5 fois</SelectItem>
                <SelectItem value="10">10 fois</SelectItem>
                <SelectItem value="-1">Infini</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="direction">Direction</Label>
            <Select 
              value={animation.direction} 
              onValueChange={(value) => handleChange('direction', value as 'normal' | 'reverse' | 'alternate')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Direction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="reverse">Inverse</SelectItem>
                <SelectItem value="alternate">Alternée</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      <Card className="mt-6">
        <CardContent className="p-4">
          <h3 className="text-sm font-medium mb-4">Prévisualisation</h3>
          <div className="bg-muted/50 h-32 flex items-center justify-center rounded-md">
            <div className="text-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={previewAnimation}
                className="mb-2"
              >
                <Play className="h-4 w-4 mr-2" />
                Prévisualiser
              </Button>
              <p className="text-xs text-muted-foreground">Cliquez pour tester l'animation</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button onClick={handleApply}>Appliquer l'animation</Button>
      </div>
    </div>
  );
};

export default AnimationsPanel;
