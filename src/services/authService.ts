
import { User } from '@/types/user';
import { toast } from 'sonner';

// Mock des données utilisateur
const mockUsers = [
  {
    id: '1',
    email: 'admin@neotech-consulting.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'Neotech',
    role: 'admin'
  },
  {
    id: '2',
    email: 'user@neotech-consulting.com',
    password: 'user123',
    firstName: 'User',
    lastName: 'Standard',
    role: 'user'
  }
];

// Service d'authentification
export const authService = {
  // Fonction pour simuler la connexion
  login: async (email: string, password: string): Promise<User | null> => {
    // Simulation d'une requête réseau
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Recherche de l'utilisateur par email
    const user = mockUsers.find(u => u.email === email);
    
    // Vérification du mot de passe
    if (user && user.password === password) {
      // Créer l'objet utilisateur sans le mot de passe pour le retourner
      const { password: _, ...userWithoutPassword } = user;
      
      // Stocker les données utilisateur dans le localStorage
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      return userWithoutPassword as User;
    }
    
    // En cas d'échec d'authentification
    throw new Error('Identifiants incorrects');
  },
  
  // Fonction pour simuler la déconnexion
  logout: async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    localStorage.removeItem('user');
    toast.success('Déconnexion réussie');
  },
  
  // Fonction pour récupérer l'utilisateur actuel depuis le localStorage
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr) as User;
      } catch (e) {
        return null;
      }
    }
    return null;
  },
  
  // Vérifier si l'utilisateur est authentifié
  isAuthenticated: (): boolean => {
    return localStorage.getItem('user') !== null;
  }
};
