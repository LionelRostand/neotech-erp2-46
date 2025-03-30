
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Link,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Undo,
  Redo,
  Copy,
  Trash,
  Palette,
  MoveVertical,
  MoveHorizontal
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const EditorToolbar = () => {
  return (
    <div className="border-b p-2 flex items-center space-x-1 overflow-x-auto">
      <Button variant="ghost" size="sm">
        <Undo className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm">
        <Redo className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      <Button variant="ghost" size="sm">
        <Bold className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm">
        <Italic className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm">
        <Underline className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      <Button variant="ghost" size="sm">
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm">
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm">
        <AlignRight className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm">
        <AlignJustify className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      <Button variant="ghost" size="sm">
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm">
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm">
        <List className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm">
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm">
        <Link className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      <Button variant="ghost" size="sm">
        <Palette className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm">
        <MoveVertical className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm">
        <MoveHorizontal className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      <Button variant="ghost" size="sm">
        <Copy className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm">
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default EditorToolbar;
