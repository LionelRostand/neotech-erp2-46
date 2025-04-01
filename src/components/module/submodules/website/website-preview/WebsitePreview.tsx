
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface WebsitePreviewProps {
  previewMode: boolean;
  activeTemplate: string | null;
  initialContent?: any[];
}

const WebsitePreview: React.FC<WebsitePreviewProps> = ({ 
  previewMode,
  activeTemplate,
  initialContent = []
}) => {
  return (
    <div className="h-full w-full bg-white">
      <div className="border-b p-2 flex items-center justify-between bg-muted/20">
        <div className="flex space-x-2">
          <span className="h-3 w-3 rounded-full bg-red-500"></span>
          <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
          <span className="h-3 w-3 rounded-full bg-green-500"></span>
        </div>
        <div className="px-3 py-1 rounded border border-gray-200 text-xs text-gray-600 bg-white">
          {activeTemplate ? `Template: ${activeTemplate}` : 'Aperçu du site'}
        </div>
        <div className="w-16"></div>
      </div>
      
      <div className="h-[calc(100%-36px)] overflow-auto">
        {initialContent && initialContent.length > 0 ? (
          <div className="p-4">
            {/* Rendu des blocs de contenu */}
            {initialContent.map((block, index) => (
              <div key={index} className="my-2 p-2 border rounded">
                {/* Contenu du bloc */}
                {JSON.stringify(block)}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4">
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="w-32 h-8 bg-gray-200 rounded"></div>
                    <div className="flex gap-2">
                      <div className="w-16 h-6 bg-gray-200 rounded"></div>
                      <div className="w-16 h-6 bg-gray-200 rounded"></div>
                      <div className="w-16 h-6 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  
                  {/* Hero section */}
                  <div className="rounded-lg bg-gray-100 h-80 flex flex-col items-center justify-center p-6">
                    <div className="w-3/4 h-10 bg-gray-200 rounded mb-4"></div>
                    <div className="w-1/2 h-6 bg-gray-200 rounded mb-6"></div>
                    <div className="flex gap-4">
                      <div className="w-32 h-10 bg-primary/20 rounded"></div>
                      <div className="w-32 h-10 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                  
                  {/* Features section */}
                  <div className="py-8">
                    <div className="text-center mb-6">
                      <div className="w-48 h-8 bg-gray-200 rounded mx-auto mb-2"></div>
                      <div className="w-64 h-6 bg-gray-100 rounded mx-auto"></div>
                    </div>
                    <div className="grid grid-cols-3 gap-6 mt-8">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-gray-200 rounded-full mb-3"></div>
                          <div className="w-full h-6 bg-gray-200 rounded mb-2"></div>
                          <div className="w-5/6 h-20 bg-gray-100 rounded"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* CTA section */}
                  <div className="bg-gray-100 rounded-lg p-8 flex flex-col items-center">
                    <div className="w-64 h-8 bg-gray-200 rounded mb-4"></div>
                    <div className="w-96 h-20 bg-gray-200 rounded mb-6"></div>
                    <div className="w-40 h-10 bg-primary/20 rounded"></div>
                  </div>
                  
                  {/* Footer */}
                  <div className="border-t pt-6 grid grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="space-y-2">
                        <div className="w-24 h-6 bg-gray-200 rounded"></div>
                        <div className="w-full h-4 bg-gray-100 rounded"></div>
                        <div className="w-full h-4 bg-gray-100 rounded"></div>
                        <div className="w-full h-4 bg-gray-100 rounded"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default WebsitePreview;
