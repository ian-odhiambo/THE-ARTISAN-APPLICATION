import { Link } from 'react-router-dom';
import { FiHome, FiShoppingCart, FiHeart, FiPackage, FiStar } from 'react-icons/fi';

const Footer = ({ user }) => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div id="about-us">
          <h4 className="text-lg font-semibold mb-4">About My-fundi</h4>
          <p className="text-sm text-gray-400 mb-4">
            To empower Kenya's artisans by connecting them directly with clients for custom work, while simultaneously offering a curated marketplace where finished handcrafted products can be discovered and purchased.
          </p>
          <p className="italic text-orange-300">Handmade. Heartmade. Just for you.</p>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <Link 
                to="/" 
                className="hover:text-orange-400 transition-colors flex items-center gap-2"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                <FiHome size={14} /> Home
              </Link>
            </li>
            <li>
              <Link to="/cart" className="hover:text-orange-400 transition-colors flex items-center gap-2">
                <FiShoppingCart size={14} /> Cart
              </Link>
            </li>
            <li>
              <Link to="/wishlist" className="hover:text-orange-400 transition-colors flex items-center gap-2">
                <FiHeart size={14} /> Wishlist
              </Link>
            </li>
            <li>
              <Link 
                to={user ? "/orders" : "/login"} 
                className="hover:text-orange-400 transition-colors flex items-center gap-2"
              >
                <FiPackage size={14} /> My Orders
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Information</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <Link to="/" className="hover:text-orange-400 transition-colors">About Us</Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-orange-400 transition-colors">Terms & Conditions</Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-orange-400 transition-colors">Privacy Policy</Link>
            </li>
            <li>
              <a 
                href="" 
                target="_blank" 
                rel="noreferrer" 
                className="hover:text-orange-400 transition-colors flex items-center gap-2"
              >
                <FiStar size={14} /> Our Oficial webpage 
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
          <div className="text-sm text-gray-300 space-y-2">
            <p> odhiamboian096@gmail.com</p>
            <p> +254704706076</p>
            <p> Nairobi, Kenya</p>
          </div>
          <div className="flex gap-4 mt-4">
            <button className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12a10 10 0 1 0-11.5 9.95v-7.05h-2.1v-2.9h2.1V9.5c0-2.07 1.23-3.22 3.13-3.22.91 0 1.86.16 1.86.16v2.05h-1.05c-1.03 0-1.35.64-1.35 1.3v1.56h2.3l-.37 2.9h-1.93v7.05A10 10 0 0 0 22 12"/>
              </svg>
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <circle cx="17.5" cy="6.5" r="1.5"/>
              </svg>
            </button>
            <button className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22.46 6c-.77.35-1.6.58-2.47.69a4.3 4.3 0 0 1 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04A4.28 4.28 0 0 0 11.1 9.03c0 .34.04.67.1.99A12.13 12.13 0 0 1 3.1 5.1a4.28 4.28 0 0 0 1.32 5.71c-.7-.02-1.36-.21-1.94-.53v.05a4.28 4.28 0 0 0 3.43 4.19c-.33.09-.68.14-1.04.14-.25 0-.5-.02-.74-.07a4.29 4.29 0 0 0 4 2.98A8.6 8.6 0 0 1 2 19.54a12.13 12.13 0 0 0 6.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.39-.01-.58A8.72 8.72 0 0 0 24 4.59a8.5 8.5 0 0 1-2.54.70z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="text-center text-gray-500 text-xs mt-12 pt-6 border-t border-gray-800">
        <p>© {new Date().getFullYear()} My-fundi. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;