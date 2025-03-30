
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { X, Copy, CheckCheck } from 'lucide-react';

interface DevModePanelProps {
  onClose: () => void;
}

const DevModePanel: React.FC<DevModePanelProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);

  const htmlCode = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ma Page</title>
  <link href="styles.css" rel="stylesheet">
</head>
<body>
  <header class="header">
    <h1>Mon Site Web</h1>
    <p>Bienvenue sur mon site</p>
  </header>
  
  <section class="main-section">
    <h2>Section Principale</h2>
    <p>Ceci est un exemple de section. Vous pouvez modifier ce contenu en cliquant dessus.</p>
    <button class="btn-primary">En savoir plus</button>
  </section>
  
  <div class="image-container">
    <img src="https://via.placeholder.com/800x400" alt="Placeholder">
  </div>
  
  <script src="script.js"></script>
</body>
</html>
`;

  const cssCode = `
/* Variables */
:root {
  --primary-color: #3490dc;
  --secondary-color: #ffed4a;
  --dark-color: #212121;
  --light-color: #f8f9fa;
}

/* Base styles */
body {
  font-family: 'Segoe UI', sans-serif;
  line-height: 1.6;
  color: var(--dark-color);
  margin: 0;
  padding: 0;
}

.header {
  background-color: rgba(52, 144, 220, 0.1);
  padding: 1rem;
}

.main-section {
  padding: 1.5rem;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
}

.image-container {
  padding: 1rem;
}

.image-container img {
  width: 100%;
  height: auto;
  border-radius: 0.25rem;
}
`;

  const jsCode = `
// Interactivité des boutons
document.querySelectorAll('.btn-primary').forEach(button => {
  button.addEventListener('click', function() {
    alert('Bouton cliqué !');
  });
});

// Animation au défilement
document.addEventListener('DOMContentLoaded', function() {
  const elements = document.querySelectorAll('.main-section');
  
  function checkVisibility() {
    elements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      
      if (rect.top <= windowHeight * 0.75) {
        el.classList.add('visible');
      }
    });
  }
  
  window.addEventListener('scroll', checkVisibility);
  checkVisibility();
});
`;

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center py-2 px-4 border-b">
        <h3 className="font-medium">Mode développeur</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <Tabs defaultValue="html" className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="html">HTML</TabsTrigger>
          <TabsTrigger value="css">CSS</TabsTrigger>
          <TabsTrigger value="js">JavaScript</TabsTrigger>
        </TabsList>
        
        <TabsContent value="html" className="flex-1 relative">
          <div className="absolute top-2 right-2 z-10">
            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(htmlCode)}>
              {copied ? <CheckCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <pre className="bg-muted p-4 rounded text-xs overflow-auto h-full">
            <code>{htmlCode}</code>
          </pre>
        </TabsContent>
        
        <TabsContent value="css" className="flex-1 relative">
          <div className="absolute top-2 right-2 z-10">
            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(cssCode)}>
              {copied ? <CheckCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <pre className="bg-muted p-4 rounded text-xs overflow-auto h-full">
            <code>{cssCode}</code>
          </pre>
        </TabsContent>
        
        <TabsContent value="js" className="flex-1 relative">
          <div className="absolute top-2 right-2 z-10">
            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(jsCode)}>
              {copied ? <CheckCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <pre className="bg-muted p-4 rounded text-xs overflow-auto h-full">
            <code>{jsCode}</code>
          </pre>
        </TabsContent>
      </Tabs>
      
      <Separator />
      <div className="p-2 text-xs text-muted-foreground">
        <p>Les modifications de code prendront effet après enregistrement</p>
      </div>
    </div>
  );
};

export default DevModePanel;
