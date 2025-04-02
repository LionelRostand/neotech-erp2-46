
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MenuItem {
  id: string;
  label: string;
  url: string;
  isActive: boolean;
}

interface MenuEditorProps {
  initialMenuItems?: MenuItem[];
  onMenuChange?: (items: MenuItem[]) => void;
}

const MenuEditor: React.FC<MenuEditorProps> = ({ initialMenuItems = [], onMenuChange }) => {
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems.length > 0 ? initialMenuItems : [
    { id: '1', label: 'Accueil', url: '/', isActive: true },
    { id: '2', label: 'Nos Véhicules', url: '/vehicules', isActive: true },
    { id: '3', label: 'Tarifs', url: '/tarifs', isActive: true },
    { id: '4', label: 'Contact', url: '/contact', isActive: true },
  ]);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  const addMenuItem = () => {
    const newItem: MenuItem = {
      id: `item-${Date.now()}`,
      label: 'Nouveau menu',
      url: '/nouveau',
      isActive: true,
    };
    const newMenuItems = [...menuItems, newItem];
    setMenuItems(newMenuItems);
    if (onMenuChange) onMenuChange(newMenuItems);
  };

  const updateMenuItem = (index: number, field: keyof MenuItem, value: string | boolean) => {
    const updatedMenuItems = [...menuItems];
    updatedMenuItems[index] = { ...updatedMenuItems[index], [field]: value };
    setMenuItems(updatedMenuItems);
    if (onMenuChange) onMenuChange(updatedMenuItems);
  };

  const removeMenuItem = (index: number) => {
    const updatedMenuItems = menuItems.filter((_, idx) => idx !== index);
    setMenuItems(updatedMenuItems);
    if (onMenuChange) onMenuChange(updatedMenuItems);
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const updatedMenuItems = [...menuItems];
    const temp = updatedMenuItems[index];
    updatedMenuItems[index] = updatedMenuItems[index - 1];
    updatedMenuItems[index - 1] = temp;
    setMenuItems(updatedMenuItems);
    if (onMenuChange) onMenuChange(updatedMenuItems);
  };

  const moveDown = (index: number) => {
    if (index === menuItems.length - 1) return;
    const updatedMenuItems = [...menuItems];
    const temp = updatedMenuItems[index];
    updatedMenuItems[index] = updatedMenuItems[index + 1];
    updatedMenuItems[index + 1] = temp;
    setMenuItems(updatedMenuItems);
    if (onMenuChange) onMenuChange(updatedMenuItems);
  };

  const handleSaveMenu = () => {
    toast({
      title: "Menu sauvegardé",
      description: "Les modifications du menu ont été enregistrées avec succès.",
    });
    if (onMenuChange) onMenuChange(menuItems);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Configuration du menu</h3>
        <Button onClick={addMenuItem} size="sm" className="px-2">
          <Plus className="h-4 w-4 mr-1" /> Ajouter un item
        </Button>
      </div>

      <div className="space-y-2">
        {menuItems.map((item, index) => (
          <div 
            key={item.id} 
            className="flex items-center gap-2 p-2 bg-white border rounded-md shadow-sm"
          >
            <div className="flex items-center px-2 cursor-move">
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>
            <div className="flex-1 grid grid-cols-5 gap-2">
              <div className="col-span-2">
                <Input 
                  value={item.label} 
                  onChange={(e) => updateMenuItem(index, 'label', e.target.value)}
                  placeholder="Libellé du menu"
                />
              </div>
              <div className="col-span-2">
                <Input 
                  value={item.url} 
                  onChange={(e) => updateMenuItem(index, 'url', e.target.value)}
                  placeholder="URL (ex: /contact)"
                />
              </div>
              <div className="flex items-center">
                <input 
                  type="checkbox" 
                  id={`active-${item.id}`} 
                  checked={item.isActive} 
                  onChange={(e) => updateMenuItem(index, 'isActive', e.target.checked)}
                  className="mr-2 h-4 w-4"
                />
                <Label htmlFor={`active-${item.id}`} className="text-sm">Actif</Label>
              </div>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => moveUp(index)} disabled={index === 0}>
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => moveDown(index)} disabled={index === menuItems.length - 1}>
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => removeMenuItem(index)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button onClick={handleSaveMenu} className="mt-4">
        Enregistrer les modifications
      </Button>

      <div className="mt-4 p-4 border rounded-md bg-gray-50">
        <h4 className="text-sm font-medium mb-2">Aperçu du menu</h4>
        <div className="flex gap-4 p-2 bg-white border rounded">
          {menuItems
            .filter(item => item.isActive)
            .map(item => (
              <a 
                key={item.id} 
                href="#"
                className="text-sm px-2 py-1 text-[#ff5f00] hover:underline"
                onClick={(e) => e.preventDefault()}
              >
                {item.label}
              </a>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MenuEditor;
