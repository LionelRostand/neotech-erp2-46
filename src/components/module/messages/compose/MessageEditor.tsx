
import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Link, 
  ListOrdered, 
  ListChecks, 
  AlignLeft, 
  AlignCenter, 
  AlignRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from '@/components/ui/toggle-group';

interface MessageEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const MessageEditor: React.FC<MessageEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Synchroniser le contenu HTML avec la valeur
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const execCommand = (command: string, value: string | null = null) => {
    document.execCommand(command, false, value);
    updateValue();
  };

  const updateValue = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleEditorInput = () => {
    updateValue();
  };

  const handleAlignment = (value: string) => {
    switch (value) {
      case 'left':
        execCommand('justifyLeft');
        break;
      case 'center':
        execCommand('justifyCenter');
        break;
      case 'right':
        execCommand('justifyRight');
        break;
      default:
        break;
    }
  };

  const handleAddLink = () => {
    const url = prompt('Entrez l\'URL du lien:');
    if (url) {
      execCommand('createLink', url);
    }
  };

  return (
    <div className="border rounded-md overflow-hidden">
      <div className="bg-gray-50 p-2 border-b flex flex-wrap gap-1">
        <Button 
          type="button" 
          variant="ghost" 
          size="icon"
          onClick={() => execCommand('bold')}
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="icon"
          onClick={() => execCommand('italic')}
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="icon"
          onClick={handleAddLink}
        >
          <Link className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="icon"
          onClick={() => execCommand('insertOrderedList')}
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="icon"
          onClick={() => execCommand('insertUnorderedList')}
        >
          <ListChecks className="h-4 w-4" />
        </Button>
        
        <div className="border-l mx-1 h-6"></div>
        
        <ToggleGroup type="single" onValueChange={handleAlignment}>
          <ToggleGroupItem value="left" size="sm">
            <AlignLeft className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="center" size="sm">
            <AlignCenter className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="right" size="sm">
            <AlignRight className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      
      <div
        ref={editorRef}
        className="p-3 min-h-[200px] focus:outline-none"
        contentEditable
        onInput={handleEditorInput}
        onBlur={handleEditorInput}
      />
    </div>
  );
};

export default MessageEditor;
