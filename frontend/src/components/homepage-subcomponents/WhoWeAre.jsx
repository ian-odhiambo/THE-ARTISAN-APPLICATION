import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import bannerImg from '../../assets/hero.png';
import videoSrc from '../../assets/video.mp4';

const WhoWeAre = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-screen min-h-[400px] md:h-[450px] flex flex-col md:flex-row" style={{ backgroundImage: `url(${bannerImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {/* Left Half o my hero section - Video */}
      <div className="w-full md:w-1/2 relative h-64 md:h-auto">
        <video
          src={videoSrc}
          autoPlay
          muted
          loop
          className="w-full h-full object-cover"
        />
      </div>
      {/* Right Half will be informative- Who We Are */}
      <div className="w-full md:w-1/2 relative flex flex-col justify-center items-center text-center px-2 md:px-4 py-4 md:py-0 overflow-visible" style={{ backgroundImage: `url(${bannerImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="overflow-visible relative z-10"
        >
          <h2 className="text-xl md:text-2xl font-bold mb-2 md:mb-3 text-orange-600 dark:text-orange-400">Who We Are</h2>
          <p className="mb-3 md:mb-4 text-sm md:text-base text-gray-100 max-w-sm mx-auto">
            Celebrating India's rich heritage of craftsmanship by connecting talented artisans with customers nationwide. Every product is crafted with love by skilled Indian creators. Celebrate handmade and heartmade products.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/cart')}
            className="bg-orange-600 hover:bg-orange-700 px-6 py-3 rounded-lg text-white font-semibold text-sm md:text-base shadow-lg block mx-auto"
          >
            Shop Now
          </motion.button>
        </motion.div>
        <div className="absolute inset-0 bg-black opacity-40 rounded-r-lg z-0" />
      </div>
    </div>
  );
};

export default WhoWeAre;