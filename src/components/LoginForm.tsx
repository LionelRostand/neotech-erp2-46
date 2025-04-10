
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';

const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const user = await login(email, password);
      
      if (user) {
        toast.success(`Bienvenue, ${user.firstName} ${user.lastName}`);
        navigate('/welcome');
      }
    } catch (error: any) {
      console.error("Erreur de connexion:", error);
      let errorMessage = "Identifiants incorrects";
      
      if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error("Erreur de connexion", {
        description: errorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neotech-background p-4">
      <div className="glass-effect max-w-md w-full p-8 rounded-2xl shadow-lg animate-fade-up">
        <div className="text-center mb-8">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-neotech-primary rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">N</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold mt-4 text-gray-800">NEOTECH-ERP</h2>
          <p className="text-gray-500 mt-2">Connectez-vous à votre espace</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="w-full"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full"
              required
            />
          </div>
          
          <Button
            type="submit"
            className="w-full bg-neotech-primary hover:bg-neotech-primaryDark transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connexion...
              </>
            ) : 'Se connecter'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
