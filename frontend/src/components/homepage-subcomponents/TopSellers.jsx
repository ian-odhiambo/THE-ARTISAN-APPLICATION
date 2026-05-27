import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiAward } from "react-icons/fi";
import ProductCard from "./ProductCard";

const TopSellers = ({
  products,
  isInWishlist,
  onWishlistToggle,
  onAddToCart,
  onCategoryClick,
}) => {
  const topSellers = products.filter((p) => p.isTopSeller).slice(0, 8);
  const displayedSellers =
    topSellers.length > 0 ? topSellers : products.slice(0, 8);
  const carouselRef = useRef(null);
  const selectedRefs = useRef({});
  const [isPaused, setIsPaused] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    if (!carouselRef.current || isPaused) return;

    const node = carouselRef.current;
    const intervalId = window.setInterval(() => {
      if (!node) return;
      const maxScroll = node.scrollWidth - node.clientWidth;
      if (node.scrollLeft >= maxScroll - 1) {
        node.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        node.scrollBy({ left: 320, behavior: "smooth" });
      }
    }, 3200);

    return () => window.clearInterval(intervalId);
  }, [isPaused, topSellers.length]);

  useEffect(() => {
    if (!selectedProductId) return;
    const selectedEl = selectedRefs.current[selectedProductId];
    selectedEl?.scrollIntoView({ behavior: "smooth", inline: "center" });
  }, [selectedProductId]);

  // show fallback products if none are explicitly marked as top sellers
  if (displayedSellers.length === 0) return null;

  return (
    <div className="pb-4">
      <div className="text-center mb-6">
        <FiAward className="mx-auto w-10 h-10 text-orange-500 mb-2" />
        <h3 className="text-2xl font-bold">Top Sellers</h3>
      </div>
      <div
        ref={carouselRef}
        className="flex overflow-x-auto space-x-6 pb-4 scrollbar-hide scroll-smooth"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {displayedSellers.map((p, index) => (
          <motion.div
            key={p._id}
            ref={(el) => {
              if (el) selectedRefs.current[p._id] = el;
            }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex-shrink-0"
            onMouseEnter={() => setSelectedProductId(p._id)}
            onClick={() => setIsPaused(true)}
          >
            <ProductCard
              product={p}
              isInWishlist={isInWishlist(p._id)}
              onWishlistToggle={onWishlistToggle}
              onAddToCart={onAddToCart}
              onCategoryClick={onCategoryClick}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TopSellers;
