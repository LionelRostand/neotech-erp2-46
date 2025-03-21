
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, Phone, Mail, Star, Calendar, DollarSign, Award, Clock, 
  Scissors, FileText, BarChart2, BookOpen 
} from "lucide-react";
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface StylistDetailsProps {
  stylist: any;
}

const StylistPerformanceData = {
  rendezVous: [
    { month: "Jan", count: 45 },
    { month: "Fév", count: 48 },
    { month: "Mar", count: 52 },
    { month: "Avr", count: 50 },
    { month: "Mai", count: 58 },
    { month: "Juin", count: 63 }
  ],
  satisfaction: [
    { label: "Très satisfait", value: 78 },
    { label: "Satisfait", value: 18 },
    { label: "Insatisfait", value: 4 }
  ],
  servicesTop: [
    { service: "Coupe femme", count: 102 },
    { service: "Coloration", count: 84 },
    { service: "Mèches", count: 63 },
    { service: "Brushing", count: 53 },
    { service: "Balayage", count: 34 }
  ],
  commissions: [
    { month: "Janvier", amount: 1250 },
    { month: "Février", amount: 1320 },
    { month: "Mars", amount: 1450 },
    { month: "Avril", amount: 1380 },
    { month: "Mai", amount: 1520 },
    { month: "Juin", amount: 1620 }
  ]
};

const StylistDetails: React.FC<StylistDetailsProps> = ({ stylist }) => {
  const { toast } = useToast();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="flex flex-col items-center space-y-2">
          <Avatar className="w-32 h-32">
            <AvatarImage src={stylist?.avatar || ""} />
            <AvatarFallback className="text-2xl">{stylist.firstName.charAt(0)}{stylist.lastName.charAt(0)}</AvatarFallback>
          </Avatar>
          <h3 className="font-bold text-xl">{stylist.firstName} {stylist.lastName}</h3>
          <Badge className={`
            ${stylist.status === 'available' ? 'bg-green-100 text-green-800' : 
              stylist.status === 'busy' ? 'bg-blue-100 text-blue-800' : 
              'bg-orange-100 text-orange-800'}
          `}>
            {stylist.status === 'available' ? 'Disponible' : 
             stylist.status === 'busy' ? 'Occupé' : 'Absent'}
          </Badge>
        </div>
        
        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <User className="h-4 w-4 mr-2" />
                <span>Informations personnelles</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{stylist.phone}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{stylist.email}</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Scissors className="h-4 w-4 mr-2" />
                <span>Activité professionnelle</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Expérience: {stylist.experience} ans</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>Commission: {stylist.commissionRate || 30}%</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Star className="h-4 w-4 mr-2" />
              <span>Spécialités</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {stylist.specialties.map((specialty, idx) => (
                <Badge key={idx} variant="outline">
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>
          
          {stylist.bio && (
            <div className="space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4 mr-2" />
                <span>Biographie</span>
              </div>
              <p className="text-sm">{stylist.bio}</p>
            </div>
          )}
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => toast({
              title: "Fonctionnalité à venir",
              description: "L'envoi de message sera disponible prochainement"
            })}>
              Envoyer un message
            </Button>
            <Button variant="outline" onClick={() => toast({
              title: "Fonctionnalité à venir",
              description: "L'export des données sera disponible prochainement"
            })}>
              Exporter les données
            </Button>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <Tabs defaultValue="appointments" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="appointments">
            <Calendar className="h-4 w-4 mr-2" />
            Rendez-vous
          </TabsTrigger>
          <TabsTrigger value="performance">
            <BarChart2 className="h-4 w-4 mr-2" />
            Performances
          </TabsTrigger>
          <TabsTrigger value="commissions">
            <DollarSign className="h-4 w-4 mr-2" />
            Commissions
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="appointments" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Prochains rendez-vous</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { client: "Marie Dupont", service: "Coupe + Brushing", time: "Aujourd'hui, 14h30" },
                    { client: "Thomas Lefèvre", service: "Coupe Homme", time: "Aujourd'hui, 15h45" },
                    { client: "Lucie Martin", service: "Coloration", time: "Demain, 10h00" },
                    { client: "Sophie Bernard", service: "Balayage + Coupe", time: "Demain, 14h00" }
                  ].map((appointment, idx) => (
                    <div key={idx} className="flex items-center justify-between pb-2 border-b last:border-b-0">
                      <div>
                        <div className="font-medium">{appointment.client}</div>
                        <div className="text-sm text-muted-foreground">{appointment.service}</div>
                      </div>
                      <div className="text-sm">{appointment.time}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Historique des rendez-vous</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { client: "Jean Dubois", service: "Coupe Homme", time: "Hier, 11h00", status: "completed" },
                    { client: "Camille Rousseau", service: "Mèches + Coupe", time: "10/06/2023", status: "completed" },
                    { client: "Marc Laurent", service: "Coupe Homme + Barbe", time: "05/06/2023", status: "completed" },
                    { client: "Emma Petit", service: "Couleur + Coupe", time: "01/06/2023", status: "completed" }
                  ].map((appointment, idx) => (
                    <div key={idx} className="flex items-center justify-between pb-2 border-b last:border-b-0">
                      <div>
                        <div className="font-medium">{appointment.client}</div>
                        <div className="text-sm text-muted-foreground">{appointment.service}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="text-sm">{appointment.time}</div>
                        <Badge className="bg-green-100 text-green-800">Terminé</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Rendez-vous par mois</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-60 grid grid-cols-6 gap-2 items-end">
                {StylistPerformanceData.rendezVous.map((item, idx) => (
                  <div key={idx} className="flex flex-col items-center">
                    <div className="h-full w-full flex items-end">
                      <div 
                        className="w-12 bg-blue-500 rounded-t" 
                        style={{ height: `${(item.count / 70) * 100}%` }}
                      ></div>
                    </div>
                    <div className="mt-2 text-sm">{item.month}</div>
                    <div className="text-sm font-medium">{item.count}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Satisfaction clients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {StylistPerformanceData.satisfaction.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{item.label}</span>
                        <span>{item.value}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            idx === 0 ? 'bg-green-500' : 
                            idx === 1 ? 'bg-blue-500' : 'bg-orange-500'
                          }`} 
                          style={{ width: `${item.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4 space-y-1">
                    <div className="text-sm font-medium">Avis clients récents:</div>
                    <div className="text-sm">"Sophie est très professionnelle et à l'écoute." - Marie D.</div>
                    <div className="text-sm">"Résultat impeccable, je suis ravie !" - Lucie M.</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Services les plus réalisés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {StylistPerformanceData.servicesTop.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <span className={`
                          w-6 h-6 rounded-full flex items-center justify-center mr-2 text-white
                          ${idx === 0 ? 'bg-yellow-500' : 
                            idx === 1 ? 'bg-gray-400' : 
                            idx === 2 ? 'bg-amber-700' : 'bg-blue-500'}
                        `}>
                          {idx < 3 ? (idx + 1) : <Scissors className="h-3 w-3" />}
                        </span>
                        <span className="text-sm">{item.service}</span>
                      </div>
                      <span className="text-sm font-medium">{item.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Métriques clés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Taux de fidélisation</div>
                    <div className="text-2xl font-bold">87%</div>
                    <div className="text-xs text-green-600">+5% vs mois précédent</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground">Durée moyenne / client</div>
                    <div className="text-2xl font-bold">45 min</div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-muted-foreground">Ventes produits</div>
                    <div className="text-2xl font-bold">32 produits</div>
                    <div className="text-xs text-green-600">+12% vs mois précédent</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="commissions" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Commissions mensuelles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-60 grid grid-cols-6 gap-2 items-end">
                  {StylistPerformanceData.commissions.map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="h-full w-full flex items-end">
                        <div 
                          className="w-12 bg-green-500 rounded-t" 
                          style={{ height: `${(item.amount / 2000) * 100}%` }}
                        ></div>
                      </div>
                      <div className="mt-2 text-xs">{item.month.substring(0, 3)}</div>
                      <div className="text-sm font-medium">{item.amount}€</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Détails des revenus</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Revenus générés (mois en cours)</span>
                      <span className="font-medium">5,400€</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Taux de commission</span>
                      <span className="font-medium">{stylist.commissionRate || 30}%</span>
                    </div>
                    <div className="flex justify-between mt-2 pt-2 border-t">
                      <span className="font-medium">Commission totale</span>
                      <span className="font-bold">{stylist.commissionRate ? (5400 * stylist.commissionRate / 100).toFixed(0) : 1620}€</span>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <div className="text-sm font-medium">Primes et bonus</div>
                    <div className="space-y-2 mt-2">
                      <div className="flex justify-between">
                        <div>
                          <div className="text-sm">Prime objectif ventes</div>
                          <div className="text-xs text-muted-foreground">Objectif atteint: 110%</div>
                        </div>
                        <span className="font-medium text-green-600">+150€</span>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <div className="text-sm">Prime fidélisation clients</div>
                          <div className="text-xs text-muted-foreground">15 nouveaux clients</div>
                        </div>
                        <span className="font-medium text-green-600">+75€</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex justify-between">
                      <span className="font-bold">Total du mois</span>
                      <span className="font-bold text-green-600">{stylist.commissionRate ? ((5400 * stylist.commissionRate / 100) + 225).toFixed(0) : 1845}€</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StylistDetails;
