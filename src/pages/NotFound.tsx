
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Function to generate a helpful message based on the path
  const getSuggestion = () => {
    const path = location.pathname;
    
    // For web-booking related errors
    if (path.includes('/vehicules') || path.includes('/tarifs') || path.includes('/contact')) {
      return (
        <div className="mt-4">
          <p className="mb-2">Vous essayez d'accéder à une page du site de réservation depuis l'éditeur.</p>
          <p>Ces pages sont uniquement accessibles depuis le site web publié ou en mode prévisualisation.</p>
        </div>
      );
    }
    
    return <p className="text-gray-600 mt-2">La page que vous recherchez n'existe pas ou a été déplacée.</p>;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-5xl font-bold text-red-500 mb-2">404</h1>
        <p className="text-xl font-medium text-gray-800 mb-4">Page non trouvée</p>
        
        {getSuggestion()}
        
        <div className="mt-6 flex gap-4 justify-center">
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
          <Button asChild>
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Accueil
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
