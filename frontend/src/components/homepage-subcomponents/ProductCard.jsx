import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHeart, FiStar, FiTruck } from 'react-icons/fi';

const ProductCard = React.memo(({ product, isInWishlist, onWishlistToggle, onCategoryClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  useEffect(() => {
    if (product.image && !imageLoaded) {
      const img = new Image();
      img.src = product.image;
      img.onload = handleImageLoad;
      img.onerror = handleImageError;
    }
  }, [product.image, handleImageLoad, handleImageError, imageLoaded]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex-shrink-0 w-64"
    >
      <Link
        to={`/product/${product._id}?discount=${product.discountPercentage}`}
        className="group bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 block relative"
      >
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onWishlistToggle(product);
            onAddToCart(product);
          }}
          className="absolute top-3 right-3 z-10 p-2 bg-white dark:bg-gray-700 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
          aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <FiHeart
            className={`w-5 h-5 ${isInWishlist ? 'text-red-500 fill-current' : 'text-gray-400'}`}
          />
        </button>

        <div className="relative h-48 overflow-hidden">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-pulse bg-gray-300 dark:bg-gray-600 w-full h-full rounded"></div>
            </div>
          )}
          {!imageError ? (
            <img
              src={product.image}
              alt={product.title}
              className={`w-full h-full object-contain transition-all duration-500 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 h-full">
              <svg className="w-8 h-8 mb-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              <span className="text-xs">Image unavailable</span>
            </div>
          )}
        </div>

        <div className="p-4">
          <h4 className="font-semibold text-lg mb-1 group-hover:text-orange-600 transition-colors line-clamp-2">
            {product.title}
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{product.category}</p>

          <div className="flex items-center mb-2">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <FiStar
                  key={i}
                  className={`w-4 h-4 ${i < Math.floor(product.rating || 4) ? 'fill-current' : ''}`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({product.reviews || 24})</span>
          </div>

          <div className="flex justify-between items-center mt-3">
            {product.discountPercentage > 0 ? (
              <div className="flex flex-col">

                <span className="text-red-600 font-bold text-lg">
                  KSH {Math.round(product.price * (1 - product.discountPercentage / 100))}
                </span>
              </div>
            ) : (
              <span className="text-orange-600 font-bold text-lg">KSH {product.price}</span>
            )}
            <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
              <FiTruck className="mr-1" /> Free delivery
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

export default ProductCard;
