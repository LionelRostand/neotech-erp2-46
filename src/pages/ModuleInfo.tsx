
import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building, Headphones, Globe, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const ModuleInfo = () => {
  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-6 text-center">FONCTIONNALITÉS DES MODULES NEOTECH-ERP</h1>
          
          <Tabs defaultValue="business" className="w-full">
            <TabsList className="grid grid-cols-4 w-full mb-6">
              <TabsTrigger value="business" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                <span>GESTION D'ENTREPRISE</span>
              </TabsTrigger>
              <TabsTrigger value="services" className="flex items-center gap-2">
                <Headphones className="h-4 w-4" />
                <span>SERVICES SPÉCIALISÉS</span>
              </TabsTrigger>
              <TabsTrigger value="digital" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                <span>PRÉSENCE NUMÉRIQUE</span>
              </TabsTrigger>
              <TabsTrigger value="communication" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span>COMMUNICATION</span>
              </TabsTrigger>
            </TabsList>
            
            <Card>
              <CardContent className="pt-6">
                <TabsContent value="business" className="space-y-4">
                  <ul className="space-y-4">
                    <li>
                      <h3 className="text-lg font-semibold">Companies (Entreprises)</h3>
                      <p>Gestion des entreprises clientes, partenaires et fournisseurs avec historique et contacts.</p>
                    </li>
                    <li>
                      <h3 className="text-lg font-semibold">Employees (Employés)</h3>
                      <p>Gestion complète des ressources humaines avec dossiers employés, contrats, et présences.</p>
                    </li>
                    <li>
                      <h3 className="text-lg font-semibold">Accounting (Comptabilité)</h3>
                      <p>Solution comptable avec facturation, trésorerie, rapports financiers et gestion fiscale.</p>
                    </li>
                    <li>
                      <h3 className="text-lg font-semibold">Purchase (Achats)</h3>
                      <p>Gestion des fournisseurs, commandes, réceptions et facturation.</p>
                    </li>
                    <li>
                      <h3 className="text-lg font-semibold">Inventory (Inventaire)</h3>
                      <p>Système d'inventaire complet pour suivre les stocks, gérer les mouvements et les niveaux d'alerte.</p>
                    </li>
                    <li>
                      <h3 className="text-lg font-semibold">Planning (Planification)</h3>
                      <p>Outil de planification pour gérer les rendez-vous, réservations et événements avec calendrier interactif.</p>
                    </li>
                    <li>
                      <h3 className="text-lg font-semibold">Projects (Projets)</h3>
                      <p>Plateforme de gestion de projets avec suivi des tâches, des équipes, des délais et des ressources.</p>
                    </li>
                  </ul>
                </TabsContent>
                
                <TabsContent value="services" className="space-y-4">
                  <ul className="space-y-4">
                    <li>
                      <h3 className="text-lg font-semibold">POS (Point de Vente)</h3>
                      <p>Système complet de point de vente pour restaurants, cafés et commerces. Gestion des commandes, tables, stocks, et paiements.</p>
                    </li>
                    <li>
                      <h3 className="text-lg font-semibold">Garage (Automobile)</h3>
                      <p>Solution complète pour la gestion de garages automobiles. Suivi des réparations, gestion des pièces, rendez-vous et facturation.</p>
                    </li>
                    <li>
                      <h3 className="text-lg font-semibold">Transport</h3>
                      <p>Application de gestion des réservations de bus et taxis, planification des itinéraires, et suivi des véhicules en temps réel.</p>
                    </li>
                    <li>
                      <h3 className="text-lg font-semibold">Health (Santé)</h3>
                      <p>Système de gestion médicale pour cliniques et cabinets avec dossiers patients, rendez-vous et facturation.</p>
                    </li>
                    <li>
                      <h3 className="text-lg font-semibold">Hotel (Hôtellerie)</h3>
                      <p>Système de gestion hôtelière pour la réservation de chambres, services et facturation.</p>
                    </li>
                    <li>
                      <h3 className="text-lg font-semibold">Bookstore (Librairie)</h3>
                      <p>Application spécialisée pour la gestion de librairie, inventaire de livres, ventes et abonnements.</p>
                    </li>
                  </ul>
                </TabsContent>
                
                <TabsContent value="digital" className="space-y-4">
                  <ul className="space-y-4">
                    <li>
                      <h3 className="text-lg font-semibold">Website (Site Web)</h3>
                      <p>Éditeur de site web avec constructeur visuel, gestion de contenu et optimisation SEO.</p>
                    </li>
                    <li>
                      <h3 className="text-lg font-semibold">Ecommerce</h3>
                      <p>Plateforme e-commerce complète avec gestion des produits, commandes, paiements et expéditions.</p>
                    </li>
                    <li>
                      <h3 className="text-lg font-semibold">Email-marketing</h3>
                      <p>Solution pour créer et gérer des campagnes email, segmenter les contacts et analyser les performances.</p>
                    </li>
                    <li>
                      <h3 className="text-lg font-semibold">Academy (Académie)</h3>
                      <p>Système de gestion pour établissements éducatifs, adapté au système camerounais.</p>
                    </li>
                    <li>
                      <h3 className="text-lg font-semibold">Elearning</h3>
                      <p>Plateforme d'apprentissage en ligne avec cours, quiz, et suivi des progrès.</p>
                    </li>
                  </ul>
                </TabsContent>
                
                <TabsContent value="communication" className="space-y-4">
                  <ul className="space-y-4">
                    <li>
                      <h3 className="text-lg font-semibold">Messages</h3>
                      <p>Système de messagerie interne et externe avec notifications et historique des conversations.</p>
                    </li>
                    <li>
                      <h3 className="text-lg font-semibold">Documents</h3>
                      <p>Gestion électronique de documents avec classement, recherche avancée et contrôle des versions.</p>
                    </li>
                  </ul>
                </TabsContent>
              </CardContent>
            </Card>
            
            <div className="mt-8 text-center text-gray-500 text-sm">
              <p>Ce document résume les principales fonctionnalités de chaque module disponible dans l'application NEOTECH-ERP, organisées par catégories.</p>
            </div>
          </Tabs>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default ModuleInfo;
