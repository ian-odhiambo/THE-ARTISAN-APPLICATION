import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer',
    phone: ''
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

  const getPhoneError = (phone) => {
    if (phone) {
      const clean = phone.replace(/[^0-9]/g, '');
      if (clean.length < 9) return 'Phone too short';
      const normalized = clean.startsWith('0') ? '254' + clean.slice(1) : clean;
      if (!/^254[17]\d{8}$/.test(normalized)) return 'Invalid Kenyan phone (07/1xxxxxxxx)';
    }
    return '';
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log('Form submit:', form);

    const passwordError = getPasswordError(form.password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }
    
    const phoneError = getPhoneError(form.phone);
    if (phoneError) {
      toast.error(phoneError);
      return;
    }

    setLoading(true);
    try {
      const submitPhone = form.phone ? form.phone.replace(/[^0-9]/g, '').startsWith('0') ? '254' + form.phone.slice(1) : form.phone : '';
      const submitData = { ...form, phone: submitPhone };
      console.log('API call:', submitData);

      const res = await axios.post('/api/v1/auth/register', submitData);
      console.log('Success:', res.data);
      toast.success('Registration successful!');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      console.error('Register error:', err.response?.data || err);
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

          {form.phone && getPhoneError(form.phone) && (
            <p className="text-sm text-red-600 dark:text-red-400">{getPhoneError(form.phone)}</p>
          )}

          <select
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
          >
            <option value="customer">Customer</option>
            <option value="artisan">Artisan</option>
          </select>

          <input
            type="tel"
            placeholder="Phone (07xxxxxxxx or 2547xxxxxxxx)"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
          />

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

