import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import { 
  FaTicketAlt, FaMapMarkerAlt, FaClock, FaCalendarAlt, 
  FaCreditCard, FaCheckCircle, FaTimesCircle, FaHourglass,
  FaBus, FaTrain, FaShip, FaPlane
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import PaymentModal from '../../components/PaymentModal';

const MyBookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [countdowns, setCountdowns] = useState({});
  const [paymentModal, setPaymentModal] = useState({ isOpen: false, booking: null });

  // Sample booking data (would come from API)
  useEffect(() => {
    // Simulating API call
    const sampleBookings = [
      {
        id: 1,
        ticketId: 'TKT001',
        title: 'Premium AC Coach',
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
        from: 'Dhaka',
        to: 'Chittagong',
        transportType: 'Bus',
        departureDate: 'Dec 25, 2025',
        departureTime: '10:00 AM',
        quantity: 2,
        unitPrice: 800,
        totalPrice: 1600,
        status: 'pending',
        bookedAt: '2025-12-18T10:30:00Z'
      },
      {
        id: 2,
        ticketId: 'TKT002',
        title: 'Express Train Service',
        image: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&q=80',
        from: 'Dhaka',
        to: 'Sylhet',
        transportType: 'Train',
        departureDate: 'Dec 28, 2025',
        departureTime: '08:00 AM',
        quantity: 1,
        unitPrice: 600,
        totalPrice: 600,
        status: 'accepted',
        bookedAt: '2025-12-17T14:20:00Z'
      },
      {
        id: 3,
        ticketId: 'TKT003',
        title: 'Domestic Flight Economy',
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
        from: 'Dhaka',
        to: "Cox's Bazar",
        transportType: 'Plane',
        departureDate: 'Dec 30, 2025',
        departureTime: '02:00 PM',
        quantity: 3,
        unitPrice: 3500,
        totalPrice: 10500,
        status: 'paid',
        bookedAt: '2025-12-15T09:00:00Z'
      },
      {
        id: 4,
        ticketId: 'TKT004',
        title: 'Deluxe Cabin Launch',
        image: 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=800&q=80',
        from: 'Dhaka',
        to: 'Barisal',
        transportType: 'Launch',
        departureDate: 'Dec 22, 2025',
        departureTime: '11:00 PM',
        quantity: 2,
        unitPrice: 500,
        totalPrice: 1000,
        status: 'rejected',
        bookedAt: '2025-12-10T16:45:00Z'
      },
      {
        id: 5,
        ticketId: 'TKT005',
        title: 'Night Coach Return',
        image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&q=80',
        from: 'Chittagong',
        to: 'Dhaka',
        transportType: 'Bus',
        departureDate: 'Jan 02, 2026',
        departureTime: '09:00 PM',
        quantity: 1,
        unitPrice: 850,
        totalPrice: 850,
        status: 'accepted',
        bookedAt: '2025-12-16T11:30:00Z'
      },
      {
        id: 6,
        ticketId: 'TKT006',
        title: 'Intercity Express',
        image: 'https://images.unsplash.com/photo-1517093602198-530d8e1e859a?w=800&q=80',
        from: 'Dhaka',
        to: 'Rajshahi',
        transportType: 'Train',
        departureDate: 'Jan 05, 2026',
        departureTime: '07:00 AM',
        quantity: 4,
        unitPrice: 550,
        totalPrice: 2200,
        status: 'pending',
        bookedAt: '2025-12-18T08:00:00Z'
      }
    ];

    setTimeout(() => {
      setBookings(sampleBookings);
      setLoading(false);
    }, 500);
  }, []);

  // Calculate countdown for each booking
  useEffect(() => {
    const calculateCountdown = () => {
      const newCountdowns = {};
      
      bookings.forEach(booking => {
        if (booking.status !== 'rejected') {
          const targetDate = new Date(`${booking.departureDate} ${booking.departureTime}`).getTime();
          const now = new Date().getTime();
          const difference = targetDate - now;

          if (difference > 0) {
            newCountdowns[booking.id] = {
              days: Math.floor(difference / (1000 * 60 * 60 * 24)),
              hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
              minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
              seconds: Math.floor((difference % (1000 * 60)) / 1000),
              passed: false
            };
          } else {
            newCountdowns[booking.id] = { passed: true };
          }
        }
      });

      setCountdowns(newCountdowns);
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [bookings]);

  const getTypeIcon = (type) => {
    const icons = {
      Bus: <FaBus />,
      Train: <FaTrain />,
      Launch: <FaShip />,
      Plane: <FaPlane />
    };
    return icons[type] || <FaBus />;
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: { 
        bg: 'bg-yellow-100 dark:bg-yellow-900/30', 
        text: 'text-yellow-700 dark:text-yellow-400',
        icon: <FaHourglass />,
        label: 'Pending'
      },
      accepted: { 
        bg: 'bg-green-100 dark:bg-green-900/30', 
        text: 'text-green-700 dark:text-green-400',
        icon: <FaCheckCircle />,
        label: 'Accepted'
      },
      rejected: { 
        bg: 'bg-red-100 dark:bg-red-900/30', 
        text: 'text-red-700 dark:text-red-400',
        icon: <FaTimesCircle />,
        label: 'Rejected'
      },
      paid: { 
        bg: 'bg-blue-100 dark:bg-blue-900/30', 
        text: 'text-blue-700 dark:text-blue-400',
        icon: <FaCreditCard />,
        label: 'Paid'
      }
    };
    return configs[status] || configs.pending;
  };

  const handlePayNow = (booking) => {
    const countdown = countdowns[booking.id];
    
    if (countdown?.passed) {
      toast.error('Cannot pay: Departure date has already passed');
      return;
    }

    // Open Stripe payment modal
    setPaymentModal({
      isOpen: true,
      booking: {
        ...booking,
        userEmail: user?.email
      }
    });
  };

  const handlePaymentSuccess = (paymentIntent) => {
    // Update booking status to paid
    setBookings(prev => prev.map(b => 
      b.id === paymentModal.booking.id ? { ...b, status: 'paid' } : b
    ));
    setPaymentModal({ isOpen: false, booking: null });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          My Booked Tickets
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          View and manage all your ticket bookings
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Bookings</p>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">{bookings.length}</p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-4 shadow-lg border border-yellow-200 dark:border-yellow-800">
          <p className="text-sm text-yellow-600 dark:text-yellow-400">Pending</p>
          <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
            {bookings.filter(b => b.status === 'pending').length}
          </p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 shadow-lg border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-600 dark:text-green-400">Accepted</p>
          <p className="text-2xl font-bold text-green-700 dark:text-green-400">
            {bookings.filter(b => b.status === 'accepted').length}
          </p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 shadow-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-600 dark:text-blue-400">Paid</p>
          <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
            {bookings.filter(b => b.status === 'paid').length}
          </p>
        </div>
      </div>

      {/* Bookings Grid */}
      {bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => {
            const statusConfig = getStatusConfig(booking.status);
            const countdown = countdowns[booking.id];
            const canPay = booking.status === 'accepted' && !countdown?.passed;

            return (
              <div 
                key={booking.id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {/* Image */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={booking.image}
                    alt={booking.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  
                  {/* Transport Type Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="flex items-center gap-2 px-3 py-1 bg-white/90 dark:bg-gray-800/90 rounded-full text-sm font-medium text-gray-800 dark:text-white">
                      {getTypeIcon(booking.transportType)}
                      {booking.transportType}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${statusConfig.bg} ${statusConfig.text}`}>
                      {statusConfig.icon}
                      {statusConfig.label}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Title */}
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                    {booking.title}
                  </h3>

                  {/* Route */}
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-3">
                    <FaMapMarkerAlt className="text-blue-600" />
                    <span>{booking.from} → {booking.to}</span>
                  </div>

                  {/* Date & Time */}
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt />
                      {booking.departureDate}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaClock />
                      {booking.departureTime}
                    </span>
                  </div>

                  {/* Quantity & Price */}
                  <div className="flex items-center justify-between py-3 border-t border-b border-gray-200 dark:border-gray-700 mb-3">
                    <div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Quantity</p>
                      <p className="font-semibold text-gray-800 dark:text-white">{booking.quantity} tickets</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400">Total Price</p>
                      <p className="text-xl font-bold text-blue-600">৳{booking.totalPrice}</p>
                    </div>
                  </div>

                  {/* Countdown (not shown for rejected) */}
                  {booking.status !== 'rejected' && countdown && (
                    <div className="mb-4">
                      {countdown.passed ? (
                        <div className="text-center py-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                            ⚠️ Departure has passed
                          </p>
                        </div>
                      ) : (
                        <div className="text-center">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Departure in:</p>
                          <div className="grid grid-cols-4 gap-2">
                            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg py-2">
                              <p className="text-lg font-bold text-blue-600">{countdown.days}</p>
                              <p className="text-xs text-gray-500">Days</p>
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg py-2">
                              <p className="text-lg font-bold text-blue-600">{countdown.hours}</p>
                              <p className="text-xs text-gray-500">Hrs</p>
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg py-2">
                              <p className="text-lg font-bold text-blue-600">{countdown.minutes}</p>
                              <p className="text-xs text-gray-500">Min</p>
                            </div>
                            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg py-2">
                              <p className="text-lg font-bold text-blue-600">{countdown.seconds}</p>
                              <p className="text-xs text-gray-500">Sec</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Pay Now Button (only for accepted status) */}
                  {booking.status === 'accepted' && (
                    <button
                      onClick={() => handlePayNow(booking)}
                      disabled={countdown?.passed}
                      className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                        canPay
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <FaCreditCard />
                      {countdown?.passed ? 'Payment Expired' : `Pay Now ৳${booking.totalPrice}`}
                    </button>
                  )}

                  {/* Status Messages */}
                  {booking.status === 'pending' && (
                    <div className="text-center py-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                      <p className="text-sm text-yellow-600 dark:text-yellow-400">
                        ⏳ Waiting for vendor approval
                      </p>
                    </div>
                  )}

                  {booking.status === 'paid' && (
                    <div className="text-center py-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <p className="text-sm text-green-600 dark:text-green-400">
                        ✅ Payment completed - Ticket confirmed
                      </p>
                    </div>
                  )}

                  {booking.status === 'rejected' && (
                    <div className="text-center py-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                      <p className="text-sm text-red-600 dark:text-red-400">
                        ❌ Booking was rejected by vendor
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl">
          <FaTicketAlt className="text-6xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No Bookings Yet</h3>
          <p className="text-gray-500 dark:text-gray-400">Start exploring and book your first ticket!</p>
        </div>
      )}

      {/* Stripe Payment Modal */}
      <PaymentModal
        isOpen={paymentModal.isOpen}
        onClose={() => setPaymentModal({ isOpen: false, booking: null })}
        booking={paymentModal.booking}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </div>
  );
};

export default MyBookings;
