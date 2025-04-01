
import React from 'react';

const TransportBookingTemplate: React.FC = () => {
  return (
    <div className="min-h-[600px]">
      <header className="bg-blue-600 text-white p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold">Transport Pro</div>
          <nav>
            <ul className="flex space-x-6">
              <li>Accueil</li>
              <li>Services</li>
              <li>Réservation</li>
              <li>Contact</li>
            </ul>
          </nav>
        </div>
      </header>
      
      <main>
        <section className="bg-blue-50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="md:w-1/2 space-y-6">
                <h1 className="text-4xl font-bold text-gray-900">Réservez votre transport facilement</h1>
                <p className="text-lg text-gray-700">
                  Service de transport professionnel, rapide et fiable. Réservez en quelques clics pour tous vos déplacements.
                </p>
                <div className="flex space-x-4">
                  <button className="px-6 py-2 bg-blue-600 text-white rounded-md">Nos services</button>
                  <button className="px-6 py-2 border border-blue-600 text-blue-600 rounded-md">Nous contacter</button>
                </div>
              </div>
              
              <div className="md:w-1/2 bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-semibold mb-4">Formulaire de réservation</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Service</label>
                    <select className="w-full p-2 border rounded">
                      <option>VTC</option>
                      <option>Transport de groupe</option>
                      <option>Navette aéroport</option>
                    </select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Date</label>
                      <input type="date" className="w-full p-2 border rounded" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Heure</label>
                      <input type="time" className="w-full p-2 border rounded" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Adresse de départ</label>
                    <input type="text" className="w-full p-2 border rounded" placeholder="Saisissez l'adresse de prise en charge" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Adresse d'arrivée</label>
                    <input type="text" className="w-full p-2 border rounded" placeholder="Saisissez l'adresse de destination" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Nombre de passagers</label>
                    <input type="number" min="1" className="w-full p-2 border rounded" defaultValue="1" />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Information supplémentaire</label>
                    <textarea className="w-full p-2 border rounded h-24" placeholder="Informations complémentaires pour votre trajet"></textarea>
                  </div>
                  
                  <button type="submit" className="w-full py-2 bg-blue-600 text-white font-medium rounded">
                    Réserver maintenant
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TransportBookingTemplate;
