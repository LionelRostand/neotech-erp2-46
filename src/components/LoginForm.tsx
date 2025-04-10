
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from "lucide-react";
import { FirebaseErrorAlert } from './ui/FirebaseErrorAlert';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { COLLECTIONS } from '@/lib/firebase-collections';

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@neotech-consulting.com');
  const [password, setPassword] = useState('admin123456');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Utiliser directement Firebase Auth au lieu du service
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const { uid } = userCredential.user;
      
      try {
        // Récupérer les données utilisateur depuis Firestore
        const userRef = doc(db, COLLECTIONS.USERS, uid);
        const userDoc = await getDoc(userRef);
        
        let userData;
        
        if (userDoc.exists()) {
          userData = userDoc.data();
          // Mettre à jour la date de dernière connexion
          await setDoc(userRef, { lastLogin: new Date() }, { merge: true });
        } else {
          // Créer un utilisateur par défaut si nécessaire
          userData = {
            email: userCredential.user.email,
            firstName: "Admin",
            lastName: "User",
            role: "admin",
            createdAt: new Date(),
            lastLogin: new Date()
          };
          
          await setDoc(userRef, userData);
        }
        
        // Stocker les données utilisateur dans localStorage pour l'état global
        const user = {
          id: uid,
          email: userCredential.user.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role
        };
        
        localStorage.setItem('user', JSON.stringify(user));
        
        toast.success(`Bienvenue, ${userData.firstName} ${userData.lastName}`);
        navigate('/welcome');
      } catch (firestoreError) {
        console.error("Erreur Firestore:", firestoreError);
        // Continuer même si Firestore n'est pas disponible
        const defaultUser = {
          id: uid,
          email: userCredential.user.email,
          firstName: "Admin",
          lastName: "User",
          role: "admin"
        };
        
        localStorage.setItem('user', JSON.stringify(defaultUser));
        toast.success(`Bienvenue!`);
        navigate('/welcome');
      }
    } catch (error: any) {
      console.error("Erreur de connexion:", error);
      setError(error);
      
      let errorMessage = "Identifiants incorrects";
      
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = "Email ou mot de passe incorrect";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Trop de tentatives. Veuillez réessayer plus tard";
      } else if (error.code === 'auth/api-key-not-valid.-please-pass-a-valid-api-key.') {
        errorMessage = "Erreur de configuration. Veuillez contacter l'administrateur.";
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
        
        {error && (
          <div className="mb-6">
            <FirebaseErrorAlert error={error} />
          </div>
        )}
        
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
