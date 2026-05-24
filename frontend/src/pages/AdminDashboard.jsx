import React, { useState, useRef, useCallback } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Stats from '../components/admindashboard-subcomponents/Stats';
import AllArtisans from '../components/admindashboard-subcomponents/AllArtisans';
import AllProducts from '../components/admindashboard-subcomponents/AllProducts';
import PendingProducts from '../components/admindashboard-subcomponents/PendingProducts';
import PendingArtisans from '../components/admindashboard-subcomponents/PendingArtisans';
import {
  useFetchArtisans,
  useFetchProducts,
  useFetchStats,
  useProductActions,
  useArtisanActions,
  useClickOutside
} from '../components/hooks';
import { FiTool, FiBarChart2, FiUsers, FiClock } from 'react-icons/fi';
import { FaBoxOpen } from 'react-icons/fa';

const AdminDashboard = ({ darkMode }) => {
  const [activeTab, setActiveTab] = useState('stats');
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  // Import custom hooks
  const { allArtisans, fetchAllArtisans } = useFetchArtisans();
  const { 
    products, 
    allProducts, 
    fetchAllProducts, 
    fetchUnapprovedProducts 
  } = useFetchProducts();
  const { stats, fetchStats } = useFetchStats();

  // Fetch unapproved artisans
  const [unapprovedArtisans, setUnapprovedArtisans] = useState([]);
  const fetchUnapprovedArtisans = useCallback(async () => {
    try {
      console.log('Fetching unapproved artisans...');
      const res = await fetch('http://localhost:5000/api/v1/admin/unapproved-artisans');
      const data = await res.json();
      setUnapprovedArtisans(data);
    } catch (err) {
      console.error('Fetch unapproved artisans error:', err);
      toast.error('Failed to fetch artisans');
    }
  }, []);

  // Action hooks
  const { handleApproveArtisan, handleRejectArtisan } = useArtisanActions(
    fetchAllArtisans,
    fetchUnapprovedArtisans
  );
  const { handleApproveProduct, handleRejectProduct } = useProductActions(
    fetchUnapprovedProducts,
    fetchAllProducts
  );

  // Initial data loading
  React.useEffect(() => {
    const loadAllData = async () => {
      await Promise.all([
        fetchUnapprovedProducts(),
        fetchUnapprovedArtisans(),
        fetchAllArtisans(),
        fetchAllProducts(),
        fetchStats()
      ]);
    };
    loadAllData();
  }, []);

  // Click outside handler for dropdown
  useClickOutside(dropdownRef, () => setShowDropdown(false));

  const handleLogout = () => {
    localStorage.removeItem('user');
    setShowDropdown(false);
    navigate('/');
  };

  const handleUpdatePassword = () => {
    setShowDropdown(false);
    navigate('/update-password');
  };

  return (
    <div className="relative min-h-screen bg-gray-100 dark:bg-gray-900 p-6 text-gray-800 dark:text-gray-100">
      {/* Profile Dropdown */}
      <div className="absolute top-6 right-6" ref={dropdownRef}>
        <div className="relative inline-block text-left">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="bg-orange-100 hover:bg-orange-200 text-orange-700 font-medium px-4 py-2 rounded shadow"
          >
            {user?.name || 'Admin'} ▼
          </button>
          {showDropdown && (
            <div className={`absolute right-0 mt-2 w-44 border rounded shadow-lg z-50 ${
              darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
            }`}>
              <button
                onClick={handleUpdatePassword}
                className={`block w-full text-left px-4 py-2 ${
                  darkMode
                    ? 'text-gray-200 hover:bg-gray-700'
                    : 'text-gray-800 hover:bg-gray-100'
                }`}
              >
                Update Password
              </button>
              <button
                onClick={handleLogout}
                className={`block w-full text-left px-4 py-2 ${
                  darkMode
                    ? 'text-gray-200 hover:bg-gray-700'
                    : 'text-gray-800 hover:bg-gray-100'
                }`}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Header */}
      <h2 className="text-3xl font-bold text-orange-600 mb-2"><FiTool className="inline w-6 h-6 mr-2" />Admin Dashboard</h2>
      <p className="mb-6 text-gray-600">Review and manage artisan products and accounts</p>

      {/* Tabs */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded font-medium transition-all ${
            activeTab === 'stats'
              ? 'bg-orange-600 text-white shadow-lg'
              : 'bg-white border border-orange-300 text-orange-600 hover:shadow-md hover:border-orange-400'
          }`}
          onClick={() => setActiveTab('stats')}
        >
          <FiBarChart2 className="inline w-4 h-4 mr-1" />
          <span className="ml-1">Stats</span>
        </button>
        <button
          className={`px-4 py-2 rounded font-medium transition-all ${
            activeTab === 'all-artisans'
              ? 'bg-orange-600 text-white shadow-lg'
              : 'bg-white border border-orange-300 text-orange-600 hover:shadow-md hover:border-orange-400'
          }`}
          onClick={() => setActiveTab('all-artisans')}
        >
          <FiUsers className="inline w-4 h-4 mr-1" /> All Artisans ({allArtisans.length})
        </button>
        <button
          className={`px-4 py-2 rounded font-medium transition-all ${
            activeTab === 'all-products'
              ? 'bg-orange-600 text-white shadow-lg'
              : 'bg-white border border-orange-300 text-orange-600 hover:shadow-md hover:border-orange-400'
          }`}
          onClick={() => setActiveTab('all-products')}
        >
          <FaBoxOpen className="inline w-4 h-4 mr-1" /> All Products ({allProducts.length})
        </button>
        <button
          className={`px-4 py-2 rounded font-medium transition-all ${
            activeTab === 'pending-products'
              ? 'bg-orange-600 text-white shadow-lg'
              : 'bg-white border border-orange-300 text-orange-600 hover:shadow-md hover:border-orange-400'
          }`}
          onClick={() => setActiveTab('pending-products')}
        >
          <FiClock className="inline w-4 h-4 mr-1" /> Pending Products ({products.length})
        </button>
        <button
          className={`px-4 py-2 rounded font-medium transition-all ${
            activeTab === 'pending-artisans'
              ? 'bg-orange-600 text-white shadow-lg'
              : 'bg-white border border-orange-300 text-orange-600 hover:shadow-md hover:border-orange-400'
          }`}
          onClick={() => setActiveTab('pending-artisans')}
        >
          <FiClock className="inline w-4 h-4 mr-1" /> Pending Artisans ({unapprovedArtisans.length})
        </button>
      </div>

      {/* Stats Tab */}
      {activeTab === 'stats' && <Stats stats={stats} loading={false} />}

      {/* Pending Products */}
      {activeTab === 'pending-products' && (
        <PendingProducts 
          products={products} 
          onApprove={handleApproveProduct} 
          onReject={handleRejectProduct} 
        />
      )}

      {/* Pending Artisans */}
      {activeTab === 'pending-artisans' && (
        <PendingArtisans 
          artisans={unapprovedArtisans} 
          onApprove={handleApproveArtisan} 
          onReject={handleRejectArtisan} 
        />
      )}

      {/* All Artisans */}
      {activeTab === 'all-artisans' && (
        <AllArtisans 
          artisans={allArtisans} 
          onApprove={handleApproveArtisan} 
          onReject={handleRejectArtisan} 
        />
      )}

      {/* All Products */}
      {activeTab === 'all-products' && (
        <AllProducts 
          products={allProducts} 
          onApprove={handleApproveProduct} 
          onReject={handleRejectProduct} 
        />
      )}

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default AdminDashboard;