import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';

const TopSellers = ({ products, isInWishlist, onWishlistToggle, onAddToCart, onCategoryClick }) => {
  const topSellers = products.filter(p => p.isTopSeller).slice(0, 8);

  if (topSellers.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-4">
      <h3 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
        <span className="text-orange-600">🏆</span> Top Sellers
      </h3>
      <div className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide">
        {topSellers.map((p, index) => (
          <motion.div
            key={p._id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="relative">
              <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded z-20">
                🏆 Featured artisanry
              </span>
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
    </div>
  );
};

export default TopSellers;