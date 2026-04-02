import React from 'react';
import { motion } from 'framer-motion';

const DiscoverCategories = ({ categories, onCategoryClick }) => {
  return (
    <div className="px-4 py-12 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-900">
      <h3 className="text-2xl font-bold mb-8 text-center">Discover Categories</h3>
      <div className="flex flex-wrap gap-4 justify-center max-w-4xl mx-auto">
        {categories.map((cat, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              onClick={() => onCategoryClick(cat)}
              className="bg-white dark:bg-gray-800 border-2 border-orange-100 dark:border-gray-700 rounded-xl px-6 py-3 shadow-md transition-all duration-300 hover:bg-orange-50 dark:hover:bg-gray-700 hover:border-orange-200 hover:shadow-lg"
            >
              <span className="font-medium text-orange-700">{cat}</span>
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DiscoverCategories;