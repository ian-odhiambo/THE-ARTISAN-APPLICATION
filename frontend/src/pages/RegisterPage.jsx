import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getPasswordError = (password) => {
    if (password.length < 8) return 'Password must be at least 8 characters.';
    if (!/[A-Z]/.test(password)) return 'Password must include at least one uppercase letter.';
    if (!/[a-z]/.test(password)) return 'Password must include at least one lowercase letter.';
if (!/\d/.test(password)) return 'Password must include at least one number.';
if (!/[\W_]/.test(password)) return 'Password must include at least one special character.';
    return '';
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const passwordError = getPasswordError(form.password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    setLoading(true);
    try {
await axios.post('http://localhost:5000/api/v1/auth/register', form);
      toast.success('Registration successful!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error('Register error:', err);
      toast.error(err.response?.data?.error || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-pink-100 dark:from-gray-800 dark:to-gray-900 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-orange-600 dark:text-orange-400 text-center mb-2">Create an Account ✨</h2>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6">Register to explore Desi-Etsy</p>

        <form className="space-y-4" onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
          />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 cursor-pointer text-lg"
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </span>
          </div>

          {form.password && getPasswordError(form.password) && (
            <p className="text-sm text-red-600 dark:text-red-400">{getPasswordError(form.password)}</p>
          )}

          <select
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
          >
            <option value="customer">Customer</option>
            <option value="artisan">Artisan</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white py-2 rounded font-semibold transition"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-orange-600 dark:text-orange-400 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;

