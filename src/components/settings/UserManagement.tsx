
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { createUser, getAllUsers } from "@/services/userService";
import { User } from "@/types/user";
import DashboardLayout from "@/components/DashboardLayout";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ReloadIcon } from "@radix-ui/react-icons";

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'user',
    phoneNumber: '',
    department: '',
    position: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs", error);
      toast.error("Impossible de charger les utilisateurs");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.firstName || !formData.lastName) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return false;
    }

    if (formData.password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Veuillez entrer une adresse email valide");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setFormLoading(true);
    try {
      const userData: User = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role as 'admin' | 'user' | 'manager',
        phoneNumber: formData.phoneNumber,
        department: formData.department,
        position: formData.position
      };
      
      await createUser(userData, formData.password);
      
      // Réinitialiser le formulaire
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        role: 'user',
        phoneNumber: '',
        department: '',
        position: ''
      });
      
      // Recharger la liste des utilisateurs
      fetchUsers();
      
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur", error);
    } finally {
      setFormLoading(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return "bg-red-500";
      case 'manager': return "bg-blue-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Gestion des utilisateurs</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Ajouter un utilisateur</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom *</Label>
                      <Input 
                        id="firstName" 
                        name="firstName" 
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Jean"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom *</Label>
                      <Input 
                        id="lastName" 
                        name="lastName" 
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Dupont"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Rôle *</Label>
                    <Select 
                      value={formData.role} 
                      onValueChange={(value) => handleSelectChange(value, 'role')}
                      required
                    >
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Sélectionner un rôle" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">Utilisateur</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="admin">Administrateur</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Mot de passe *</Label>
                      <Input 
                        id="password" 
                        name="password" 
                        type="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirmer *</Label>
                      <Input 
                        id="confirmPassword" 
                        name="confirmPassword" 
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Téléphone</Label>
                    <Input 
                      id="phoneNumber" 
                      name="phoneNumber" 
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="+33 6 12 34 56 78"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">Département</Label>
                      <Input 
                        id="department" 
                        name="department" 
                        value={formData.department}
                        onChange={handleInputChange}
                        placeholder="IT"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">Poste</Label>
                      <Input 
                        id="position" 
                        name="position" 
                        value={formData.position}
                        onChange={handleInputChange}
                        placeholder="Développeur"
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={formLoading}
                  >
                    {formLoading ? (
                      <>
                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                        Création...
                      </>
                    ) : "Créer l'utilisateur"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Utilisateurs ({users.length})</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={fetchUsers}
                  disabled={loading}
                >
                  {loading ? (
                    <ReloadIcon className="h-4 w-4 animate-spin" />
                  ) : "Actualiser"}
                </Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <ReloadIcon className="h-8 w-8 animate-spin" />
                  </div>
                ) : users.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Aucun utilisateur trouvé
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-4">Nom</th>
                          <th className="text-left py-2 px-4">Email</th>
                          <th className="text-left py-2 px-4">Rôle</th>
                          <th className="text-left py-2 px-4">Statut</th>
                          <th className="text-left py-2 px-4">Dernière connexion</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr key={user.id} className="border-b hover:bg-gray-50">
                            <td className="py-2 px-4">{user.firstName} {user.lastName}</td>
                            <td className="py-2 px-4">{user.email}</td>
                            <td className="py-2 px-4">
                              <Badge className={getRoleBadgeColor(user.role)}>
                                {user.role === 'admin' ? 'Admin' : 
                                 user.role === 'manager' ? 'Manager' : 'Utilisateur'}
                              </Badge>
                            </td>
                            <td className="py-2 px-4">
                              <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                                {user.status === 'active' ? 'Actif' : 
                                 user.status === 'inactive' ? 'Inactif' : 'En attente'}
                              </Badge>
                            </td>
                            <td className="py-2 px-4">
                              {user.lastLogin ? new Date(user.lastLogin.seconds * 1000).toLocaleString() : 'Jamais'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default UserManagement;
