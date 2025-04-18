
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

const WelcomePage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Bienvenue</h1>
          <p className="mt-2 text-gray-600">
            {currentUser ? 'Merci de vous être connecté!' : 'Veuillez vous connecter pour continuer.'}
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          <Button
            onClick={() => navigate('/')}
            className="w-full"
          >
            Dashboard
          </Button>
          
          {!currentUser && (
            <Button
              onClick={() => navigate('/login')}
              variant="outline"
              className="w-full"
            >
              Se connecter
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
