import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import Stats from '../components/admindashboard-subcomponents/Stats';
import AllArtisans from '../components/admindashboard-subcomponents/AllArtisans';
import AllProducts from '../components/admindashboard-subcomponents/AllProducts';
import PendingProducts from '../components/admindashboard-subcomponents/PendingProducts';
import PendingArtisans from '../components/admindashboard-subcomponents/PendingArtisans';

const AdminDashboard = ({ darkMode }) => {
  const [activeTab, setActiveTab] = useState('stats');
  const [products, setProducts] = useState([]);
  const [unapprovedArtisans, setUnapprovedArtisans] = useState([]);
  const [allArtisans, setAllArtisans] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchAllArtisans = async () => {
    try {
      console.log('Fetching all artisans from: /api/v1/admin/artisans');
      const res = await axios.get('/api/v1/admin/artisans');
      console.log('Artisans loaded:', res.data.length);
      setAllArtisans(res.data);
    } catch (err) {
      console.error('All artisans fetch failed:', err.response?.status, err.message);
      toast.error('Failed to fetch all artisans');
    }
  };

  const fetchAllProducts = async () => {
    try {
      console.log('Fetching all products...');
      const res = await axios.get('/api/v1/admin/products');
      setAllProducts(res.data);
    } catch (err) {
      console.error('Fetch products error:', err);
      toast.error('Failed to fetch all products');
    }
  };

  const fetchStats = async () => {
    try {
      console.log('Fetching admin stats...');
      const res = await axios.get('/api/v1/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Stats fetch failed:', err.response?.status, err.message);
      toast.error('Failed to fetch stats');
    }
  };

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      await Promise.all([
        fetchUnapprovedProducts(),
        fetchUnapprovedArtisans(),
        fetchAllArtisans(),
        fetchAllProducts(),
        fetchStats()
      ]);
      setLoading(false);
    };
    loadAllData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setShowDropdown(false);
    navigate('/');
  };

  const handleUpdatePassword = () => {
    setShowDropdown(false);
    navigate('/update-password');
  };

  const fetchUnapprovedProducts = async () => {
    try {
      const res = await axios.get('/api/v1/products/unapproved');
      console.log('Unapproved products:', res.data.length);
      setProducts(res.data);
    } catch (err) {
      toast.error('Failed to fetch products');
    }
  };

  const fetchUnapprovedArtisans = async () => {
    try {
      console.log('Fetching unapproved artisans...');
      const res = await axios.get('/api/v1/admin/unapproved-artisans');
      setUnapprovedArtisans(res.data);
    } catch (err) {
      console.error('Fetch unapproved artisans error:', err);
      toast.error('Failed to fetch artisans');
    }
  };

  const handleApproveProduct = async (id) => {
    try {
      console.log('=== APPROVING PRODUCT === ID:', id);
      const response = await axios.patch(`/api/v1/products/approve/${id}`, { isApproved: true });
      console.log('Approve response:', response.status, response.data);
      toast.success('Product approved ✅');
      fetchUnapprovedProducts();
      fetchAllProducts();
    } catch (err) {
      console.error('=== APPROVE ERROR ===');
      console.error('Status:', err.response?.status);
      console.error('Data:', err.response?.data);
      console.error('Message:', err.message);
      toast.error(`Error approving product (${err.response?.status || 'Unknown'})`);
    }
  };

  const handleRejectProduct = async (id) => {
    if (window.confirm('Are you sure you want to reject this product?')) {
      try {
      await axios.delete(`/api/v1/products/${id}`);
        toast.error('Product rejected ❌');
        fetchUnapprovedProducts();
      } catch (err) {
        toast.error('Error rejecting product');
      }
    }
  };

  const handleApproveArtisan = async (id) => {
    try {
      console.log('Approving artisan ID:', id);
      await axios.patch(`/api/v1/admin/approve-artisan/${id}`);
      toast.success('Artisan approved ✅');
      fetchAllArtisans();
      fetchUnapprovedArtisans();
    } catch (err) {
      console.error('Approve failed:', err.response?.status, err.response?.data || err.message);
      toast.error('Error approving artisan');
    }
  };

  const handleRejectArtisan = async (id) => {
    if (window.confirm('Are you sure you want to reject this artisan?')) {
      try {
        console.log('Rejecting artisan:', id);
        await axios.delete(`/api/v1/admin/reject-artisan/${id}`);
        toast.error('Artisan rejected ❌');
        fetchAllArtisans();
        fetchUnapprovedArtisans();
      } catch (err) {
        console.error('Reject artisan failed:', err.response?.status, err.response?.data);
        toast.error('Error rejecting artisan');
      }
    }
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
      <h2 className="text-3xl font-bold text-orange-600 mb-2">🛠️ Admin Dashboard</h2>
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
          📊
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
          👥 All Artisans ({allArtisans.length})
        </button>
        <button
          className={`px-4 py-2 rounded font-medium transition-all ${
            activeTab === 'all-products'
              ? 'bg-orange-600 text-white shadow-lg'
              : 'bg-white border border-orange-300 text-orange-600 hover:shadow-md hover:border-orange-400'
          }`}
          onClick={() => setActiveTab('all-products')}
        >
          📦 All Products ({allProducts.length})
        </button>
        <button
          className={`px-4 py-2 rounded font-medium transition-all ${
            activeTab === 'pending-products'
              ? 'bg-orange-600 text-white shadow-lg'
              : 'bg-white border border-orange-300 text-orange-600 hover:shadow-md hover:border-orange-400'
          }`}
          onClick={() => setActiveTab('pending-products')}
        >
          ⏳ Pending Products ({products.length})
        </button>
        <button
          className={`px-4 py-2 rounded font-medium transition-all ${
            activeTab === 'pending-artisans'
              ? 'bg-orange-600 text-white shadow-lg'
              : 'bg-white border border-orange-300 text-orange-600 hover:shadow-md hover:border-orange-400'
          }`}
          onClick={() => setActiveTab('pending-artisans')}
        >
          ⏳ Pending Artisans ({unapprovedArtisans.length})
        </button>
      </div>

      {/* Stats Tab */}
      {activeTab === 'stats' && <Stats stats={stats} loading={loading} />}

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