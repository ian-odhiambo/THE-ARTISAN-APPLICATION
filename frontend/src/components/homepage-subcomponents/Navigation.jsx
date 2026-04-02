import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSun, FiMoon, FiMenu, FiX, FiHome, FiInfo, FiShoppingCart, FiUser, FiHeart, FiSearch, FiChevronDown } from 'react-icons/fi';

const Navigation = ({ darkMode, toggleDarkMode, searchTerm, setSearchTerm, selectedCategory, setSelectedCategory, categories, user, mobileMenuOpen, setMobileMenuOpen, isScrolled }) => {
  const mobileMenuRef = useRef();

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) setMobileMenuOpen(false);
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [setMobileMenuOpen]);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 bg-white dark:bg-gray-800 dark:text-gray-100 shadow-md transition-all duration-300 ${isScrolled ? 'py-2 shadow-lg' : 'py-3 md:py-4'} px-4 md:px-6 flex justify-between items-center`}>
      <Link
        to="/"
        className="text-xl md:text-2xl font-bold text-orange-600 hover:underline"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        Desi-Etsy 🧵
      </Link>

      {/* Search and Category in Header */}
      <div className="hidden md:flex flex-1 max-w-xl mx-6 items-center gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search handmade treasures..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setTimeout(() => {
                document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
          />
        </div>
        <div className="relative w-48">
          <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setTimeout(() => {
                document.getElementById('product-grid')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="appearance-none pl-4 pr-10 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
          >
            <option value="">All Categories</option>
            {categories.map((cat, index) => (
              <option key={index} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 focus:outline-none"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <FiSun size={24} /> : <FiMoon size={24} />}
        </button>
      </div>

      {/* Mobile Header Controls */}
      <div className="md:hidden flex items-center gap-2">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-orange-600 dark:hover:text-orange-400 focus:outline-none"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>
        <button
          className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-orange-600 focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-6">
        <Link to="/" className="hover:text-orange-600 transition-colors flex items-center gap-1"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <FiHome /> Home
        </Link>
        <button
          onClick={() => document.getElementById('about-us')?.scrollIntoView({ behavior: 'smooth' })}
          className="hover:text-orange-600 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <FiInfo /> About
        </button>
        <Link to="/cart" className="hover:text-orange-600 transition-colors flex items-center gap-1">
          <FiShoppingCart /> Cart
        </Link>
        <Link to="/wishlist" className="hover:text-orange-600 transition-colors flex items-center gap-1">
          <FiHeart /> Wishlist
        </Link>
        {user ? (
          <Link to="/profile" className="hover:text-orange-600 transition-colors flex items-center gap-1">
            <FiUser /> {user.name}
          </Link>
        ) : (
          <Link to="/login" className="hover:text-orange-600 transition-colors flex items-center gap-1">
            <FiUser /> Login
          </Link>
        )}
      </nav>

      {/* Mobile Navigation */}
      <div 
        ref={mobileMenuRef}
        className={`fixed top-0 right-0 h-auto max-h-screen overflow-y-auto w-1/2 max-w-xs bg-white dark:bg-gray-800 dark:text-gray-100 shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <span className="font-bold text-orange-600">Menu</span>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <FiX size={20} />
            </button>
          </div>
          
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative mb-3">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search handmade treasures..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:placeholder-gray-400"
              />
            </div>
            <div className="relative mb-3">
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
              >
                <option value="">All Categories</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-center">
              <button
                onClick={toggleDarkMode}
                className="flex items-center gap-3 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <FiSun size={20} className="text-orange-500" /> : <FiMoon size={20} className="text-blue-500" />}
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {darkMode ? 'Light Mode' : 'Dark Mode'}
                </span>
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <Link 
              to="/" 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
              onClick={() => {
                setMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <FiHome className="flex-shrink-0" />
              <span>Home</span>
            </Link>
            <button
              onClick={() => {
                document.getElementById('about-us')?.scrollIntoView({ behavior: 'smooth' });
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-left"
            >
              <FiInfo className="flex-shrink-0" />
              <span>About Us</span>
            </button>
            <Link 
              to="/cart" 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FiShoppingCart className="flex-shrink-0" />
              <span>Cart</span>
            </Link>
            <Link 
              to="/wishlist" 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FiHeart className="flex-shrink-0" />
              <span>Wishlist</span>
            </Link>
            {user ? (
              <Link
                to="/profile"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiUser className="flex-shrink-0" />
                <span>{user.name}</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-orange-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FiUser className="flex-shrink-0" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Navigation;