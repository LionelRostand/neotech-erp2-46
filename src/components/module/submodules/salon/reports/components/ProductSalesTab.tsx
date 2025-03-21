
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSalonReports } from '../hooks/useSalonReports';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Package, ShoppingBag, AlertTriangle, BarChart3 } from 'lucide-react';

interface ProductSalesTabProps {
  timeRange: string;
}

const ProductSalesTab: React.FC<ProductSalesTabProps> = ({ timeRange }) => {
  const { productSalesData, isLoading, error } = useSalonReports(timeRange);
  
  if (isLoading) {
    return <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }
  
  if (error) {
    return <div className="text-red-500">Une erreur est survenue: {error.message}</div>;
  }
  
  if (!productSalesData) {
    return <div>Aucune donnée disponible</div>;
  }
  
  const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'];
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <ShoppingBag className="h-8 w-8 text-blue-500 mb-2" />
              <div className="text-2xl font-bold">{productSalesData.totalSold}</div>
              <div className="text-sm text-muted-foreground">Produits vendus</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <BarChart3 className="h-8 w-8 text-green-500 mb-2" />
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(productSalesData.totalRevenue)}
              </div>
              <div className="text-sm text-muted-foreground">CA Produits</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center">
              <Package className="h-8 w-8 text-orange-500 mb-2" />
              <div className="text-2xl font-bold">{productSalesData.inventory.total}</div>
              <div className="text-sm text-muted-foreground">Produits en stock</div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ventes par Catégorie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={productSalesData.categorySales}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="revenue"
                    nameKey="category"
                    label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                  >
                    {productSalesData.categorySales.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [
                      `${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Number(value))}`,
                      'Revenu'
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {productSalesData.categorySales.map((category, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    {category.category}
                  </div>
                  <div className="font-medium">
                    {category.sold} vendus
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Ventes Journalières</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={productSalesData.salesOverTime}>
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'sold') {
                        return [`${value} produits`, 'Quantité'];
                      }
                      return [
                        `${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Number(value))}`,
                        'Revenu'
                      ];
                    }}
                  />
                  <Line yAxisId="left" type="monotone" dataKey="sold" stroke="#8884d8" name="Quantité" />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#82ca9d" name="Revenu" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Produits les Plus Vendus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={productSalesData.topProducts}
                  layout="vertical"
                  margin={{ left: 20 }}
                >
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="name" width={100} />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'sold') {
                        return [`${value} produits`, 'Quantité'];
                      }
                      return [
                        `${new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(Number(value))}`,
                        'Revenu'
                      ];
                    }}
                  />
                  <Bar dataKey="sold" fill="#8884d8" name="Quantité" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <th className="pb-2">Produit</th>
                    <th className="pb-2 text-right">Vendu</th>
                    <th className="pb-2 text-right">CA</th>
                  </tr>
                </thead>
                <tbody>
                  {productSalesData.topProducts.map((product, index) => (
                    <tr key={index} className="border-t border-gray-200">
                      <td className="py-2">{product.name}</td>
                      <td className="py-2 text-right">{product.sold}</td>
                      <td className="py-2 text-right font-medium">
                        {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(product.revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <span>État des Stocks</span>
              {productSalesData.lowStock.length > 0 && (
                <Badge variant="outline" className="ml-2 bg-orange-100 text-orange-800 border-orange-200">
                  {productSalesData.lowStock.length} en stock faible
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Valeur du stock</p>
                  <p className="text-xl font-bold text-blue-600">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(productSalesData.inventory.value)}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-500">Rotation du stock</p>
                  <p className="text-xl font-bold text-green-600">
                    {productSalesData.inventory.stockTurnover}x <span className="text-xs font-normal">par an</span>
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Produits à réapprovisionner :</h4>
                {productSalesData.lowStock.length > 0 ? (
                  <div className="space-y-2">
                    {productSalesData.lowStock.map((product, index) => (
                      <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                        <span className="flex items-center">
                          <AlertTriangle className="h-3 w-3 text-orange-500 mr-2" />
                          {product.name}
                        </span>
                        <span className="font-medium text-orange-600">
                          {product.stock} / {product.minStock}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-2 text-center text-gray-500">
                    Tous les produits sont en stock suffisant
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductSalesTab;
