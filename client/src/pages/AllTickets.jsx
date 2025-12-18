import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { FaBus, FaTrain, FaShip, FaPlane, FaMapMarkerAlt, FaClock, FaUsers, FaSearch, FaFilter, FaSort, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AllTickets = () => {
  const [searchFrom, setSearchFrom] = useState('');
  const [searchTo, setSearchTo] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [allTickets, setAllTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 6;

  // Fetch tickets from API
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get('/tickets');
        const tickets = response.data.map(ticket => ({
          id: ticket._id,
          title: ticket.title,
          type: ticket.type,
          from: ticket.from,
          to: ticket.to,
          date: ticket.departureDate,
          time: ticket.departureTime,
          seats: ticket.availableSeats,
          price: ticket.price,
          features: ticket.features || ['AC'],
          image: ticket.image || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
          status: ticket.status
        }));
        setAllTickets(tickets);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        toast.error('Failed to load tickets');
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const getTypeIcon = (type) => {
    const icons = {
      Bus: <FaBus />,
      Train: <FaTrain />,
      Launch: <FaShip />,
      Plane: <FaPlane />
    };
    return icons[type] || <FaBus />;
  };

  const getTypeColor = (type) => {
    const colors = {
      Bus: 'bg-blue-100 text-blue-700',
      Train: 'bg-green-100 text-green-700',
      Launch: 'bg-cyan-100 text-cyan-700',
      Plane: 'bg-purple-100 text-purple-700'
    };
    return colors[type] || 'bg-blue-100 text-blue-700';
  };

  // Filter tickets based on search and filter
  const filteredTickets = allTickets.filter(ticket => {
    const matchesFrom = searchFrom === '' || ticket.from.toLowerCase().includes(searchFrom.toLowerCase());
    const matchesTo = searchTo === '' || ticket.to.toLowerCase().includes(searchTo.toLowerCase());
    const matchesType = filterType === 'All' || ticket.type === filterType;
    return matchesFrom && matchesTo && matchesType;
  });

  // Sort tickets
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    if (sortBy === 'lowToHigh') return a.price - b.price;
    if (sortBy === 'highToLow') return b.price - a.price;
    return 0; // default order
  });

  // Pagination
  const totalPages = Math.ceil(sortedTickets.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTickets = sortedTickets.slice(indexOfFirstItem, indexOfLastItem);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchFrom, searchTo, filterType, sortBy]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 section-spacing transition-colors relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating Circles */}
        <div className="absolute top-20 left-10 w-48 md:w-72 h-48 md:h-72 bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-64 md:w-96 h-64 md:h-96 bg-purple-400/10 dark:bg-purple-500/5 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-56 md:w-80 h-56 md:h-80 bg-cyan-400/10 dark:bg-cyan-500/5 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-40 right-1/4 w-48 md:w-64 h-48 md:h-64 bg-green-400/10 dark:bg-green-500/5 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
        
        {/* Pattern Overlay */}
        <div className="absolute inset-0 pattern-dots opacity-30 dark:opacity-20"></div>
        
        {/* Moving Gradient Lines */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500/20 to-transparent animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
      
      <div className="container-responsive relative z-10">
        {/* Header */}
        <div className="text-center mb-10 md:mb-12 animate-fade-in">
          <h1 className="section-heading">🎫 All Available Tickets</h1>
          <p className="section-subheading">Browse and book from {allTickets.length} approved routes</p>
        </div>

        {/* Search & Filter Section */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-md p-4 md:p-6 mb-6 md:mb-8 border border-gray-200/50 dark:border-gray-700/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4">
            {/* Search From */}
            <div>
              <label className="input-label flex items-center gap-2">
                <FaSearch className="text-blue-600 dark:text-blue-400" />
                From Location
              </label>
              <input
                type="text"
                placeholder="e.g. Dhaka"
                value={searchFrom}
                onChange={(e) => setSearchFrom(e.target.value)}
                className="input-field"
              />
            </div>

            {/* Search To */}
            <div>
              <label className="input-label flex items-center gap-2">
                <FaSearch className="text-blue-600 dark:text-blue-400" />
                To Location
              </label>
              <input
                type="text"
                placeholder="e.g. Chittagong"
                value={searchTo}
                onChange={(e) => setSearchTo(e.target.value)}
                className="input-field"
              />
            </div>

            {/* Filter by Transport Type */}
            <div>
              <label className="input-label flex items-center gap-2">
                <FaFilter className="text-blue-600 dark:text-blue-400" />
                Transport Type
              </label>
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="input-field"
              >
                <option value="All">All Types</option>
                <option value="Bus">Bus</option>
                <option value="Train">Train</option>
                <option value="Launch">Launch</option>
                <option value="Plane">Plane</option>
              </select>
            </div>

            {/* Sort by Price */}
            <div>
              <label className="input-label flex items-center gap-2">
                <FaSort className="text-blue-600 dark:text-blue-400" />
                Sort by Price
              </label>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field"
              >
                <option value="default">Default</option>
                <option value="lowToHigh">Low to High</option>
                <option value="highToLow">High to Low</option>
              </select>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing <span className="font-semibold text-blue-600 dark:text-blue-400">{currentTickets.length}</span> of <span className="font-semibold text-gray-800 dark:text-white">{sortedTickets.length}</span> tickets
            </p>
            {(searchFrom || searchTo || filterType !== 'All' || sortBy !== 'default') && (
              <button
                onClick={() => {
                  setSearchFrom('');
                  setSearchTo('');
                  setFilterType('All');
                  setSortBy('default');
                }}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>

        {/* Tickets Grid */}
        {currentTickets.length > 0 ? (
          <>
            <div className="grid-equal-3 mb-10 md:mb-12">
              {currentTickets.map((ticket, index) => (
                <div 
                  key={ticket.id} 
                  className="card card-equal group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm animate-fade-in"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  {/* Real Image */}
                  <div className="img-container-card overflow-hidden relative">
                    <img 
                      src={ticket.image} 
                      alt={`${ticket.type} from ${ticket.from} to ${ticket.to}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-3 left-3">
                      <span className={`badge ${getTypeColor(ticket.type)} flex items-center gap-2 shadow-lg`}>
                        {getTypeIcon(ticket.type)}
                        {ticket.type}
                      </span>
                    </div>
                  </div>

                  <div className="card-body">
                    {/* Ticket Title */}
                    <h3 className="text-base md:text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
                      {ticket.title}
                    </h3>
                    
                    {/* Route */}
                    <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                      <FaMapMarkerAlt className="text-blue-600 dark:text-blue-400 text-sm flex-shrink-0" />
                      <span className="truncate">{ticket.from} → {ticket.to}</span>
                    </p>

                    {/* Date & Time */}
                    <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-3 md:mb-4">
                      <span className="flex items-center gap-1">
                        <FaClock className="text-gray-500" />
                        {ticket.time}
                      </span>
                      <span>{ticket.date}</span>
                    </div>

                    {/* Seats & Price */}
                    <div className="flex items-center justify-between mb-3 md:mb-4 pb-3 md:pb-4 border-b border-gray-200 dark:border-gray-700">
                      <span className="flex items-center gap-2 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                        <FaUsers className="text-gray-500 dark:text-gray-400" />
                        {ticket.seats} seats
                      </span>
                      <span className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">৳{ticket.price}</span>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-1 md:gap-2 mb-3 md:mb-4">
                      {ticket.features.map((feature, idx) => (
                        <span key={idx} className="badge badge-success text-xs">
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* Book Button */}
                    <Link 
                      to={`/ticket/${ticket.id}`}
                      className="btn btn-primary btn-sm w-full mt-auto text-center"
                    >
                      See Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="btn btn-outline btn-sm flex items-center gap-1 md:gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaChevronLeft className="text-xs" />
                  <span className="hidden sm:inline">Previous</span>
                </button>

                <div className="flex gap-1 md:gap-2">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className={`w-8 h-8 md:w-10 md:h-10 rounded-lg font-semibold text-sm transition-all ${
                        currentPage === index + 1
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="btn btn-outline btn-sm flex items-center gap-1 md:gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="hidden sm:inline">Next</span>
                  <FaChevronRight className="text-xs" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 md:py-20">
            <div className="text-6xl md:text-8xl mb-4 md:mb-6">🔍</div>
            <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 md:mb-3">No Tickets Found</h3>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-4 md:mb-6">Try adjusting your search or filter criteria</p>
            <button
              onClick={() => {
                setSearchFrom('');
                setSearchTo('');
                setFilterType('All');
                setSortBy('default');
              }}
              className="btn btn-primary"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllTickets;
