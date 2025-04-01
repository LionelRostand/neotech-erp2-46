
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Globe2, Plus, ExternalLink, Check, Settings, AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';

interface Domain {
  id: string;
  name: string;
  status: 'active' | 'configuring' | 'error';
  primary: boolean;
  expiration?: Date;
}

const WebsiteDomains: React.FC = () => {
  const [domains, setDomains] = useState<Domain[]>([
    {
      id: '1',
      name: 'monentreprise.lovable.app',
      status: 'active',
      primary: true,
    }
  ]);
  const [newDomain, setNewDomain] = useState('');
  
  const handleAddDomain = () => {
    if (!newDomain) return;
    
    const domain = {
      id: Date.now().toString(),
      name: newDomain,
      status: 'configuring' as const,
      primary: domains.length === 0,
    };
    
    setDomains([...domains, domain]);
    setNewDomain('');
  };
  
  const setPrimaryDomain = (id: string) => {
    const updatedDomains = domains.map(domain => ({
      ...domain,
      primary: domain.id === id
    }));
    setDomains(updatedDomains);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Domaines & Serveurs</h1>
          <p className="text-sm text-muted-foreground">
            Gérez les domaines de votre site web et la configuration du serveur
          </p>
        </div>
      </div>

      <Tabs defaultValue="domains" className="w-full">
        <TabsList>
          <TabsTrigger value="domains" className="flex items-center">
            <Globe2 className="h-4 w-4 mr-2" />
            Domaines
          </TabsTrigger>
          <TabsTrigger value="server" className="flex items-center">
            <Settings className="h-4 w-4 mr-2" />
            Configuration serveur
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="domains" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Vos domaines</CardTitle>
                <CardDescription>
                  Connectez des domaines personnalisés à votre site web
                </CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un domaine
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajouter un domaine personnalisé</DialogTitle>
                    <DialogDescription>
                      Entrez le nom de domaine que vous souhaitez connecter à votre site web.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div>
                      <Input 
                        placeholder="exemple.com" 
                        value={newDomain}
                        onChange={(e) => setNewDomain(e.target.value)}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Assurez-vous d'être le propriétaire du domaine avant de l'ajouter. Vous devrez configurer votre DNS pour valider la propriété.
                    </p>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleAddDomain}>Ajouter le domaine</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {domains.length > 0 ? (
                <div className="space-y-4">
                  {domains.map((domain) => (
                    <div key={domain.id} className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center">
                        <Globe2 className="h-5 w-5 mr-3 text-muted-foreground" />
                        <div>
                          <p className="font-medium flex items-center">
                            {domain.name}
                            {domain.primary && (
                              <Badge className="ml-2" variant="outline">Par défaut</Badge>
                            )}
                          </p>
                          <div className="flex items-center mt-1">
                            {domain.status === 'active' ? (
                              <span className="text-xs flex items-center text-green-600">
                                <Check className="h-3 w-3 mr-1" />
                                Actif
                              </span>
                            ) : domain.status === 'configuring' ? (
                              <span className="text-xs flex items-center text-amber-600">
                                <Settings className="h-3 w-3 mr-1" />
                                Configuration en cours
                              </span>
                            ) : (
                              <span className="text-xs flex items-center text-red-600">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                Erreur de configuration
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {!domain.primary && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setPrimaryDomain(domain.id)}
                          >
                            Définir par défaut
                          </Button>
                        )}
                        <Button variant="outline" size="sm" className="flex items-center">
                          <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                          Visiter
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-12">
                  <Globe2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucun domaine configuré</h3>
                  <p className="text-muted-foreground mb-6">
                    Ajoutez votre premier domaine pour personnaliser l'URL de votre site web.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="server" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuration serveur</CardTitle>
              <CardDescription>
                Paramètres avancés de votre serveur web
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">SSL/HTTPS</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-green-600">
                          <Check className="h-4 w-4 mr-1.5" />
                          <span className="text-sm">Activé</span>
                        </div>
                        <Button variant="outline" size="sm">Configurer</Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Redirection</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-amber-600">
                          <AlertTriangle className="h-4 w-4 mr-1.5" />
                          <span className="text-sm">Non configuré</span>
                        </div>
                        <Button variant="outline" size="sm">Configurer</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WebsiteDomains;
