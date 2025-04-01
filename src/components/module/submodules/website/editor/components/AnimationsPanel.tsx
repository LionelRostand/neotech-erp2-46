
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { ArrowRight } from 'lucide-react';

interface AnimationsPanelProps {
  onApplyAnimation: (animation: AnimationConfig) => void;
}

export interface AnimationConfig {
  type: string;
  duration: number;
  delay: number;
  easing: string;
  direction?: string;
  iterations?: number;
  trigger?: 'load' | 'scroll' | 'hover' | 'click';
  custom?: string;
}

const predefinedAnimations = [
  { name: 'Fade In', value: 'fade-in', preview: 'animate-fade-in' },
  { name: 'Slide In (Left)', value: 'slide-in-left', preview: 'animate-slide-in-left' },
  { name: 'Slide In (Right)', value: 'slide-in-right', preview: 'animate-slide-in-right' },
  { name: 'Bounce', value: 'bounce', preview: 'animate-bounce' },
  { name: 'Scale Up', value: 'scale-up', preview: 'animate-scale-in' },
  { name: 'Pulse', value: 'pulse', preview: 'animate-pulse' },
  { name: 'Spin', value: 'spin', preview: 'animate-spin' },
  { name: 'Flip', value: 'flip', preview: 'animate-flip' },
];

const AnimationsPanel: React.FC<AnimationsPanelProps> = ({ onApplyAnimation }) => {
  const [activeTab, setActiveTab] = useState('preset');
  const [selectedAnimation, setSelectedAnimation] = useState<string>('fade-in');
  const [duration, setDuration] = useState<number>(300);
  const [delay, setDelay] = useState<number>(0);
  const [easing, setEasing] = useState<string>('ease');
  const [trigger, setTrigger] = useState<'load' | 'scroll' | 'hover' | 'click'>('load');
  const [iterations, setIterations] = useState<number>(1);
  const [infinite, setInfinite] = useState<boolean>(false);
  const [direction, setDirection] = useState<string>('normal');
  const [customCSS, setCustomCSS] = useState<string>('');
  const [previewActive, setPreviewActive] = useState<boolean>(false);

  const handleApplyAnimation = () => {
    onApplyAnimation({
      type: activeTab === 'preset' ? selectedAnimation : 'custom',
      duration,
      delay,
      easing,
      direction,
      iterations: infinite ? -1 : iterations,
      trigger,
      custom: activeTab === 'custom' ? customCSS : undefined,
    });
  };

  const triggerPreview = () => {
    setPreviewActive(false);
    setTimeout(() => setPreviewActive(true), 10);
  };

  const getAnimationClass = () => {
    const animation = predefinedAnimations.find(a => a.value === selectedAnimation);
    return animation ? animation.preview : '';
  };

  return (
    <div className="space-y-4 p-4 max-w-md">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Animations</h3>
        <Button size="sm" onClick={handleApplyAnimation}>Appliquer</Button>
      </div>

      <Tabs defaultValue="preset" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="preset">Prédéfinies</TabsTrigger>
          <TabsTrigger value="custom">Personnalisées</TabsTrigger>
        </TabsList>

        <TabsContent value="preset" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="animation-type">Type d'animation</Label>
            <Select 
              value={selectedAnimation} 
              onValueChange={(value) => {
                setSelectedAnimation(value);
                triggerPreview();
              }}
            >
              <SelectTrigger id="animation-type">
                <SelectValue placeholder="Sélectionner une animation" />
              </SelectTrigger>
              <SelectContent>
                {predefinedAnimations.map((animation) => (
                  <SelectItem key={animation.value} value={animation.value}>
                    {animation.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-md p-6 flex justify-center items-center bg-muted/30 relative overflow-hidden">
            <div 
              className={`p-4 bg-primary text-primary-foreground rounded-md flex items-center justify-center ${previewActive ? getAnimationClass() : ''}`}
              style={{ 
                animationDuration: `${duration}ms`,
                animationDelay: `${delay}ms`, 
                animationTimingFunction: easing,
                animationDirection: direction as any,
                animationIterationCount: infinite ? 'infinite' : iterations.toString()
              }}
            >
              <ArrowRight className="mr-2 h-5 w-5" /> Aperçu Animation
            </div>
            <Button 
              variant="secondary" 
              size="sm" 
              className="absolute bottom-2 right-2"
              onClick={triggerPreview}
            >
              Rejouer
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="custom-css">CSS personnalisé</Label>
            <Textarea
              id="custom-css"
              placeholder="@keyframes custom-animation { /* ... */ }"
              value={customCSS}
              onChange={(e) => setCustomCSS(e.target.value)}
              className="font-mono text-sm min-h-[150px]"
            />
          </div>
        </TabsContent>
      </Tabs>

      <div className="space-y-4 pt-2">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="duration">Durée ({duration}ms)</Label>
          </div>
          <Slider
            id="duration"
            min={100}
            max={2000}
            step={100}
            value={[duration]}
            onValueChange={(value) => setDuration(value[0])}
            className="cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="delay">Délai ({delay}ms)</Label>
          </div>
          <Slider
            id="delay"
            min={0}
            max={2000}
            step={100}
            value={[delay]}
            onValueChange={(value) => setDelay(value[0])}
            className="cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="easing">Effet de transition</Label>
            <Select value={easing} onValueChange={setEasing}>
              <SelectTrigger id="easing">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ease">Ease</SelectItem>
                <SelectItem value="ease-in">Ease In</SelectItem>
                <SelectItem value="ease-out">Ease Out</SelectItem>
                <SelectItem value="ease-in-out">Ease In Out</SelectItem>
                <SelectItem value="linear">Linear</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="trigger">Déclencheur</Label>
            <Select value={trigger} onValueChange={(value: any) => setTrigger(value)}>
              <SelectTrigger id="trigger">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="load">Chargement</SelectItem>
                <SelectItem value="scroll">Défilement</SelectItem>
                <SelectItem value="hover">Survol</SelectItem>
                <SelectItem value="click">Clic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="iterations">Nombre de répétitions</Label>
            <Input
              id="iterations"
              type="number"
              min={1}
              value={iterations}
              onChange={(e) => setIterations(parseInt(e.target.value) || 1)}
              disabled={infinite}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="direction">Direction</Label>
            <Select value={direction} onValueChange={setDirection}>
              <SelectTrigger id="direction">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="reverse">Inversée</SelectItem>
                <SelectItem value="alternate">Alternée</SelectItem>
                <SelectItem value="alternate-reverse">Alternée inversée</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <Switch
            id="infinite"
            checked={infinite}
            onCheckedChange={setInfinite}
          />
          <Label htmlFor="infinite">Animation infinie</Label>
        </div>
      </div>
    </div>
  );
};

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={`flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        ref={ref}
        {...props}
      />
    )
  }
);
Textarea.displayName = "Textarea";

export default AnimationsPanel;
