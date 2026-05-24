import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const carouselRef = useRef(null);
  const navigate = useNavigate();
  const chatAppUrl =
    import.meta.env.VITE_CHAT_APP_URL || "http://localhost:8001";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiUrl = "http://localhost:5000/api/v1";

        const endpoint =
          categoryName === "all"
            ? "/products"
            : `/products/category/${categoryName}`;
        console.log("Fetching from:", `${apiUrl}${endpoint}`);
        const res = await axios.get(`${apiUrl}${endpoint}`);
        console.log(
          "Fetched products for",
          categoryName || "all",
          ":",
          res.data.length,
          res.data[0],
        );
        setProducts(res.data);
      } catch (err) {
        console.error(
          "CategoryPage fetch error:",
          err.response?.status,
          err.message,
        );
        setError(
          err.response?.data?.error ||
            err.message ||
            "Failed to fetch products",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryName]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        <button
          onClick={() => navigate("/")}
          className="mb-6 text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back to Home
        </button>

        <h2 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100 text-center">
          {categoryName === "all"
            ? "All Products"
            : `${categoryName.charAt(0).toUpperCase() + categoryName.slice(1)} Collection`}
        </h2>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-lg">Loading products...</span>
          </div>
        ) : error ? (
          <p className="text-red-600 dark:text-red-400 text-center">
            Error: {error}. Check console for details.
          </p>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
              No approved products found in "{categoryName}" category.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
              Artisans have added products but admin approval is needed.
            </p>
            <a
              href="/admin-dashboard"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Go to Admin → Approve Products
            </a>
          </div>
        ) : (
          (() => {
            // Group products by artisan case-insensitive
            const artisansMap = {};
            products.forEach((p) => {
              const artisanName = p.artisanId?.name || "Unknown";
              if (!artisansMap[artisanName]) {
                artisansMap[artisanName] = {
                  phone: p.artisanId?.phone || "",
                  products: [],
                };
              }
              artisansMap[artisanName].products.push(p);
            });
            const artisans = Object.entries(artisansMap);

            return (
              <div className="space-y-8">
                {artisans.map(([artisanName, data]) => (
                  <div
                    key={artisanName}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                  >
                    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6 pb-4 border-b">
                      <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                        {artisanName}
                      </h3>
                      <a
                        href={chatAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-800"
                        title="Chat on My-fundi Chat Application"
                      >
                        <svg
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1.5 15h-3v-2.25h3V17zm0-3.75h-3V6.75h3v6.5z" />
                        </svg>
                        Chat on My-fundi Chat Application
                      </a>
                    </div>
                    <div className="carousel-container">
                      <div
                        ref={carouselRef}
                        className="carousel flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory"
                      >
                        {data.products.map((p) => (
                          <div
                            key={p._id}
                            className="carousel-card flex-none snap-center w-72 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg transition-all p-4"
                          >
                            <img
                              src={p.image}
                              alt={p.title}
                              className="w-full h-40 object-cover rounded cursor-pointer"
                              onClick={() => navigate(`/product/${p._id}`)}
                            />
                            <h4 className="text-lg font-semibold mt-2 truncate">
                              {p.title}
                            </h4>
                            <p className="text-blue-600 font-bold text-lg">
                              KSh {p.price}
                            </p>
                            <a
                              href={chatAppUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-100 hover:text-blue-700 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-800"
                            >
                              <svg
                                className="w-4 h-4"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1.5 15h-3v-2.25h3V17zm0-3.75h-3V6.75h3v6.5z" />
                              </svg>
                              Chat on My-fundi Chat Application
                            </a>
                          </div>
                        ))}
                      </div>
                      <button
                        className="carousel-prev absolute left-0 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full shadow-md hover:shadow-lg transition"
                        onClick={() =>
                          carouselRef.current?.scrollBy({
                            left: -320,
                            behavior: "smooth",
                          })
                        }
                      >
                        ‹
                      </button>
                      <button
                        className="carousel-next absolute right-0 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-gray-800/90 p-2 rounded-full shadow-md hover:shadow-lg transition"
                        onClick={() =>
                          carouselRef.current?.scrollBy({
                            left: 320,
                            behavior: "smooth",
                          })
                        }
                      >
                        ›
                      </button>
                    </div>
                    <style jsx>{`
                      .carousel-container {
                        position: relative;
                      }
                      .carousel {
                        scroll-behavior: smooth;
                      }
                      .carousel-card {
                        min-width: 280px;
                      }
                      .scrollbar-hide::-webkit-scrollbar {
                        display: none;
                      }
                      .scrollbar-hide {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                      }
                      .carousel-prev,
                      .carousel-next {
                        z-index: 10;
                        cursor: pointer;
                        font-size: 1.5rem;
                        font-weight: bold;
                        border: none;
                      }
                      @media (max-width: 768px) {
                        .carousel-card {
                          min-width: 250px;
                        }
                      }
                    `}</style>
                  </div>
                ))}
              </div>
            );
          })()
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
