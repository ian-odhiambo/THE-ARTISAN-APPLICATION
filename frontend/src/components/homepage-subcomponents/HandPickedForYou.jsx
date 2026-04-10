import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

const HandPickedForYou = ({ filteredProducts, loading, isInWishlist, onWishlistToggle, onAddToCart, onCategoryClick }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No products match your search. Create some in AdminDashboard!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {filteredProducts.map((p, index) => (
        <motion.div
          key={p._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <div className="relative">
            {p.discountPercentage > 0 && (
              <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-20">
                {p.discountPercentage}% OFF
              </span>
            )}
            <ProductCard
              product={p}
              isInWishlist={isInWishlist(p._id)}
              onWishlistToggle={onWishlistToggle}
              onAddToCart={onAddToCart}
              onCategoryClick={onCategoryClick}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default HandPickedForYou;