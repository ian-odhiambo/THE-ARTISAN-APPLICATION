import React from 'react';

const Stats = ({ stats, loading }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return stats ? (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-xl text-white">
        <h3 className="text-3xl font-bold">{stats.artisans?.total || 0}</h3>
        <p className="opacity-90">Total Artisans</p>
      </div>
      <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-xl text-white">
        <h3 className="text-3xl font-bold">{stats.artisans?.approved || 0}</h3>
        <p className="opacity-90">Approved Artisans</p>
      </div>
      <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-xl shadow-xl text-white">
        <h3 className="text-3xl font-bold">{stats.artisans?.pending || 0}</h3>
        <p className="opacity-90">Pending Artisans</p>
      </div>
      <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-xl text-white">
        <h3 className="text-3xl font-bold">{stats.products?.total || 0}</h3>
        <p className="opacity-90">Total Products</p>
      </div>
    </div>
  ) : (
    <p className="text-gray-500 text-lg">Loading stats...</p>
  );
};

export default Stats;