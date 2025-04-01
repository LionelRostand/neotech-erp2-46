
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bold, Italic, List, ListOrdered, AlignLeft, AlignCenter, AlignRight, Code, Heading1, Heading2, Image, Link } from 'lucide-react';

interface ContentEditorProps {
  initialContent: string;
  onChange: (content: string) => void;
  onSave: () => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({
  initialContent,
  onChange,
  onSave
}) => {
  const [content, setContent] = useState(initialContent || '');
  const [editorMode, setEditorMode] = useState<'visual' | 'html' | 'markdown'>('visual');
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    onChange(e.target.value);
  };
  
  const insertFormat = (format: string) => {
    // Cette fonction ajouterait du formatage à l'éditeur visuel
    // Elle serait implémentée en fonction de l'éditeur WYSIWYG choisi
    console.log(`Inserting ${format} format`);
  };
  
  return (
    <div className="border rounded-md overflow-hidden">
      <Tabs defaultValue="visual" value={editorMode} onValueChange={(v) => setEditorMode(v as any)}>
        <div className="flex justify-between items-center px-3 py-2 border-b bg-muted/40">
          <TabsList>
            <TabsTrigger value="visual">Visuel</TabsTrigger>
            <TabsTrigger value="markdown">Markdown</TabsTrigger>
            <TabsTrigger value="html">HTML</TabsTrigger>
          </TabsList>
          <Button size="sm" onClick={onSave}>Enregistrer</Button>
        </div>
        
        <TabsContent value="visual" className="p-0">
          <div className="p-2 border-b bg-muted/20">
            <div className="flex flex-wrap gap-1">
              <Button variant="ghost" size="sm" onClick={() => insertFormat('bold')}>
                <Bold className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => insertFormat('italic')}>
                <Italic className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => insertFormat('h1')}>
                <Heading1 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => insertFormat('h2')}>
                <Heading2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => insertFormat('list')}>
                <List className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => insertFormat('ordered-list')}>
                <ListOrdered className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => insertFormat('align-left')}>
                <AlignLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => insertFormat('align-center')}>
                <AlignCenter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => insertFormat('align-right')}>
                <AlignRight className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => insertFormat('link')}>
                <Link className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => insertFormat('image')}>
                <Image className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="p-4 min-h-[300px]">
            <div className="prose max-w-none">
              <h1>Exemple de titre</h1>
              <p>Ceci est un exemple de contenu éditable. Dans une version complète, un éditeur WYSIWYG (TinyMCE, Quill, etc.) serait intégré ici.</p>
              <ul>
                <li>Élément de liste 1</li>
                <li>Élément de liste 2</li>
                <li>Élément de liste 3</li>
              </ul>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="markdown" className="p-0">
          <div className="p-2 border-b bg-muted/20">
            <div className="flex gap-1">
              <Button variant="ghost" size="sm" onClick={() => insertFormat('md-bold')}>
                <Bold className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => insertFormat('md-italic')}>
                <Italic className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => insertFormat('md-heading')}>
                <Heading1 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => insertFormat('md-link')}>
                <Link className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => insertFormat('md-code')}>
                <Code className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <textarea
            className="w-full h-[300px] p-4 font-mono text-sm"
            value={content || `# Titre\n\nCeci est un paragraphe en **markdown**.\n\n- Item 1\n- Item 2\n- Item 3`}
            onChange={handleContentChange}
            placeholder="Écrivez votre contenu en markdown ici..."
          ></textarea>
        </TabsContent>
        
        <TabsContent value="html" className="p-0">
          <textarea
            className="w-full h-[350px] p-4 font-mono text-sm"
            value={content || `<h1>Titre</h1>\n<p>Ceci est un paragraphe avec du <strong>HTML</strong>.</p>\n<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n  <li>Item 3</li>\n</ul>`}
            onChange={handleContentChange}
            placeholder="Écrivez votre HTML ici..."
          ></textarea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentEditor;
