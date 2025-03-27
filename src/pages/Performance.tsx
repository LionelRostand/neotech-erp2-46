
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, Gauge, TrendingUp, TrendingDown } from "lucide-react";
import DashboardLayout from '@/components/DashboardLayout';
import { useToast } from "@/hooks/use-toast";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart as RechartsLineChart, Line } from 'recharts';

const performanceData = [
  { month: 'Jan', users: 2400, transactions: 1800, revenue: 15000 },
  { month: 'Feb', users: 1398, transactions: 1200, revenue: 12000 },
  { month: 'Mar', users: 9800, transactions: 8700, revenue: 27000 },
  { month: 'Apr', users: 3908, transactions: 2900, revenue: 18500 },
  { month: 'May', users: 4800, transactions: 3800, revenue: 21000 },
  { month: 'Jun', users: 3800, transactions: 2800, revenue: 19000 },
  { month: 'Jul', users: 4300, transactions: 3300, revenue: 20500 },
];

const Performance = () => {
  const { toast } = useToast();
  
  const exportData = () => {
    toast({
      title: "Export initiated",
      description: "Your report is being generated and will be available soon.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Performance Dashboard</h1>
          <button 
            onClick={exportData}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Export Data
          </button>
        </div>
        
        {/* Key Performance Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Gauge className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,248</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                <span className="text-green-500">+12.5%</span> from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24.8%</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                <span className="text-green-500">+2.1%</span> from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
              <LineChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1.2s</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingDown className="h-3 w-3 mr-1 text-green-500" />
                <span className="text-green-500">-0.3s</span> from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
              <LineChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">€24,350</div>
              <p className="text-xs text-muted-foreground flex items-center mt-1">
                <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                <span className="text-red-500">-4.5%</span> from last month
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>User Acquisition</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={performanceData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="users" fill="#8884d8" name="Users" />
                    <Bar dataKey="transactions" fill="#82ca9d" name="Transactions" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart
                    data={performanceData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                      name="Revenue (€)"
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Performance Metrics Table */}
        <Card>
          <CardHeader>
            <CardTitle>Module Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Module</th>
                    <th className="text-left py-3 px-4 font-medium">Users</th>
                    <th className="text-left py-3 px-4 font-medium">Engagement</th>
                    <th className="text-left py-3 px-4 font-medium">Avg. Time</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-4">Employees</td>
                    <td className="py-3 px-4">789</td>
                    <td className="py-3 px-4">42%</td>
                    <td className="py-3 px-4">12min</td>
                    <td className="py-3 px-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Good</span></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Accounting</td>
                    <td className="py-3 px-4">562</td>
                    <td className="py-3 px-4">38%</td>
                    <td className="py-3 px-4">18min</td>
                    <td className="py-3 px-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Good</span></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">CRM</td>
                    <td className="py-3 px-4">423</td>
                    <td className="py-3 px-4">56%</td>
                    <td className="py-3 px-4">22min</td>
                    <td className="py-3 px-4"><span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Fair</span></td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-4">Freight</td>
                    <td className="py-3 px-4">347</td>
                    <td className="py-3 px-4">29%</td>
                    <td className="py-3 px-4">8min</td>
                    <td className="py-3 px-4"><span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Poor</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Messages</td>
                    <td className="py-3 px-4">892</td>
                    <td className="py-3 px-4">72%</td>
                    <td className="py-3 px-4">14min</td>
                    <td className="py-3 px-4"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Good</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Performance;
