import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

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
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/admin/artisans`);
      setAllArtisans(res.data);
    } catch (err) {
      toast.error('Failed to fetch all artisans');
    }
  };

  const fetchAllProducts = async () => {
    try {
`http://localhost:5000/api/v1/admin/products`
      setAllProducts(res.data);
    } catch (err) {
      toast.error('Failed to fetch all products');
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/admin/stats`);
      setStats(res.data);
    } catch (err) {
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
`http://localhost:5000/api/v1/products/unapproved`
      setProducts(res.data);
    } catch (err) {
      toast.error('Failed to fetch products');
    }
  };

  const fetchUnapprovedArtisans = async () => {
    try {
`http://localhost:5000/api/v1/admin/unapproved-artisans`
      setUnapprovedArtisans(res.data);
    } catch (err) {
      toast.error('Failed to fetch artisans');
    }
  };

  const handleApproveProduct = async (id) => {
    try {
      await axios.patch(`${process.env.REACT_APP_API_URL}/products/approve/${id}`, { isApproved: true });
      toast.success('Product approved ');
      fetchUnapprovedProducts();
    } catch (err) {
      toast.error('Error approving product');
    }
  };

  const handleRejectProduct = async (id) => {
    if (window.confirm('Are you sure you want to reject this product?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/products/${id}`);
        toast.error('Product rejected ❌');
        fetchUnapprovedProducts();
      } catch (err) {
        toast.error('Error rejecting product');
      }
    }
  };

  const handleApproveArtisan = async (id) => {
    try {
      await axios.patch(`${process.env.REACT_APP_API_URL}/admin/approve-artisan/${id}`);
      toast.success('Artisan approved ✅');
      fetchUnapprovedArtisans();
    } catch (err) {
      toast.error('Error approving artisan');
    }
  };

  const handleRejectArtisan = async (id) => {
    if (window.confirm('Are you sure you want to reject this artisan?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/admin/reject-artisan/${id}`);
        toast.error('Artisan rejected ❌');
        fetchUnapprovedArtisans();
      } catch (err) {
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
      {activeTab === 'stats' && (
        <div>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
          ) : stats ? (
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
          )}
        </div>
      )}
      {/* Pending Products */}
      {activeTab === 'pending-products' && (
        <div>
          <h3 className="text-xl font-semibold mb-4">⏳ Pending Product Approvals ({products.length})</h3>
          {products.length === 0 ? (
            <p className="text-gray-500">No pending products</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((p) => (
                <div key={p._id} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 hover:shadow-xl transition-all border border-yellow-200">
                  <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-yellow-100 text-yellow-800 mb-3">
                    Pending
                  </span>
                  <img
                    src={p.image || '/placeholder.jpg'}
                    alt={p.title}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                  <h4 className="font-bold text-lg line-clamp-1 mb-1">{p.title}</h4>
                  <p className="text-sm text-gray-600 mb-1">{p.category}</p>
                  <p className="text-lg font-semibold text-orange-600 mb-2">₹{p.price}</p>
                  <p className="text-sm text-gray-500 mb-3">
                    Artisan: {p.artisanId?.name || 'N/A'}
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproveProduct(p._id)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded font-medium transition-all"
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => handleRejectProduct(p._id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded font-medium transition-all"
                    >
                      ❌ Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}


      {/* Pending Artisans */}
      {activeTab === 'pending-artisans' && (
        <div>
          <h3 className="text-xl font-semibold mb-4">⏳ Pending Artisan Approvals ({unapprovedArtisans.length})</h3>
          {unapprovedArtisans.length === 0 ? (
            <p className="text-gray-500">No pending artisans</p>
          ) : (
            <ul className="space-y-4">
              {unapprovedArtisans.map((user) => (
                <li
                  key={user._id}
                  className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 hover:shadow-xl transition-all border border-yellow-200 flex flex-col md:flex-row md:items-center gap-4"
                >
                  <div className="flex-1">
                    <span className="inline-block px-3 py-1 text-xs font-bold rounded-full bg-yellow-100 text-yellow-800 mb-2">
                      Pending
                    </span>
                    <h4 className="font-bold text-xl mb-1">{user.name}</h4>
                    <p className="text-gray-600 mb-2">{user.email}</p>
                    <p className="text-sm text-gray-500">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApproveArtisan(user._id)}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => handleRejectArtisan(user._id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-all"
                    >
                      ❌ Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {/* All Artisans */}
      {activeTab === 'all-artisans' && (
        <div>
          <h3 className="text-xl font-semibold mb-4">👥 All Artisans ({allArtisans.length})</h3>
          {allArtisans.length === 0 ? (
            <p className="text-gray-500">No artisans registered</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border">
                <thead>
                  <tr className="border-b">
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider dark:text-gray-300">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider dark:text-gray-300">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider dark:text-gray-300">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider dark:text-gray-300">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider dark:text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {allArtisans.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.isApproved
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}>
                          {user.isApproved ? 'Approved' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {!user.isApproved ? (
                          <>
                            <button
                              onClick={() => handleApproveArtisan(user._id)}
                              className="text-green-600 hover:text-green-900 mr-3"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectArtisan(user._id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <span className="text-green-600">✓ Active</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      {/* All Products */}
      {activeTab === 'all-products' && (
        <div>
          <h3 className="text-xl font-semibold mb-4">📦 All Products ({allProducts.length})</h3>
          {allProducts.length === 0 ? (
            <p className="text-gray-500">No products</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {allProducts.map((p) => (
                <div key={p._id} className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 hover:shadow-xl transition-all border ${
                  p.isApproved ? 'border-green-200' : 'border-yellow-200'
                }">
                  <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full mb-3 ${
                    p.isApproved 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900' 
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900'
                  }`}>
                    {p.isApproved ? 'Approved' : 'Pending'}
                  </span>
                  <img
                    src={p.image || '/placeholder.jpg'}
                    alt={p.title}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                  <h4 className="font-bold text-lg line-clamp-1 mb-1">{p.title}</h4>
                  <p className="text-sm text-gray-600 mb-1">{p.category}</p>
                  <p className="text-lg font-semibold text-orange-600 mb-2">₹{p.price}</p>
                  <p className="text-sm text-gray-500 mb-3">
                    Artisan: {p.artisanId?.name || 'N/A'}
                  </p>
                  {!p.isApproved && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveProduct(p._id)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-medium"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectProduct(p._id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm font-medium"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
};

export default AdminDashboard;
