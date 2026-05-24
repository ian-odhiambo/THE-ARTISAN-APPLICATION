import React from 'react';
import { motion } from 'framer-motion';
import { FiTruck } from 'react-icons/fi';
import { FaPaintBrush, FaCheckCircle } from 'react-icons/fa';

const WhyChooseUs = () => {
  const features = [
    {
      icon: <FaPaintBrush className="w-10 h-10 mx-auto" />,
      title: 'Authentic Handmade',
      description: 'Every product is crafted with love by skilled Kenyan artisans'
    },
    {
      icon: <FiTruck className="w-10 h-10 mx-auto" />,
      title: 'Fast Delivery',
      description: 'Get your orders delivered quickly with our reliable partners'
    },
    {
      icon: <FaCheckCircle className="w-10 h-10 mx-auto" />,
      title: 'Quality Guarantee',
      description: 'We ensure every product meets our high quality standards'
    }
  ];

  return (
    <div className="bg-orange-50 dark:bg-gray-900 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h3 className="text-2xl font-bold mb-12 text-center">Why Choose The Artsian app?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm text-center"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyChooseUs;