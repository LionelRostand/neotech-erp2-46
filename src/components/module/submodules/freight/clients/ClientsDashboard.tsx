
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { User, UserPlus, UserCheck, UserX } from "lucide-react";

interface FreightClient {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  notes?: string;
  createdAt?: any;
}

interface Props {
  clients: FreightClient[];
  isLoading: boolean;
}

const ClientsDashboard: React.FC<Props> = ({ clients, isLoading }) => {
  const total = clients.length;

  // Clients ajoutés ce mois-ci (par date)
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const addedThisMonth = clients.filter(c => {
    if (!c.createdAt) return false;
    try {
      const created = c.createdAt.toDate ? c.createdAt.toDate() : new Date(c.createdAt);
      return created.getFullYear() === currentYear && created.getMonth() === currentMonth;
    } catch {
      return false;
    }
  }).length;

  const withEmail = clients.filter(c => c.email && c.email.trim()).length;
  const withoutEmail = clients.filter(c => !c.email || !c.email.trim()).length;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-6">
      <Card>
        <CardHeader className="flex items-center gap-2">
          <User className="text-blue-700" size={28} />
          <CardTitle className="text-lg">Total</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? "…" : total}</div>
          <CardDescription className="text-muted-foreground">Clients enregistrés</CardDescription>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex items-center gap-2">
          <UserPlus className="text-green-700" size={28} />
          <CardTitle className="text-lg">Nouveaux ce mois</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? "…" : addedThisMonth}</div>
          <CardDescription className="text-muted-foreground">Ajoutés ce mois-ci</CardDescription>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex items-center gap-2">
          <UserCheck className="text-emerald-700" size={28} />
          <CardTitle className="text-lg">Avec email</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? "…" : withEmail}</div>
          <CardDescription className="text-muted-foreground">Contact email renseigné</CardDescription>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex items-center gap-2">
          <UserX className="text-rose-700" size={28} />
          <CardTitle className="text-lg">Sans email</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{isLoading ? "…" : withoutEmail}</div>
          <CardDescription className="text-muted-foreground">Sans adresse email</CardDescription>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientsDashboard;
