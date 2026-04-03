import React, { useEffect, useState, useMemo, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';

import Navigation from '../components/homepage-subcomponents/Navigation';
import WhoWeAre from '../components/homepage-subcomponents/WhoWeAre';
import DiscoverCategories from '../components/homepage-subcomponents/DiscoverCategories';
import TopSellers from '../components/homepage-subcomponents/TopSellers';
import SpecialDiscounts from '../components/homepage-subcomponents/SpecialDiscounts';
import NewArrivals from '../components/homepage-subcomponents/NewArrivals';
import HandPickedForYou from '../components/homepage-subcomponents/HandPickedForYou';
import WhyChooseUs from '../components/homepage-subcomponents/WhyChooseUs';
import Footer from '../components/homepage-subcomponents/Footer';

const HomePage = ({ darkMode, toggleDarkMode }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  const { wishlistItems, addToWishlist, removeFromWishlist } = useWishlist();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || null;

  // Products fetch
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const apiUrl = 'http://localhost:5000/api/v1';
        console.log('Fetching products from:', `${apiUrl}/products`);
        const res = await axios.get(`${apiUrl}/products`);
        console.log('API Response:', res.data.length, 'products');
        
        const productsWithAttributes = res.data.map((product, index) => ({
          ...product,
          rating: 4.5,
          reviews: 24,
          isTopSeller: index === 0,
          discountPercentage: index === 1 ? 15 : 0,
          isNewArrival: index === 1
        }));
        console.log('Processed products:', productsWithAttributes);
        setProducts(productsWithAttributes);
      } catch (err) {
        console.error('API Error:', err);
        toast.error('API failed - check backend');
        setProducts([]); 
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Memoized filtering
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesTitle = p.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesCategory = selectedCategory ? p.category === selectedCategory : true;
      return matchesTitle && matchesCategory;
    });
  }, [products, debouncedSearchTerm, selectedCategory]);

  const categories = useMemo(() => [...new Set(products.map(p => p.category).filter(Boolean))], [products]);

  const isInWishlist = useCallback((id) => wishlistItems.some(p => p._id === id), [wishlistItems]);

  const handleWishlistToggle = useCallback((product) => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
      toast.success('Removed from wishlist');
    } else {
      addToWishlist(product);
      toast.success('Added to wishlist');
    }
  }, [isInWishlist, addToWishlist, removeFromWishlist]);

  const handleCategoryClick = (cat) => {
    navigate(`/category/${cat}`);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-gray-900 dark:text-gray-100 pt-16 md:pt-24">
      <Navigation
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        user={user}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        isScrolled={isScrolled}
      />

      <WhoWeAre />

      <DiscoverCategories categories={categories} onCategoryClick={handleCategoryClick} />

      <div className="px-4 py-12 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto space-y-12">
          <TopSellers
            products={products}
            isInWishlist={isInWishlist}
            onWishlistToggle={handleWishlistToggle}
            onCategoryClick={handleCategoryClick}
          />
          <SpecialDiscounts
            products={products}
            isInWishlist={isInWishlist}
            onWishlistToggle={handleWishlistToggle}
            onCategoryClick={handleCategoryClick}
          />
          <NewArrivals
            products={products}
            isInWishlist={isInWishlist}
            onWishlistToggle={handleWishlistToggle}
            onCategoryClick={handleCategoryClick}
          />
        </div>
      </div>

      <div id="product-grid" className="px-4 py-12 max-w-7xl mx-auto">
        <h3 className="text-2xl font-bold mb-8 text-center">✨ Handpicked For You</h3>
        <HandPickedForYou
          filteredProducts={filteredProducts}
          loading={loading}
          isInWishlist={isInWishlist}
          onWishlistToggle={handleWishlistToggle}
          onCategoryClick={handleCategoryClick}
        />
      </div>

      <WhyChooseUs />

      <Footer user={user} />

      {/* Back to Top Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: isScrolled ? 1 : 0 }}
        className="fixed bottom-6 right-6 bg-orange-600 text-white p-3 rounded-full shadow-lg z-40"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Back to top"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </motion.button>
    </div>
  );
};

export default HomePage;