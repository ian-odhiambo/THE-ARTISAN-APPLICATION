import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_API_BASE || '/api/v1'

import App from './App.jsx'
import { CartProvider } from './context/CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <App />
      <ToastContainer position="top-center" autoClose={2000} />
    </CartProvider>

  </StrictMode>,
)
