
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const WelcomePage = () => {
  const { currentUser, userData, loading } = useAuth();

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Bienvenue sur Neo-RH</h1>
          <p className="mt-2 text-sm text-gray-600">
            {currentUser ? `Connecté en tant que ${userData?.email}` : 'Veuillez vous connecter pour accéder à votre espace'}
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {currentUser ? (
            <Link to="/dashboard">
              <Button className="w-full">Accéder au tableau de bord</Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button className="w-full">Se connecter</Button>
            </Link>
          )}
          
          {!currentUser && (
            <p className="text-xs text-gray-500">
              Vous n'avez pas de compte ?{" "}
              <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                S'inscrire
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
