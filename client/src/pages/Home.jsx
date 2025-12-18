import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import api from '../utils/api';

const Home = () => {
  const [featuredTickets, setFeaturedTickets] = useState([]);
  const [advertisedTickets, setAdvertisedTickets] = useState([]);
  const [latestTickets, setLatestTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        // Fetch advertised tickets for carousel
        const advertisedResponse = await api.get('/tickets/featured/advertised');
        const advertised = advertisedResponse.data.map(ticket => ({
          id: ticket._id,
          img: ticket.image || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
          title: ticket.title || `${ticket.from} to ${ticket.to}`,
          from: ticket.from,
          to: ticket.to,
          type: ticket.type,
          price: ticket.price,
          seats: ticket.availableSeats,
          departureDate: ticket.departureDate,
          perks: ticket.features || ['AC', 'WiFi']
        }));
        setAdvertisedTickets(advertised);

        // Fetch all tickets
        const response = await api.get('/tickets');
        const tickets = response.data.map(ticket => ({
          id: ticket._id,
          img: ticket.image || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
          title: ticket.title || `${ticket.from} to ${ticket.to}`,
          type: ticket.type,
          price: ticket.price,
          seats: ticket.availableSeats,
          perks: ticket.features || ['AC', 'WiFi']
        }));
        
        // Split tickets for featured and latest sections
        setFeaturedTickets(tickets.slice(0, 4));
        setLatestTickets(tickets.slice(0, 6));
      } catch (error) {
        console.error('Error fetching tickets:', error);
        // Use empty arrays if API fails
        setAdvertisedTickets([]);
        setFeaturedTickets([]);
        setLatestTickets([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // Auto-slide carousel
  useEffect(() => {
    if (advertisedTickets.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % advertisedTickets.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [advertisedTickets.length]);

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % advertisedTickets.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + advertisedTickets.length) % advertisedTickets.length);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Hero Section with Real Background Image */}
      <section className="relative text-white py-20 md:py-28 lg:py-32 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1920&q=80" 
            alt="Travel background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 via-blue-900/40 to-blue-900/70 dark:from-blue-950/70 dark:via-blue-950/50 dark:to-blue-950/80"></div>
        </div>
        
        <div className="container-responsive relative z-10">
          <div className="text-center animate-fade-in max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight text-balance">
              Your Journey Starts Here
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed text-white/90">
              Book bus, train, launch & flight tickets effortlessly. Experience seamless travel booking with TicketBari.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Link to="/all-tickets" className="btn btn-primary btn-lg">
                <span>🎫</span> Search Tickets
              </Link>
              <button className="btn btn-outline btn-lg !border-white !text-white hover:!bg-white hover:!text-blue-600">
                Learn More
              </button>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-12 md:mt-16">
              {[
                { value: '500+', label: 'Routes Available' },
                { value: '50K+', label: 'Happy Travelers' },
                { value: '24/7', label: 'Customer Support' },
                { value: '100%', label: 'Secure Booking' }
              ].map((stat, idx) => (
                <div key={idx} className="glass rounded-2xl p-4 md:p-6 hover-lift border border-white/20">
                  <div className="text-2xl md:text-4xl font-bold mb-1 md:mb-2 font-display">{stat.value}</div>
                  <div className="text-xs md:text-sm opacity-90">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Advertised Tickets Carousel */}
      {advertisedTickets.length > 0 && (
        <section className="py-12 md:py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 dark:from-blue-800 dark:via-purple-800 dark:to-blue-900 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="container-responsive relative z-10">
            <div className="text-center mb-8">
              <span className="inline-block px-4 py-2 bg-yellow-400 text-yellow-900 rounded-full text-sm font-bold mb-4">
                ⭐ Special Offers
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Featured Tickets</h2>
              <p className="text-white/80">Admin-selected deals you don&apos;t want to miss!</p>
            </div>

            {/* Carousel Container */}
            <div className="relative max-w-5xl mx-auto">
              {/* Carousel Slides */}
              <div className="overflow-hidden rounded-2xl">
                <div 
                  className="flex transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {advertisedTickets.map((ticket) => (
                    <div key={ticket.id} className="w-full flex-shrink-0 px-2">
                      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
                        {/* Image */}
                        <div className="md:w-1/2 h-64 md:h-80 relative">
                          <img 
                            src={ticket.img} 
                            alt={ticket.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
                          <span className="absolute top-4 left-4 px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-sm font-bold">
                            {ticket.type}
                          </span>
                        </div>
                        
                        {/* Content */}
                        <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-center">
                          <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-3">
                            {ticket.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">
                            {ticket.from} → {ticket.to}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                            {ticket.perks.slice(0, 3).map((perk, idx) => (
                              <span key={idx} className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                                {perk}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between mt-auto">
                            <div>
                              <span className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">৳{ticket.price}</span>
                              <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">/person</span>
                            </div>
                            <Link 
                              to={`/ticket/${ticket.id}`}
                              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
                            >
                              Book Now
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Arrows */}
              {advertisedTickets.length > 1 && (
                <>
                  <button 
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
                  >
                    <FaChevronLeft />
                  </button>
                  <button 
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10"
                  >
                    <FaChevronRight />
                  </button>
                </>
              )}

              {/* Dots Indicator */}
              {advertisedTickets.length > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  {advertisedTickets.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`w-3 h-3 rounded-full transition-all ${
                        idx === currentSlide 
                          ? 'bg-white w-8' 
                          : 'bg-white/50 hover:bg-white/70'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Advertisement Section - Featured Tickets */}
      <section className="section-spacing bg-white dark:bg-gray-800 transition-colors relative overflow-hidden">
        <div className="absolute inset-0 pattern-dots opacity-50"></div>
        <div className="container-responsive relative z-10">
          <div className="text-center mb-12">
            <span className="badge badge-primary text-base md:text-lg px-6 py-2 mb-4 inline-block">Featured</span>
            <h2 className="section-heading font-display">Specially Selected for You</h2>
            <p className="section-subheading">Handpicked by our team - Best deals on popular routes</p>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : featuredTickets.length > 0 ? (
            <div className="grid-equal-3">
              {featuredTickets.map((item) => (
                <div key={item.id} className="card card-equal group">
                  <div className="relative h-48 overflow-hidden">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <span className="absolute top-4 right-4 badge badge-warning shadow-lg">Featured</span>
                    <span className="absolute bottom-4 left-4 badge badge-primary shadow-lg">{item.type}</span>
                  </div>
                  <div className="card-body">
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100 mb-3">{item.title}</h3>
                    
                    <div className="space-y-2 mb-4 text-sm flex-1">
                      <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                        <span className="flex items-center gap-2">💺 Seats Available</span>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">{item.seats}</span>
                      </div>
                      <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                        <span className="flex items-center gap-2">🚌 Transport</span>
                        <span className="font-semibold">{item.type}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {item.perks.map((perk, perkIdx) => (
                          <span key={perkIdx} className="badge badge-success text-xs">{perk}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
                      <div>
                        <span className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">৳{item.price}</span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">/person</span>
                      </div>
                      <Link to={`/ticket/${item.id}`} className="btn btn-primary btn-sm">
                        See Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No featured tickets available. <Link to="/all-tickets" className="text-blue-600 hover:underline">Browse all tickets</Link></p>
            </div>
          )}
        </div>
      </section>

      {/* Latest Tickets Section */}
      <section className="section-spacing bg-gray-50 dark:bg-gray-900 transition-colors relative overflow-hidden">
        <div className="absolute inset-0 pattern-grid"></div>
        <div className="container-responsive relative z-10">
          <div className="text-center mb-12">
            <span className="badge badge-success text-base md:text-lg px-6 py-2 mb-4 inline-block">New</span>
            <h2 className="section-heading font-display">🆕 Recently Added Tickets</h2>
            <p className="section-subheading">Fresh routes and updated schedules</p>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
          ) : latestTickets.length > 0 ? (
            <div className="grid-equal-3">
              {latestTickets.map((item) => (
                <div key={item.id} className="card card-equal group">
                  <div className="relative h-48 overflow-hidden">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <span className="absolute top-4 right-4 badge badge-success shadow-md">New</span>
                    <span className="absolute bottom-4 left-4 badge badge-primary shadow-lg">{item.type}</span>
                  </div>
                  <div className="card-body">
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-3">
                      {item.title}
                    </h3>
                    
                    <div className="space-y-2 mb-4 text-sm bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl flex-1">
                      <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                        <span className="flex items-center gap-2">💺 Seats</span>
                        <span className="font-semibold text-blue-600 dark:text-blue-400">{item.seats} available</span>
                      </div>
                      <div className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                        <span className="flex items-center gap-2">🚌 Transport</span>
                        <span className="font-medium">{item.type}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-3">
                        {item.perks.map((perk, perkIdx) => (
                          <span key={perkIdx} className="badge badge-success text-xs">{perk}</span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
                      <div>
                        <span className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">৳{item.price}</span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">/person</span>
                      </div>
                      <Link to={`/ticket/${item.id}`} className="btn btn-primary btn-sm">
                        See Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No tickets available yet. <Link to="/all-tickets" className="text-blue-600 hover:underline">Browse all tickets</Link></p>
            </div>
          )}
        </div>
      </section>

      {/* Specially Selected for You Section */}
      <section className="section-spacing relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/photo-1756999033778-92bf4047cc3e.avif" 
            alt="Travel background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"></div>
        </div>
        
        <div className="container-responsive relative z-10">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-amber-500/20 text-amber-400 rounded-full text-sm font-semibold mb-4 backdrop-blur-sm border border-amber-500/30">
              ⭐ Personalized Picks
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 font-display text-balance">
              Specially Selected for You
            </h2>
            <p className="text-gray-300 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Curated travel experiences based on popular destinations and seasonal offers
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {(featuredTickets.length > 0 ? featuredTickets.slice(0, 4).map((ticket, index) => {
              const discounts = ['20% OFF', '15% OFF', 'Popular', 'Trending'];
              const reasons = ['Best Value', 'Top Rated', 'Most Booked', 'New Route'];
              const icons = { Bus: '🚌', Train: '🚂', Launch: '⛴️', Plane: '✈️' };
              return {
                id: ticket.id,
                from: ticket.title.split(' to ')[0] || 'Dhaka',
                to: ticket.title.split(' to ')[1] || ticket.title,
                type: ticket.type,
                price: ticket.price,
                discount: discounts[index % 4],
                reason: reasons[index % 4],
                icon: icons[ticket.type] || '🚌'
              };
            }) : [
              { id: 'demo1', from: 'Dhaka', to: "Cox's Bazar", type: 'Plane', price: 4200, discount: '20% OFF', reason: 'Beach Season', icon: '✈️' },
              { id: 'demo2', from: 'Dhaka', to: 'Sylhet', type: 'Train', price: 950, discount: '15% OFF', reason: 'Tea Garden Tour', icon: '🚂' },
              { id: 'demo3', from: 'Dhaka', to: 'Sundarbans', type: 'Launch', price: 2500, discount: 'Popular', reason: 'Wildlife Adventure', icon: '⛴️' },
              { id: 'demo4', from: 'Dhaka', to: 'Rangamati', type: 'Bus', price: 1100, discount: 'Trending', reason: 'Hill Track Explorer', icon: '🚌' }
            ]).map((item) => (
              <div key={item.id} className="group relative">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 md:p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:transform hover:-translate-y-2 hover:shadow-2xl h-full flex flex-col">
                  {/* Discount Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      item.discount.includes('OFF') 
                        ? 'bg-green-500 text-white' 
                        : 'bg-amber-500 text-white'
                    }`}>
                      {item.discount}
                    </span>
                    <span className="text-2xl md:text-3xl">{item.icon}</span>
                  </div>
                  
                  {/* Route */}
                  <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                    {item.from} → {item.to}
                  </h3>
                  <p className="text-amber-400 text-sm mb-4">{item.reason}</p>
                  
                  {/* Type Badge */}
                  <span className="inline-block px-3 py-1 bg-white/10 rounded-lg text-white/80 text-sm mb-4 w-fit">
                    {item.type} Service
                  </span>
                  
                  {/* Price & CTA */}
                  <div className="mt-auto pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-xl md:text-2xl font-bold text-white">৳{item.price}</span>
                        <span className="text-gray-400 text-sm ml-1">/person</span>
                      </div>
                      <Link 
                        to={item.id.toString().startsWith('demo') ? '/all-tickets' : `/ticket/${item.id}`} 
                        className="px-3 md:px-4 py-2 bg-white text-gray-900 rounded-xl font-semibold text-sm hover:bg-gray-100 transition-colors"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* View All Button */}
          <div className="text-center mt-10 md:mt-12">
            <Link 
              to="/all-tickets" 
              className="inline-flex items-center gap-2 px-6 md:px-8 py-3 md:py-4 bg-white/10 backdrop-blur-sm border border-white/30 text-white rounded-full font-semibold hover:bg-white/20 transition-all duration-300"
            >
              <span>View All Recommendations</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section-spacing bg-white dark:bg-gray-900 transition-colors relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 opacity-100 dark:opacity-35">
          <img 
            src="/6345959.jpg" 
            alt="" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 pattern-diagonal"></div>
        <div className="container-responsive relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="section-heading font-display">💬 What Travelers Say</h2>
            <p className="section-subheading">Real experiences from our happy customers</p>
          </div>
          
          <div className="grid-equal-3">
            {[
              { name: 'Rahim Ahmed', role: 'Frequent Traveler', text: 'The best booking experience I have ever had. Very smooth and reliable service.', img: 'https://randomuser.me/api/portraits/men/32.jpg' },
              { name: 'Fatima Begum', role: 'Tourist', text: 'Customer support was excellent. They helped me reschedule my ticket instantly.', img: 'https://randomuser.me/api/portraits/women/44.jpg' },
              { name: 'Karim Ullah', role: 'Business Man', text: 'I use TicketBari for all my business trips. Highly recommended for professionals.', img: 'https://randomuser.me/api/portraits/men/86.jpg' }
            ].map((review, idx) => (
              <div key={idx} className="bg-gray-50 dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-lg relative h-full flex flex-col">
                <div className="absolute -top-4 left-6 md:left-8">
                  <span className="text-5xl md:text-6xl text-blue-200 dark:text-blue-900 opacity-50">"</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 relative z-10 italic leading-relaxed flex-1">{review.text}</p>
                <div className="flex items-center gap-4 mt-auto">
                  <img src={review.img} alt={review.name} className="w-12 h-12 rounded-full object-cover border-2 border-blue-500" />
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{review.name}</h4>
                    <p className="text-sm text-blue-600 dark:text-blue-400">{review.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section-spacing bg-blue-600 dark:bg-blue-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-circuit opacity-20"></div>
        <div className="container-responsive max-w-4xl text-center relative z-10">
          <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-shadow">Subscribe to Our Newsletter</h2>
          <p className="text-blue-100 mb-6 md:mb-8 text-base md:text-lg">Get exclusive deals, travel tips, and updates directly to your inbox.</p>
          <form className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="px-4 md:px-6 py-3 md:py-4 rounded-xl text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-2 border-white/30 w-full focus:outline-none focus:ring-4 focus:ring-blue-400"
            />
            <button className="btn bg-gray-900 hover:bg-gray-800 text-white px-6 md:px-8 py-3 md:py-4 whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      {/* Why Choose TicketBari Section */}
      <section className="section-spacing bg-gray-50 dark:bg-gray-900 transition-colors relative overflow-hidden">
        <div className="absolute inset-0 pattern-wave"></div>
        <div className="container-responsive relative z-10">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="section-heading">🌟 Why Choose TicketBari?</h2>
            <p className="section-subheading">Your trusted travel partner for all journeys</p>
          </div>
          
          <div className="grid-equal-4">
            {[
              { icon: '🚌', title: 'Bus Tickets', desc: 'Wide network covering all major routes' },
              { icon: '🚂', title: 'Train Tickets', desc: 'Reserve your train seats instantly' },
              { icon: '⛴️', title: 'Launch Tickets', desc: 'Comfortable water travel options' },
              { icon: '✈️', title: 'Flight Tickets', desc: 'Domestic & international flights' }
            ].map((feature, idx) => (
              <div key={idx} className="card card-equal text-center p-6 md:p-8 flex flex-col items-center h-full">
                <div className="text-5xl md:text-6xl mb-4 md:mb-6">{feature.icon}</div>
                <h3 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white mb-2 md:mb-3">{feature.title}</h3>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Routes Section */}
      <section className="section-spacing bg-white dark:bg-gray-900 transition-colors">
        <div className="container-responsive">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="section-heading">🔥 Popular Routes</h2>
            <p className="section-subheading">Most traveled destinations by our customers</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              { from: 'Dhaka', to: 'Chittagong', price: '৳800', travelers: '2.5k' },
              { from: 'Dhaka', to: 'Sylhet', price: '৳1200', travelers: '1.8k' },
              { from: 'Dhaka', to: 'Cox\'s Bazar', price: '৳1500', travelers: '3.2k' },
              { from: 'Chittagong', to: 'Cox\'s Bazar', price: '৳600', travelers: '1.5k' },
              { from: 'Dhaka', to: 'Rajshahi', price: '৳900', travelers: '1.2k' },
              { from: 'Dhaka', to: 'Khulna', price: '৳1000', travelers: '1.4k' }
            ].map((route, idx) => (
              <div key={idx} className="card p-5 md:p-6 hover:border-2 hover:border-blue-500 dark:hover:border-blue-400">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                    <span className="text-lg md:text-2xl font-bold text-gray-800 dark:text-gray-100">{route.from}</span>
                    <span className="text-blue-600 dark:text-blue-400">→</span>
                    <span className="text-lg md:text-2xl font-bold text-gray-800 dark:text-gray-100">{route.to}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Starting from</p>
                    <p className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">{route.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">Monthly travelers</p>
                    <p className="text-base md:text-lg font-bold text-gray-800 dark:text-gray-100">{route.travelers}+</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing py-20 md:py-24 bg-blue-600 dark:bg-blue-700 text-white relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/6346166.jpg" 
            alt="" 
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="absolute inset-0 bg-blue-400/20 dark:bg-blue-800/30"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-purple-300 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container-responsive text-center relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">Ready to Start Your Journey?</h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 md:mb-10 max-w-3xl mx-auto opacity-95">
            Join 50,000+ happy travelers who trust TicketBari for hassle-free bookings
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <button className="btn bg-white text-blue-600 hover:bg-gray-100 text-base md:text-lg shadow-2xl">
              <span className="mr-2">🚀</span> Get Started Now
            </button>
            <button className="btn border-2 border-white text-white hover:bg-white hover:text-blue-600 text-base md:text-lg">
              <span className="mr-2">📞</span> Contact Support
            </button>
          </div>
          
          {/* Trust Indicators */}
          <div className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="text-center">
              <div className="text-3xl md:text-4xl mb-2">⭐</div>
              <div className="text-xl md:text-2xl font-bold">4.9/5</div>
              <div className="text-xs md:text-sm opacity-90">Customer Rating</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl mb-2">🔒</div>
              <div className="text-xl md:text-2xl font-bold">100%</div>
              <div className="text-xs md:text-sm opacity-90">Secure Payment</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl mb-2">💳</div>
              <div className="text-xl md:text-2xl font-bold">Instant</div>
              <div className="text-xs md:text-sm opacity-90">Confirmation</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl mb-2">🎫</div>
              <div className="text-xl md:text-2xl font-bold">50K+</div>
              <div className="text-xs md:text-sm opacity-90">Bookings/Month</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
