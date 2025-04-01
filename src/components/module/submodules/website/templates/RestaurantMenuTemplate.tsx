
import React from 'react';

const RestaurantMenuTemplate: React.FC = () => {
  return (
    <div className="min-h-[600px]">
      <header className="bg-zinc-900 text-white p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">Le Gourmet</div>
          <nav>
            <ul className="flex space-x-6">
              <li>Accueil</li>
              <li>Notre Menu</li>
              <li>Réservation</li>
              <li>Contact</li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main>
        <section className="bg-amber-50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-zinc-900 mb-4">Une expérience culinaire d'exception</h1>
              <p className="text-lg text-zinc-700 max-w-2xl mx-auto">
                Découvrez notre cuisine raffinée préparée avec passion par notre chef étoilé.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-40 bg-amber-100 rounded-md mb-4 flex items-center justify-center">
                  Image d'un plat
                </div>
                <h3 className="text-xl font-semibold mb-2">Entrées</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>Carpaccio de bœuf</span>
                    <span className="font-medium">12€</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Salade de chèvre chaud</span>
                    <span className="font-medium">10€</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Soupe à l'oignon</span>
                    <span className="font-medium">9€</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-40 bg-amber-100 rounded-md mb-4 flex items-center justify-center">
                  Image d'un plat
                </div>
                <h3 className="text-xl font-semibold mb-2">Plats</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>Filet de bœuf Wellington</span>
                    <span className="font-medium">28€</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Risotto aux cèpes</span>
                    <span className="font-medium">22€</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Dorade grillée</span>
                    <span className="font-medium">26€</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="h-40 bg-amber-100 rounded-md mb-4 flex items-center justify-center">
                  Image d'un plat
                </div>
                <h3 className="text-xl font-semibold mb-2">Desserts</h3>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span>Crème brûlée</span>
                    <span className="font-medium">8€</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Tarte au citron meringuée</span>
                    <span className="font-medium">9€</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Fondant au chocolat</span>
                    <span className="font-medium">10€</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-12 text-center">
              <button className="px-6 py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors">
                Réserver une table
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default RestaurantMenuTemplate;
