
import React from 'react';

const FreightDashboard = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Freight Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Recent Shipments</h2>
          <p className="text-gray-500">View your most recent shipments</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Active Routes</h2>
          <p className="text-gray-500">Monitor your active shipping routes</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Carrier Performance</h2>
          <p className="text-gray-500">Review carrier performance metrics</p>
        </div>
      </div>
    </div>
  );
};

export default FreightDashboard;
