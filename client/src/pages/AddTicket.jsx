import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { AuthContext } from '../providers/AuthProvider';
import toast, { Toaster } from 'react-hot-toast';
import { FaBus, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaChair, FaMoneyBillWave, FaWifi, FaSnowflake, FaTint, FaPlug } from 'react-icons/fa';
import { MdAirlineSeatReclineExtra } from 'react-icons/md';

const AddTicket = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    from: '',
    to: '',
    date: '',
    departureTime: '',
    arrivalTime: '',
    busName: '',
    busType: 'Non-AC',
    price: '',
    totalSeats: 40,
    boardingPoints: '',
    droppingPoints: '',
    facilities: []
  });

  const facilitiesList = [
    { id: 'wifi', label: 'WiFi', icon: <FaWifi /> },
    { id: 'ac', label: 'AC', icon: <FaSnowflake /> },
    { id: 'water', label: 'Water', icon: <FaTint /> },
    { id: 'charging', label: 'Charging Point', icon: <FaPlug /> },
    { id: 'blanket', label: 'Blanket', icon: <MdAirlineSeatReclineExtra /> }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFacilityChange = (facilityId) => {
    setFormData(prev => {
      const facilities = prev.facilities.includes(facilityId)
        ? prev.facilities.filter(f => f !== facilityId)
        : [...prev.facilities, facilityId];
      return { ...prev, facilities };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const ticketData = {
        ...formData,
        vendorId: user?.uid,
        vendorName: user?.displayName,
        vendorEmail: user?.email,
        boardingPoints: formData.boardingPoints.split(',').map(p => p.trim()),
        droppingPoints: formData.droppingPoints.split(',').map(p => p.trim()),
        createdAt: new Date().toISOString()
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/tickets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(ticketData),
      });

      if (response.ok) {
        toast.success('Ticket added successfully!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Failed to add ticket');
      }
    } catch (error) {
      console.error('Error adding ticket:', error);
      toast.error('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <Toaster position="top-center" reverseOrder={false} />
      
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 dark:bg-blue-700 px-8 py-6">
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <FaBus className="text-blue-200" />
              Add New Ticket Service
            </h1>
            <p className="text-blue-100 mt-2">Create a new trip schedule for your transport service</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Route Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Route Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">From (Source)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="from"
                      required
                      value={formData.from}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                      placeholder="Enter starting location"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">To (Destination)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMapMarkerAlt className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="to"
                      required
                      value={formData.to}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                      placeholder="Enter destination"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Schedule & Bus Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Date</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaCalendarAlt className="text-gray-400" />
                    </div>
                    <input
                      type="date"
                      name="date"
                      required
                      value={formData.date}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Departure Time</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaClock className="text-gray-400" />
                    </div>
                    <input
                      type="time"
                      name="departureTime"
                      required
                      value={formData.departureTime}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Arrival Time (Est.)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaClock className="text-gray-400" />
                    </div>
                    <input
                      type="time"
                      name="arrivalTime"
                      required
                      value={formData.arrivalTime}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bus Name/Operator</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaBus className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="busName"
                      required
                      value={formData.busName}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                      placeholder="e.g. Green Line, Hanif Enterprise"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Bus Type</label>
                  <select
                    name="busType"
                    value={formData.busType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  >
                    <option value="Non-AC">Non-AC</option>
                    <option value="AC">AC (Business Class)</option>
                    <option value="Sleeper">Sleeper Coach</option>
                    <option value="Double Decker">Double Decker</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing & Capacity */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Pricing & Capacity
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ticket Price (Tk)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaMoneyBillWave className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="price"
                      required
                      min="0"
                      value={formData.price}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Total Seats</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaChair className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="totalSeats"
                      required
                      min="1"
                      value={formData.totalSeats}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Points & Facilities */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                Points & Facilities
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Boarding Points (Comma separated)</label>
                <textarea
                  name="boardingPoints"
                  required
                  rows="2"
                  value={formData.boardingPoints}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  placeholder="e.g. Gabtoli, Kalyanpur, Shyamoli"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Dropping Points (Comma separated)</label>
                <textarea
                  name="droppingPoints"
                  required
                  rows="2"
                  value={formData.droppingPoints}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors"
                  placeholder="e.g. Dampara, GEC, Muradpur"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Facilities</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {facilitiesList.map((facility) => (
                    <div
                      key={facility.id}
                      onClick={() => handleFacilityChange(facility.id)}
                      className={`cursor-pointer rounded-lg p-3 border flex flex-col items-center justify-center gap-2 transition-all ${
                        formData.facilities.includes(facility.id)
                          ? 'bg-blue-50 border-blue-500 text-blue-600 dark:bg-blue-900/30 dark:border-blue-400 dark:text-blue-400'
                          : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span className="text-xl">{facility.icon}</span>
                      <span className="text-sm font-medium">{facility.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg shadow-lg transform transition hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    Publishing Ticket...
                  </>
                ) : (
                  <>
                    <FaBus />
                    Publish Ticket Service
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTicket;
