
import React from 'react';
import { Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Order } from '../types/inventory-types';

interface OrdersTabProps {
  orders: Order[];
  onCreateOrder: () => void;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({ orders, onCreateOrder }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Commandes</CardTitle>
        <Button variant="default" onClick={onCreateOrder}>
          <Plus className="mr-2 h-4 w-4" />
          Créer une commande
        </Button>
      </CardHeader>
      <CardContent>
        {orders.length > 0 ? (
          <div className="rounded-md border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium">Fournisseur</th>
                  <th className="px-4 py-3 text-left font-medium">Date</th>
                  <th className="px-4 py-3 text-center font-medium">Statut</th>
                  <th className="px-4 py-3 text-right font-medium">Total</th>
                  <th className="px-4 py-3 text-center font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => (
                  <tr key={i} className="border-b hover:bg-muted/50">
                    <td className="px-4 py-3 font-medium">{order.supplierName}</td>
                    <td className="px-4 py-3">{new Date(order.orderDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-center">
                      <Badge 
                        variant={
                          order.status === 'delivered' ? 'outline' : 
                          order.status === 'shipped' ? 'secondary' : 
                          order.status === 'pending' ? 'default' : 
                          'destructive'
                        }
                        className={
                          order.status === 'delivered' ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''
                        }
                      >
                        {order.status === 'delivered' ? 'Livré' : 
                         order.status === 'shipped' ? 'Expédié' : 
                         order.status === 'pending' ? 'En attente' : 
                         'Annulé'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">{order.total.toFixed(2)} €</td>
                    <td className="px-4 py-3 text-center">
                      <Button variant="ghost" size="sm">Détails</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-md border p-8 text-center">
            <h3 className="text-lg font-medium mb-2">Aucune commande</h3>
            <p className="text-muted-foreground mb-4">
              Vous n'avez pas encore créé de commandes fournisseurs.
            </p>
            <Button onClick={onCreateOrder}>
              <Plus className="mr-2 h-4 w-4" />
              Créer une commande
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
