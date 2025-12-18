import { useState, useEffect } from 'react';
import { 
  FaTicketAlt, FaStar, FaSearch, FaBus, FaTrain, FaShip, FaPlane,
  FaToggleOn, FaToggleOff, FaInfoCircle
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../../../utils/api';

const AdvertiseTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const MAX_ADVERTISED = 6;

  // Fetch approved tickets from API
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await api.get('/tickets?status=all');
        // Filter only approved/active tickets
        const approvedTickets = response.data
          .filter(t => t.status === 'approved' || t.status === 'active')
          .map(ticket => ({
            id: ticket._id,
            title: ticket.title || `${ticket.from} to ${ticket.to}`,
            image: ticket.image || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
            from: ticket.from,
            to: ticket.to,
            transportType: ticket.type,
            price: ticket.price,
            departureDate: ticket.departureDate,
            vendorName: ticket.vendorName || 'Vendor',
            isAdvertised: ticket.isAdvertised || false
          }));
        setTickets(approvedTickets);
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
      Bus: <FaBus className="text-blue-600" />,
      Train: <FaTrain className="text-green-600" />,
      Launch: <FaShip className="text-cyan-600" />,
      Plane: <FaPlane className="text-purple-600" />
    };
    return icons[type] || <FaBus className="text-blue-600" />;
  };

  const advertisedCount = tickets.filter(t => t.isAdvertised).length;

  const handleToggleAdvertise = async (ticketId) => {
    const ticket = tickets.find(t => t.id === ticketId);
    
    // Check if trying to advertise more than limit
    if (!ticket.isAdvertised && advertisedCount >= MAX_ADVERTISED) {
      toast.error(`Maximum ${MAX_ADVERTISED} tickets can be advertised. Remove one first.`);
      return;
    }

    try {
      await api.put(`/tickets/${ticketId}`, { isAdvertised: !ticket.isAdvertised });
      
      setTickets(prev => prev.map(t => 
        t.id === ticketId ? { ...t, isAdvertised: !t.isAdvertised } : t
      ));

      if (!ticket.isAdvertised) {
        toast.success('Ticket added to homepage carousel!');
      } else {
        toast.success('Ticket removed from carousel.');
      }
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast.error('Failed to update advertisement status');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Search filter
  let filteredTickets = tickets;
  if (searchTerm) {
    filteredTickets = filteredTickets.filter(t => 
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.to.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

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
          Advertise Tickets
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Select tickets to display on the homepage carousel
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <FaTicketAlt className="text-xl text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Approved</p>
              <p className="text-2xl font-bold text-gray-800 dark:text-white">{tickets.length}</p>
            </div>
          </div>
        </div>
        <div className="p-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <FaStar className="text-xl text-white" />
            </div>
            <div>
              <p className="text-sm text-yellow-100">Currently Advertised</p>
              <p className="text-2xl font-bold text-white">{advertisedCount} / {MAX_ADVERTISED}</p>
            </div>
          </div>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <FaInfoCircle className="text-xl text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Available Slots</p>
              <p className="text-2xl font-bold text-green-600">{MAX_ADVERTISED - advertisedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      {advertisedCount >= MAX_ADVERTISED && (
        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl mb-6 flex items-center gap-3">
          <FaInfoCircle className="text-yellow-600 text-xl flex-shrink-0" />
          <p className="text-yellow-700 dark:text-yellow-400">
            Maximum advertisement limit reached. Remove a ticket from advertisements to add a new one.
          </p>
        </div>
      )}

      {/* Search Box */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ticket title, vendor, or route..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Ticket Info
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Route
                </th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Type
                </th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Price
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Vendor
                </th>
                <th className="text-center px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Advertise
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <tr 
                    key={ticket.id}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                      ticket.isAdvertised ? 'bg-yellow-50 dark:bg-yellow-900/10' : ''
                    }`}
                  >
                    {/* Ticket Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={ticket.image}
                            alt={ticket.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          {ticket.isAdvertised && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                              <FaStar className="text-xs text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 dark:text-white">
                            {ticket.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(ticket.departureDate)}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Route */}
                    <td className="px-6 py-4">
                      <p className="text-gray-800 dark:text-white">
                        {ticket.from} → {ticket.to}
                      </p>
                    </td>

                    {/* Type */}
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1">
                        {getTypeIcon(ticket.transportType)}
                        <span className="text-sm text-gray-600 dark:text-gray-300">{ticket.transportType}</span>
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 text-right">
                      <span className="font-bold text-blue-600">৳{ticket.price}</span>
                    </td>

                    {/* Vendor */}
                    <td className="px-6 py-4">
                      <p className="text-gray-800 dark:text-white text-sm">{ticket.vendorName}</p>
                    </td>

                    {/* Advertise Toggle */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => handleToggleAdvertise(ticket.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                            ticket.isAdvertised
                              ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                              : advertisedCount >= MAX_ADVERTISED
                                ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                          }`}
                          disabled={!ticket.isAdvertised && advertisedCount >= MAX_ADVERTISED}
                        >
                          {ticket.isAdvertised ? (
                            <>
                              <FaToggleOn className="text-xl" />
                              Advertised
                            </>
                          ) : (
                            <>
                              <FaToggleOff className="text-xl" />
                              Advertise
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <FaTicketAlt className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      {searchTerm ? 'No matching tickets found' : 'No approved tickets available'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {filteredTickets.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Showing <span className="font-semibold">{filteredTickets.length}</span> tickets
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <span className="font-semibold text-yellow-600">{advertisedCount}</span> of <span className="font-semibold">{MAX_ADVERTISED}</span> slots used
            </p>
          </div>
        )}
      </div>

      {/* Currently Advertised Section */}
      {advertisedCount > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <FaStar className="text-yellow-500" />
            Currently Advertised on Homepage
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {tickets.filter(t => t.isAdvertised).map((ticket, index) => (
              <div 
                key={ticket.id}
                className="relative group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg"
              >
                <div className="absolute top-2 left-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs font-bold z-10">
                  {index + 1}
                </div>
                <img
                  src={ticket.image}
                  alt={ticket.title}
                  className="w-full h-24 object-cover"
                />
                <div className="p-3">
                  <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                    {ticket.title}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {ticket.from} → {ticket.to}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvertiseTickets;
