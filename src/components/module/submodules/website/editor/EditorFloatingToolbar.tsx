
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Link,
  Image,
  Code,
  List,
  ListOrdered,
  TextQuote,
  Heading1,
  Heading2,
  Heading3,
  Palette
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface EditorFloatingToolbarProps {
  position: { top: number; left: number };
  onFormatClick: (format: string) => void;
  onClose: () => void;
  visible: boolean;
}

const EditorFloatingToolbar: React.FC<EditorFloatingToolbarProps> = ({
  position,
  onFormatClick,
  onClose,
  visible
}) => {
  if (!visible) return null;

  return (
    <div 
      className="fixed z-50 bg-white border shadow-lg rounded-lg py-1 px-2 flex flex-wrap items-center gap-1"
      style={{
        top: position.top,
        left: position.left,
        transform: 'translateY(-100%)',
        maxWidth: '500px'
      }}
    >
      <Button variant="ghost" size="icon" onClick={() => onFormatClick('bold')}>
        <Bold className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => onFormatClick('italic')}>
        <Italic className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => onFormatClick('underline')}>
        <Underline className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      <Button variant="ghost" size="icon" onClick={() => onFormatClick('heading1')}>
        <Heading1 className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => onFormatClick('heading2')}>
        <Heading2 className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => onFormatClick('heading3')}>
        <Heading3 className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      <Button variant="ghost" size="icon" onClick={() => onFormatClick('alignLeft')}>
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => onFormatClick('alignCenter')}>
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => onFormatClick('alignRight')}>
        <AlignRight className="h-4 w-4" />
      </Button>
      
      <Separator orientation="vertical" className="h-6 mx-1" />
      
      <Button variant="ghost" size="icon" onClick={() => onFormatClick('link')}>
        <Link className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => onFormatClick('image')}>
        <Image className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => onFormatClick('list')}>
        <List className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => onFormatClick('orderedList')}>
        <ListOrdered className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => onFormatClick('quote')}>
        <TextQuote className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => onFormatClick('color')}>
        <Palette className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={() => onFormatClick('code')}>
        <Code className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default EditorFloatingToolbar;
