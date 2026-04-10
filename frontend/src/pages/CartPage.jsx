import React, { useState, useMemo, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Optimized Cart Item Component with lazy loading
const CartItem = React.memo(({ item, onIncrease, onDecrease, onRemove, priority = false }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  // Preload high-priority images
  useEffect(() => {
    if (priority && item.image && !imageLoaded) {
      const img = new Image();
      img.src = item.image;
      img.onload = handleImageLoad;
      img.onerror = handleImageError;
    }
  }, [priority, item.image, handleImageLoad, handleImageError, imageLoaded]);

  return (
    <li className="flex gap-4 border p-4 rounded shadow-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
      <div className="relative w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse bg-gray-300 dark:bg-gray-600 w-full h-full rounded"></div>
          </div>
        )}
        {!imageError ? (
          <img
            src={item.image}
            alt={item.title}
            className={`w-32 h-32 object-contain transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
            <svg className="w-8 h-8 mb-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
            <span className="text-xs">Image unavailable</span>
          </div>
        )}
      </div>
      <div className="flex-1">
        <h4 className="text-lg font-semibold">{item.title}</h4>
        {item.discountPercentage && item.discountPercentage > 0 ? (
          <p className="text-sm text-gray-600 dark:text-gray-400 text-right">
            Price: <span className="line-through">KSH{item.originalPrice}</span>{' '}
            <span className="text-red-600 font-semibold">KSH{item.price}</span>{' '}
            <span className="text-green-600 font-medium">({item.discountPercentage}% OFF)</span>
          </p>
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-400 text-right">Price: KSH{item.price}</p>
        )}
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => onDecrease(item._id)}
            className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            -
          </button>
          <span className="min-w-[2rem] text-center">{item.quantity}</span>
          <button
            onClick={() => onIncrease(item._id)}
            className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            +
          </button>
        </div>
        <button
          className="mt-2 text-red-600 hover:underline dark:text-red-400 transition-colors"
          onClick={() => onRemove(item._id)}
        >
          Remove
        </button>
      </div>
    </li>
  );
});
const CartPage = () => {
  const { cartItems, setCartItems, removeFromCart } = useCart();
  const [showDeliveryForm, setShowDeliveryForm] = useState(false);
  const [deliveryDetails, setDeliveryDetails] = useState({
    name: '',
    phoneNumber: '',
    address: '',
    paymentMode: '',
  });
  const [cartWarning, setCartWarning] = useState('');

// No need for duplicate clean - handled in CartContext

  const rawUser = JSON.parse(localStorage.getItem('user')) || {};
  const user = { ...rawUser, _id: rawUser._id || rawUser.id };

  const totalItems = useMemo(() => cartItems.reduce((sum, item) => sum + item.quantity, 0), [cartItems]);
  const totalPrice = useMemo(() => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0), [cartItems]);

  const increaseQuantity = useCallback((id) => {
    const updated = cartItems.map(item =>
      item._id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    toast.info('Quantity increased');
    setCartItems(updated);
    localStorage.setItem('cartItems', JSON.stringify(updated));
  }, [cartItems, setCartItems]);

  const decreaseQuantity = useCallback((id) => {
    const updated = cartItems.map(item =>
      item._id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
    );
    toast.info('Quantity decreased');
    setCartItems(updated);
    localStorage.setItem('cartItems', JSON.stringify(updated));
  }, [cartItems, setCartItems]);

  const saveOrder = async (paymentStatus) => {
    try {
      if (cartItems.length === 0) {
        toast.error('Cart empty');
        return null;
      }

      const orderData = {
        items: cartItems.map(item => ({
          productId: item._id,
          quantity: item.quantity,
          artisan: item.artisanId || item.artisan,
        })),
        total: totalPrice,
        address: deliveryDetails.address,
        paymentStatus
      };
      console.log('Sending orderData:', orderData);

      const response = await axios.post('http://localhost:5000/api/v1/orders', orderData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      const savedOrder = response.data.order;

      toast.success(`Order placed successfully (${paymentStatus})`);
      setCartItems([]);
      localStorage.removeItem('cartItems');
      setShowDeliveryForm(false);

      return savedOrder;
    } catch (err) {
      toast.error('Failed to save order: ' + (err.response?.data?.error || err.message));
      console.error(err);
      throw err;
    }
  };

  const handleRemove = useCallback((id) => {
    removeFromCart(id);
    toast.success('Item removed from cart');
  }, [removeFromCart]);

  const handlePlaceOrder = useCallback(() => {
    setShowDeliveryForm(true);
    toast.info('Enter your delivery details');
  }, []);

  const handleMpesaPayment = async () => {
    try {
      if (!deliveryDetails.phoneNumber || !deliveryDetails.phoneNumber.startsWith('254')) {
        toast.error('Please enter valid Kenyan phone number (2547xxxxxxxx)');
        return;
      }

      const response = await axios.post('http://localhost:5000/api/v1/payment/order', {
        amount: totalPrice,
        phoneNumber: deliveryDetails.phoneNumber,
        orderItems: cartItems.map(item => ({
          productId: item._id,
          quantity: item.quantity,
          artisan: item.artisanId || item.artisan
        })),
        address: deliveryDetails.address
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      toast.success('M-Pesa PIN prompt sent to your phone! Complete payment there.');
      console.log('M-Pesa response:', response.data);

      // Clear cart after successful initiation
      setCartItems([]);
      localStorage.removeItem('cart');
      setShowDeliveryForm(false);
    } catch (error) {
      toast.error('M-Pesa payment initiation failed: ' + (error.response?.data?.details || error.message));
      console.error('M-Pesa Error:', error.response?.data || error);
    }
  };

  const handleFinalSubmit = async () => {
    const { name, phoneNumber, address, paymentMode } = deliveryDetails;

    if (!name || !phoneNumber || !address) {
      toast.error('Please fill in all delivery details');
      return;
    }

    if (!user || !user._id) {
      toast.error('You must be logged in to place an order');
      return;
    }

    if (!paymentMode) {
      toast.error('Please select a payment mode');
      return;
    }

    if (paymentMode === 'mpesa' && (!phoneNumber || !phoneNumber.startsWith('254'))) {
      toast.error('Please enter valid M-Pesa phone number (2547xxxxxxxx)');
      return;
    }

    if (paymentMode === 'cod') {
      try {
        const savedOrder = await saveOrder('Pending');
        if (savedOrder) {
          await axios.post('http://localhost:5000/api/v1/email/order-confirmation', {
            orderId: savedOrder._id,
            customerEmail: user.email,
            customerName: user.name,
            items: cartItems.map(item => ({
              title: item.title,
              quantity: item.quantity,
              price: item.price,
            })),
            totalAmount: totalPrice,
            paymentMethod: 'Cash on Delivery'
          }); // No auth for email
        }
        toast.success('Order placed with COD! Check email.');
      } catch (error) {
        if (error.response?.status !== 500) throw error;
        console.error('Email failed:', error);
        toast.warning('Order saved but email failed');
      }
    } else if (paymentMode === 'mpesa') {
      handleMpesaPayment();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">🛒 Your Cart</h2>

        {cartItems.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">Your cart is empty.</p>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left - Cart Items */}
            <div className="flex-1">
              <ul className="space-y-6">
                {cartItems.map((item) => (
                  <CartItem
                    key={item._id}
                    item={item}
                    onIncrease={increaseQuantity}
                    onDecrease={decreaseQuantity}
                    onRemove={handleRemove}
                  />
                ))}
              </ul>
            </div>

            {/* Right - Delivery Form or Summary */}
            <div className="w-full lg:w-1/3">
              {showDeliveryForm ? (
                <div className="space-y-4 bg-gray-50 dark:bg-gray-800 p-4 rounded shadow-md">
                  <h3 className="text-xl font-semibold">🏠 Delivery Address</h3>
                  {[
                    { name: 'name', placeholder: 'Full Name' },
                    { name: 'phoneNumber', placeholder: 'M-Pesa Phone (2547xxxxxxxx)', type: 'tel' },
                    { name: 'address', placeholder: 'Full Address (Street, City, County)' },
                  ].map(({ name, placeholder, type = 'text' }) => (
                    <input
                      key={name}
                      type={type}
                      placeholder={placeholder}
                      value={deliveryDetails[name] || ''}
                      onChange={(e) => setDeliveryDetails({ ...deliveryDetails, [name]: e.target.value })}
                      className="w-full border p-2 rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                    />
                  ))}
                  <select
                    value={deliveryDetails.paymentMode}
                    onChange={(e) => setDeliveryDetails({ ...deliveryDetails, paymentMode: e.target.value })}
                    className="w-full border p-2 rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">Select Payment Mode</option>
                    <option value="cod">Cash on Delivery</option>
                    <option value="mpesa">M-Pesa</option>
                  </select>

                  <button
                    onClick={handleFinalSubmit}
                    className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition"
                  >
                    Confirm Order
                  </button>
                </div>
              ) : (
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded shadow-md">
                  <h3 className="text-xl font-semibold mb-4">🧾 Order Summary</h3>
                  <p>Total Items: {totalItems}</p>
                  <p>Total Price: KSH{totalPrice}</p>

                  <button
                    className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    onClick={handlePlaceOrder}
                  >
                    Place Order
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </div>
  );
};

export default CartPage;
