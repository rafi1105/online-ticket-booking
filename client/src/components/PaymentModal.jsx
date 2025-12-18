import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { FaCreditCard, FaLock, FaTimes, FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../utils/api';

// Initialize Stripe with publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here');

// Card Element Styles
const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1f2937',
      fontFamily: '"Inter", sans-serif',
      '::placeholder': {
        color: '#9ca3af',
      },
    },
    invalid: {
      color: '#ef4444',
      iconColor: '#ef4444',
    },
  },
};

// Checkout Form Component
const CheckoutForm = ({ booking, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create payment intent on server
      const response = await api.post('/payments/create-payment-intent', {
        amount: booking.totalPrice,
        bookingId: booking.id,
        ticketTitle: booking.title,
        userEmail: booking.userEmail
      });

      const { clientSecret, error: serverError } = response.data;

      if (serverError) {
        throw new Error(serverError);
      }

      // Confirm card payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            email: booking.userEmail,
          },
        },
      });

      if (stripeError) {
        setError(stripeError.message);
        toast.error(stripeError.message);
      } else if (paymentIntent.status === 'succeeded') {
        setSucceeded(true);
        toast.success('Payment successful!');
        
        // Confirm payment on server
        await api.post('/payments/confirm-payment', {
          paymentIntentId: paymentIntent.id,
          bookingId: booking.id
        });

        setTimeout(() => {
          onSuccess(paymentIntent);
        }, 1500);
      }
    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message);
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (succeeded) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
          <FaCheckCircle className="text-4xl text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Payment Successful!</h3>
        <p className="text-gray-600 dark:text-gray-400">Your ticket has been confirmed.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Booking Summary */}
      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-3">
        <h4 className="font-semibold text-gray-800 dark:text-white">{booking.title}</h4>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Route</span>
          <span className="text-gray-800 dark:text-white">{booking.from} → {booking.to}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600 dark:text-gray-400">Tickets</span>
          <span className="text-gray-800 dark:text-white">{booking.quantity} × ৳{booking.unitPrice}</span>
        </div>
        <div className="flex justify-between text-lg font-bold border-t border-gray-200 dark:border-gray-600 pt-3">
          <span className="text-gray-800 dark:text-white">Total</span>
          <span className="text-blue-600">৳{booking.totalPrice}</span>
        </div>
      </div>

      {/* Card Input */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          <FaCreditCard className="inline mr-2" />
          Card Details
        </label>
        <div className="p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 focus-within:border-blue-500 transition-colors">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* Test Card Info */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
        <p className="text-xs text-blue-700 dark:text-blue-400 font-medium mb-1">🧪 Test Card Details:</p>
        <p className="text-xs text-blue-600 dark:text-blue-300">
          Card: 4242 4242 4242 4242 | Exp: Any future date | CVC: Any 3 digits
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="flex-1 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-xl font-medium hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || loading}
          className="flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
        >
          {loading ? (
            <>
              <span className="animate-spin">⏳</span>
              Processing...
            </>
          ) : (
            <>
              <FaLock />
              Pay ৳{booking.totalPrice}
            </>
          )}
        </button>
      </div>

      {/* Security Note */}
      <p className="text-center text-xs text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
        <FaLock className="text-green-600" />
        Secured by Stripe. Your payment info is encrypted.
      </p>
    </form>
  );
};

// Payment Modal Component
const PaymentModal = ({ isOpen, onClose, booking, onPaymentSuccess }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-slide-in-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <FaCreditCard className="text-blue-600" />
            Complete Payment
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <FaTimes className="text-gray-500" />
          </button>
        </div>

        {/* Stripe Elements Provider */}
        <Elements stripe={stripePromise}>
          <CheckoutForm 
            booking={booking} 
            onSuccess={onPaymentSuccess}
            onCancel={onClose}
          />
        </Elements>
      </div>
    </div>
  );
};

export default PaymentModal;
