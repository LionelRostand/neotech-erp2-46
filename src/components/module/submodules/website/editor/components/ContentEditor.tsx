
import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bold, Italic, Underline, Link, List, ListOrdered, Code, Image } from 'lucide-react';

interface ContentEditorProps {
  initialContent?: string;
  onChange: (content: string) => void;
  onSave: () => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({
  initialContent = '',
  onChange,
  onSave
}) => {
  const [content, setContent] = useState(initialContent);
  const [mode, setMode] = useState<'wysiwyg' | 'markdown' | 'html'>('wysiwyg');
  const [preview, setPreview] = useState(false);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    onChange(newContent);
  };

  const insertMarkdown = (markdownSyntax: string, placeholder: string = '') => {
    const textarea = document.getElementById('markdown-editor') as HTMLTextAreaElement;
    
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = textarea.value.substring(start, end);
      
      let newText = '';
      // If text is selected, wrap it with the markdown syntax
      if (selectedText) {
        newText = 
          textarea.value.substring(0, start) + 
          markdownSyntax.replace('{{text}}', selectedText) + 
          textarea.value.substring(end);
      } else {
        // If no text is selected, insert markdown with placeholder
        newText = 
          textarea.value.substring(0, start) + 
          markdownSyntax.replace('{{text}}', placeholder) + 
          textarea.value.substring(end);
      }
      
      handleContentChange(newText);
      
      // Set cursor position after insertion
      setTimeout(() => {
        textarea.focus();
        const cursorPos = start + markdownSyntax.indexOf('{{text}}') + placeholder.length;
        textarea.setSelectionRange(cursorPos, cursorPos + (selectedText ? selectedText.length : 0));
      }, 0);
    }
  };

  const renderMarkdownPreview = (markdown: string) => {
    // This is a very basic Markdown parser for preview purposes
    // In a real implementation, you would use a library like marked or remark
    let html = markdown
      // Headers
      .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
      .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
      .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Links
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
      // Images
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<img alt="$1" src="$2" />')
      // Lists
      .replace(/^\* (.*?)$/gm, '<ul><li>$1</li></ul>')
      .replace(/^\d\. (.*?)$/gm, '<ol><li>$1</li></ol>')
      // Line breaks
      .replace(/\n/g, '<br />');
      
    return html;
  };

  return (
    <div className="border rounded-md">
      <Tabs defaultValue="wysiwyg" value={mode} onValueChange={(value) => setMode(value as any)}>
        <div className="flex justify-between items-center p-2 border-b">
          <TabsList>
            <TabsTrigger value="wysiwyg">Éditeur Visuel</TabsTrigger>
            <TabsTrigger value="markdown">Markdown</TabsTrigger>
            <TabsTrigger value="html">HTML</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            {mode === 'markdown' && !preview && (
              <div className="flex space-x-1 mr-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => insertMarkdown('**{{text}}**', 'texte en gras')}
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => insertMarkdown('*{{text}}*', 'texte en italique')}
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => insertMarkdown('[{{text}}](https://example.com)', 'lien')}
                >
                  <Link className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => insertMarkdown('![{{text}}](https://example.com/image.jpg)', 'description')}
                >
                  <Image className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => insertMarkdown('* {{text}}', 'élément de liste')}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => insertMarkdown('1. {{text}}', 'élément numéroté')}
                >
                  <ListOrdered className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => insertMarkdown('`{{text}}`', 'code')}
                >
                  <Code className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            {mode === 'markdown' && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPreview(!preview)}
              >
                {preview ? 'Éditer' : 'Aperçu'}
              </Button>
            )}
            
            <Button size="sm" onClick={onSave}>Sauvegarder</Button>
          </div>
        </div>

        <TabsContent value="wysiwyg" className="p-0">
          <div className="p-4 min-h-[300px]">
            {/* Here would go a rich text editor like TinyMCE, CKEditor or Quill */}
            <div className="bg-muted/30 p-4 text-center h-full flex flex-col items-center justify-center">
              <p className="text-muted-foreground mb-4">Éditeur WYSIWYG</p>
              <p className="text-sm">Dans une implémentation réelle, un éditeur riche comme TinyMCE, CKEditor ou Quill serait intégré ici.</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="markdown" className="p-0">
          {preview ? (
            <div 
              className="p-4 min-h-[300px] prose prose-sm max-w-none" 
              dangerouslySetInnerHTML={{ __html: renderMarkdownPreview(content) }}
            />
          ) : (
            <Textarea
              id="markdown-editor"
              className="min-h-[300px] border-0 rounded-none font-mono"
              placeholder="Écrivez du contenu en Markdown..."
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
            />
          )}
        </TabsContent>

        <TabsContent value="html" className="p-0">
          <Textarea
            className="min-h-[300px] border-0 rounded-none font-mono"
            placeholder="Écrivez du code HTML personnalisé..."
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentEditor;
