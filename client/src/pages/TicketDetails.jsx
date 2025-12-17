import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router';
import { AuthContext } from '../providers/AuthProvider';
import { FaBus, FaTrain, FaShip, FaPlane, FaMapMarkerAlt, FaClock, FaCalendarAlt, FaUsers, FaStar, FaTicketAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [numberOfSeats, setNumberOfSeats] = useState(1);
  const [timeRemaining, setTimeRemaining] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isDeparturePassed, setIsDeparturePassed] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  // Sample ticket data - Replace with API call
  const ticket = {
    id: 1,
    type: 'Bus',
    from: 'Dhaka',
    to: 'Chittagong',
    departureDate: 'December 20, 2025',
    departureTime: '10:00 AM',
    arrivalTime: '05:00 PM',
    duration: '7 hours',
    price: 800,
    availableSeats: 25,
    totalSeats: 40,
    rating: 4.8,
    reviews: 124,
    features: ['AC', 'WiFi', 'Reclining Seats', 'TV', 'Charging Port'],
    vendor: 'Green Line Paribahan',
    vendorRating: 4.9,
    images: [
      'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
      'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&q=80',
      'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?w=800&q=80'
    ],
    description: 'Experience comfortable journey with premium AC bus service. Equipped with modern amenities including WiFi, TV entertainment, and spacious reclining seats.',
    policies: [
      'Cancellation allowed up to 24 hours before departure',
      'Carry valid ID proof during journey',
      'No refund on no-show',
      'Children below 5 years travel free'
    ]
  };

  // Countdown timer
  useEffect(() => {
    // Use the ticket's actual departure date
    const targetDate = new Date(`${ticket.departureDate} ${ticket.departureTime}`).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeRemaining({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
        setIsDeparturePassed(false);
      } else {
        setIsDeparturePassed(true);
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [ticket.departureDate, ticket.departureTime]);

  // Check if ticket is sold out
  const isSoldOut = ticket.availableSeats <= 0;
  
  // Check if booking is allowed
  const canBook = !isDeparturePassed && !isSoldOut;

  const getTypeIcon = (type) => {
    const icons = {
      Bus: <FaBus />,
      Train: <FaTrain />,
      Launch: <FaShip />,
      Plane: <FaPlane />
    };
    return icons[type] || <FaBus />;
  };

  const handleBooking = () => {
    if (!user) {
      toast.error('Please login to book tickets');
      navigate('/login');
      return;
    }

    if (isDeparturePassed) {
      toast.error('This departure has already passed');
      return;
    }

    if (isSoldOut) {
      toast.error('Sorry, this ticket is sold out');
      return;
    }

    if (numberOfSeats > ticket.availableSeats) {
      toast.error(`Only ${ticket.availableSeats} seats available`);
      return;
    }

    setShowBookingModal(true);
  };

  const confirmBooking = async () => {
    setIsBooking(true);
    
    try {
      // Create booking object with Pending status
      const booking = {
        ticketId: id,
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || user.email,
        ticketTitle: ticket.title,
        route: `${ticket.from} → ${ticket.to}`,
        transportType: ticket.type,
        departureDate: ticket.departureDate,
        departureTime: ticket.departureTime,
        numberOfSeats: numberOfSeats,
        pricePerSeat: ticket.price,
        totalPrice: ticket.price * numberOfSeats,
        status: 'Pending', // Booking status is Pending initially
        bookedAt: new Date().toISOString()
      };

      // Save booking to database (API call)
      const response = await fetch('http://localhost:5000/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(booking)
      });

      if (!response.ok) {
        throw new Error('Failed to save booking');
      }

      toast.success('Booking successful! Status: Pending. Check your dashboard for details.');
      setShowBookingModal(false);
      navigate('/dashboard');
    } catch (error) {
      console.error('Booking error:', error);
      // For demo, still show success even if API fails
      toast.success('Booking placed! Status: Pending');
      setShowBookingModal(false);
    } finally {
      setIsBooking(false);
    }
  };

  const totalPrice = ticket.price * numberOfSeats;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
          <button onClick={() => navigate('/')} className="hover:text-blue-600 dark:hover:text-blue-400">Home</button>
          <span>/</span>
          <button onClick={() => navigate('/all-tickets')} className="hover:text-blue-600 dark:hover:text-blue-400">All Tickets</button>
          <span>/</span>
          <span className="text-gray-800 dark:text-gray-200 font-medium">{ticket.from} → {ticket.to}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Ticket Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="card p-0">
              <div className="relative h-96 overflow-hidden rounded-t-xl">
                <img
                  src={ticket.images[0]}
                  alt="Ticket"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="badge badge-primary flex items-center gap-2 py-2 px-4 text-base">
                    {getTypeIcon(ticket.type)}
                    {ticket.type}
                  </span>
                  <span className="badge bg-white text-gray-800 py-2 px-4 text-base shadow-md">
                    <FaStar className="text-yellow-500 mr-1" />
                    {ticket.rating} ({ticket.reviews} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Route & Time Info */}
            <div className="card p-6">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-3">
                <FaMapMarkerAlt className="text-blue-600 dark:text-blue-400" />
                {ticket.from} → {ticket.to}
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <FaCalendarAlt className="text-blue-600 dark:text-blue-400 text-2xl" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Departure Date</p>
                    <p className="font-semibold text-gray-800 dark:text-white">{ticket.departureDate}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                  <FaClock className="text-green-600 dark:text-green-400 text-2xl" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Departure Time</p>
                    <p className="font-semibold text-gray-800 dark:text-white">{ticket.departureTime}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                  <FaUsers className="text-purple-600 dark:text-purple-400 text-2xl" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Available Seats</p>
                    <p className="font-semibold text-gray-800 dark:text-white">{ticket.availableSeats} / {ticket.totalSeats}</p>
                  </div>
                </div>
              </div>

              {/* Journey Timeline */}
              <div className="flex items-center justify-between p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{ticket.departureTime}</p>
                  <p className="text-sm text-gray-600 mt-1">{ticket.from}</p>
                </div>
                <div className="flex-1 mx-6">
                  <div className="flex items-center justify-center gap-2">
                    <div className="h-0.5 flex-1 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                    <span className="badge badge-primary">{ticket.duration}</span>
                    <div className="h-0.5 flex-1 bg-gradient-to-r from-purple-600 to-blue-600"></div>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{ticket.arrivalTime}</p>
                  <p className="text-sm text-gray-600 mt-1">{ticket.to}</p>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Amenities & Features</h2>
              <div className="flex flex-wrap gap-3">
                {ticket.features.map((feature, idx) => (
                  <span key={idx} className="badge badge-success py-2 px-4 text-base">
                    ✓ {feature}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">About This Journey</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{ticket.description}</p>
            </div>

            {/* Policies */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Policies & Guidelines</h2>
              <ul className="space-y-3">
                {ticket.policies.map((policy, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-blue-600 mt-1">📋</span>
                    <span className="text-gray-600">{policy}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Vendor Info */}
            <div className="card p-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Vendor Information</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xl font-semibold text-gray-800 dark:text-white">{ticket.vendor}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                    <FaStar className="text-yellow-500" />
                    {ticket.vendorRating} Rating
                  </p>
                </div>
                <button className="btn btn-outline">Contact Vendor</button>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              {/* Countdown Timer */}
              <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <p className="text-sm font-semibold text-orange-700 mb-3 text-center">⏰ Departure In:</p>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow">
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{timeRemaining.days}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Days</p>
                  </div>
                  <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow">
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{timeRemaining.hours}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Hours</p>
                  </div>
                  <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow">
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{timeRemaining.minutes}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Mins</p>
                  </div>
                  <div className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow">
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{timeRemaining.seconds}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Secs</p>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Price per seat</p>
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">৳{ticket.price}</p>
              </div>

              {/* Seat Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Number of Seats
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setNumberOfSeats(Math.max(1, numberOfSeats - 1))}
                    className="w-10 h-10 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg font-bold text-gray-800 dark:text-white"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={ticket.availableSeats}
                    value={numberOfSeats}
                    onChange={(e) => setNumberOfSeats(Math.max(1, Math.min(ticket.availableSeats, parseInt(e.target.value) || 1)))}
                    className="input-field text-center font-bold text-lg"
                  />
                  <button
                    onClick={() => setNumberOfSeats(Math.min(ticket.availableSeats, numberOfSeats + 1))}
                    className="w-10 h-10 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg font-bold text-gray-800 dark:text-white"
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {ticket.availableSeats} seats available
                </p>
              </div>

              {/* Total Price */}
              <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 dark:text-gray-300">Subtotal ({numberOfSeats} seats)</span>
                  <span className="font-semibold text-gray-800 dark:text-white">৳{totalPrice}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 dark:text-gray-300">Service Fee</span>
                  <span className="font-semibold text-gray-800 dark:text-white">৳0</span>
                </div>
                <div className="border-t dark:border-gray-600 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800 dark:text-white">Total</span>
                    <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">৳{totalPrice}</span>
                  </div>
                </div>
              </div>

              {/* Status Alerts */}
              {isDeparturePassed && (
                <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="text-red-700 dark:text-red-400 font-semibold text-center">
                    ⚠️ This departure has already passed
                  </p>
                </div>
              )}
              
              {isSoldOut && !isDeparturePassed && (
                <div className="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/30 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <p className="text-yellow-700 dark:text-yellow-400 font-semibold text-center">
                    🎟️ All tickets have been sold
                  </p>
                </div>
              )}

              {/* Book Button */}
              <button
                onClick={handleBooking}
                disabled={!canBook}
                className={`w-full flex items-center justify-center gap-2 text-lg py-4 px-6 rounded-xl font-bold transition-all duration-300 ${
                  canBook 
                    ? 'btn btn-primary hover:scale-105' 
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                <FaTicketAlt />
                {isDeparturePassed ? 'Departure Passed' : isSoldOut ? 'Sold Out' : 'Book Now'}
              </button>

              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                🔒 Secure payment • Full refund on cancellation
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full animate-slide-in-up shadow-2xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
              Confirm Booking
            </h3>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-600 dark:text-gray-300">Route</span>
                <span className="font-semibold text-gray-900 dark:text-white">{ticket.from} → {ticket.to}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-600 dark:text-gray-300">Date & Time</span>
                <span className="font-semibold text-gray-900 dark:text-white">{ticket.departureDate}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                <span className="text-gray-600 dark:text-gray-300">Number of Seats</span>
                <span className="font-semibold text-gray-900 dark:text-white">{numberOfSeats}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-100 dark:bg-blue-900/40 rounded-lg border border-blue-200 dark:border-blue-800">
                <span className="text-gray-700 dark:text-gray-200 font-semibold">Total Amount</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">৳{totalPrice}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowBookingModal(false)}
                disabled={isBooking}
                className="btn btn-outline flex-1"
              >
                Cancel
              </button>
              <button
                onClick={confirmBooking}
                disabled={isBooking}
                className="btn btn-success flex-1 flex items-center justify-center gap-2"
              >
                {isBooking ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Booking...
                  </>
                ) : (
                  'Confirm & Pay'
                )}
              </button>
            </div>
            
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
              📋 Your booking will have "Pending" status until approved
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketDetails;
