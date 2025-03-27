
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, BarChart, LineChart, ArrowUpRight, ArrowDownRight, Download } from "lucide-react";
import DashboardLayout from '@/components/DashboardLayout';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useToast } from "@/hooks/use-toast";
import { jsPDF } from "jspdf";
import 'jspdf-autotable';

const moduleUsageData = [
  { name: 'Employees', value: 35 },
  { name: 'Accounting', value: 20 },
  { name: 'CRM', value: 15 },
  { name: 'Messages', value: 20 },
  { name: 'Others', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const weeklyActivityData = [
  { day: 'Mon', actives: 120, sessions: 210 },
  { day: 'Tue', actives: 145, sessions: 240 },
  { day: 'Wed', actives: 160, sessions: 290 },
  { day: 'Thu', actives: 180, sessions: 310 },
  { day: 'Fri', actives: 150, sessions: 270 },
  { day: 'Sat', actives: 90, sessions: 150 },
  { day: 'Sun', actives: 75, sessions: 120 },
];

const Analytics = () => {
  const { toast } = useToast();

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text("Analytics Report", 105, 15, { align: "center" });
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 25, { align: "center" });
    
    // Add key analytics
    doc.setFontSize(16);
    doc.text("Key Analytics", 14, 35);
    
    const keyAnalyticsData = [
      ["Daily Active Users", "164", "+13.2% from yesterday"],
      ["Session Duration", "16m 28s", "-2.4% from yesterday"],
      ["Monthly Active Users", "2,845", "+8.1% from last month"],
      ["User Retention", "78.5%", "+4.2% from last month"]
    ];
    
    doc.autoTable({
      head: [["Metric", "Value", "Change"]],
      body: keyAnalyticsData,
      startY: 40,
    });
    
    // Add module usage
    doc.setFontSize(16);
    doc.text("Module Usage Distribution", 14, doc.autoTable.previous.finalY + 15);
    
    const moduleUsageTableData = moduleUsageData.map(item => [item.name, `${item.value}%`]);
    
    doc.autoTable({
      head: [["Module", "Usage Percentage"]],
      body: moduleUsageTableData,
      startY: doc.autoTable.previous.finalY + 20,
    });
    
    // Add weekly activity
    doc.setFontSize(16);
    doc.text("Weekly Activity", 14, doc.autoTable.previous.finalY + 15);
    
    const weeklyActivityTableData = weeklyActivityData.map(item => [
      item.day,
      item.actives.toString(),
      item.sessions.toString()
    ]);
    
    doc.autoTable({
      head: [["Day", "Active Users", "Sessions"]],
      body: weeklyActivityTableData,
      startY: doc.autoTable.previous.finalY + 20,
    });
    
    // Add most used features
    doc.setFontSize(16);
    doc.text("Most Used Features", 14, doc.autoTable.previous.finalY + 15);
    
    const mostUsedFeaturesData = [
      ["Employee Directory", "Employees Module", "842 users"],
      ["Message Inbox", "Messages Module", "784 users"],
      ["Invoice Generator", "Accounting Module", "725 users"],
      ["Client Database", "CRM Module", "692 users"],
      ["Shipment Tracking", "Freight Module", "587 users"]
    ];
    
    doc.autoTable({
      head: [["Feature", "Module", "Users"]],
      body: mostUsedFeaturesData,
      startY: doc.autoTable.previous.finalY + 20,
    });
    
    // Save the PDF
    doc.save("analytics-report.pdf");
    
    toast({
      title: "Export successful",
      description: "Analytics report has been downloaded.",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Analytics</h1>
          <button 
            onClick={exportToPDF}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export PDF
          </button>
        </div>
        
        {/* Key Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Daily Active Users
              </CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">164</div>
              <p className="text-xs flex items-center mt-1 text-green-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                13.2% from yesterday
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Session Duration
              </CardTitle>
              <LineChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">16m 28s</div>
              <p className="text-xs flex items-center mt-1 text-red-600">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                2.4% from yesterday
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                Monthly Active Users
              </CardTitle>
              <LineChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,845</div>
              <p className="text-xs flex items-center mt-1 text-green-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                8.1% from last month
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                User Retention
              </CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">78.5%</div>
              <p className="text-xs flex items-center mt-1 text-green-600">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                4.2% from last month
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Module Usage Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={moduleUsageData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {moduleUsageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={weeklyActivityData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="actives" name="Active Users" fill="#8884d8" />
                    <Bar dataKey="sessions" name="Sessions" fill="#82ca9d" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Top Content */}
        <Card>
          <CardHeader>
            <CardTitle>Most Used Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Employee Directory</p>
                  <p className="text-sm text-muted-foreground">Employees Module</p>
                </div>
                <div className="text-sm font-medium">842 users</div>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: "92%" }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Message Inbox</p>
                  <p className="text-sm text-muted-foreground">Messages Module</p>
                </div>
                <div className="text-sm font-medium">784 users</div>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: "86%" }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Invoice Generator</p>
                  <p className="text-sm text-muted-foreground">Accounting Module</p>
                </div>
                <div className="text-sm font-medium">725 users</div>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: "79%" }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Client Database</p>
                  <p className="text-sm text-muted-foreground">CRM Module</p>
                </div>
                <div className="text-sm font-medium">692 users</div>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: "76%" }}></div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Shipment Tracking</p>
                  <p className="text-sm text-muted-foreground">Freight Module</p>
                </div>
                <div className="text-sm font-medium">587 users</div>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: "64%" }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
