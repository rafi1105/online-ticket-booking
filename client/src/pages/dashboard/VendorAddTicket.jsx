import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { AuthContext } from '../../providers/AuthProvider';
import { 
  FaTicketAlt, FaMapMarkerAlt, FaBus, FaMoneyBillWave, 
  FaCalendarAlt, FaClock, FaImage, FaPlus, FaUser, FaEnvelope
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const VendorAddTicket = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    from: '',
    to: '',
    transportType: 'Bus',
    price: '',
    quantity: '',
    departureDate: '',
    departureTime: '',
    perks: {
      ac: false,
      wifi: false,
      food: false,
      tv: false,
      sleeper: false,
      charging: false,
      blanket: false,
      entertainment: false
    },
    image: null
  });

  const transportTypes = ['Bus', 'Train', 'Launch', 'Plane'];

  const perksList = [
    { key: 'ac', label: 'AC', icon: '❄️' },
    { key: 'wifi', label: 'WiFi', icon: '📶' },
    { key: 'food', label: 'Food/Snacks', icon: '🍔' },
    { key: 'tv', label: 'TV/Monitor', icon: '📺' },
    { key: 'sleeper', label: 'Sleeper Seats', icon: '🛏️' },
    { key: 'charging', label: 'Charging Port', icon: '🔌' },
    { key: 'blanket', label: 'Blanket/Pillow', icon: '🛋️' },
    { key: 'entertainment', label: 'Entertainment', icon: '🎬' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePerkChange = (perkKey) => {
    setFormData(prev => ({
      ...prev,
      perks: {
        ...prev.perks,
        [perkKey]: !prev.perks[perkKey]
      }
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Try to upload to ImgBB if API key is configured
      const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY || 'be97dbcf94363ca91a203512af4913d5';
      
      if (imgbbApiKey) {
        setLoading(true);
        try {
          const uploadFormData = new FormData();
          uploadFormData.append('image', file);
          
          const response = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
            method: 'POST',
            body: uploadFormData
          });
          
          const data = await response.json();
          if (data.success) {
            setFormData(prev => ({
              ...prev,
              image: data.data.url
            }));
            toast.success('Image uploaded successfully!');
          } else {
            // Use a default placeholder image
            setFormData(prev => ({
              ...prev,
              image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80'
            }));
            toast.info('Using default image');
          }
        } catch (error) {
          console.error('Image upload error:', error);
          // Use default placeholder
          setFormData(prev => ({
            ...prev,
            image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80'
          }));
          toast.info('Using default image');
        } finally {
          setLoading(false);
        }
      } else {
        // No API key - use default placeholder based on transport type
        const defaultImages = {
          Bus: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
          Train: 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&q=80',
          Launch: 'https://images.unsplash.com/photo-1540946485063-a40da27545f8?w=800&q=80',
          Plane: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80'
        };
        setFormData(prev => ({
          ...prev,
          image: defaultImages[prev.transportType] || defaultImages.Bus
        }));
        toast.info('Image preview set. Default image will be used.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!formData.title || !formData.from || !formData.to || !formData.price || 
        !formData.quantity || !formData.departureDate || !formData.departureTime) {
      toast.error('Please fill in all required fields');
      setLoading(false);
      return;
    }

    // Get selected perks
    const selectedFeatures = Object.entries(formData.perks)
      .filter(([_, isSelected]) => isSelected)
      .map(([key, _]) => perksList.find(p => p.key === key)?.label);

    // Create ticket object - match server model fields
    const ticketData = {
      title: formData.title,
      from: formData.from,
      to: formData.to,
      type: formData.transportType, // model expects 'type' not 'transportType'
      price: parseInt(formData.price),
      totalSeats: parseInt(formData.quantity),
      availableSeats: parseInt(formData.quantity),
      departureDate: formData.departureDate,
      departureTime: formData.departureTime,
      features: selectedFeatures, // model expects 'features' not 'perks'
      image: formData.image || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80',
      vendorName: user?.displayName,
      vendorEmail: user?.email,
      vendorId: user?.uid,
      status: 'pending' // Initially pending - needs admin approval
    };

    try {
      // API call to save ticket
      const response = await api.post('/tickets', ticketData);

      if (response.status !== 200 && response.status !== 201) {
        throw new Error('Failed to add ticket');
      }

      toast.success('Ticket added successfully! Status: Pending approval');
      navigate('/dashboard/my-tickets');
    } catch (error) {
      console.error('Error adding ticket:', error);
      toast.error('Failed to add ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Add New Ticket
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Create a new ticket listing for your transport service
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Ticket Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <FaTicketAlt className="inline mr-2 text-blue-600" />
              Ticket Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Premium AC Coach Service"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* From & To */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <FaMapMarkerAlt className="inline mr-2 text-green-600" />
                From (Location) *
              </label>
              <input
                type="text"
                name="from"
                value={formData.from}
                onChange={handleInputChange}
                placeholder="e.g., Dhaka"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <FaMapMarkerAlt className="inline mr-2 text-red-600" />
                To (Location) *
              </label>
              <input
                type="text"
                name="to"
                value={formData.to}
                onChange={handleInputChange}
                placeholder="e.g., Chittagong"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Transport Type & Price */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <FaBus className="inline mr-2 text-purple-600" />
                Transport Type *
              </label>
              <select
                name="transportType"
                value={formData.transportType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {transportTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <FaMoneyBillWave className="inline mr-2 text-green-600" />
                Price (per unit) in ৳ *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="e.g., 800"
                min="1"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <FaTicketAlt className="inline mr-2 text-orange-600" />
              Ticket Quantity *
            </label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              placeholder="e.g., 40"
              min="1"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Departure Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <FaCalendarAlt className="inline mr-2 text-blue-600" />
                Departure Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  name="departureDate"
                  value={formData.departureDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:dark:invert [&::-webkit-calendar-picker-indicator]:opacity-70 [&::-webkit-calendar-picker-indicator]:hover:opacity-100"
                  required
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Click to open calendar</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                <FaClock className="inline mr-2 text-purple-600" />
                Departure Time *
              </label>
              <div className="relative">
                <input
                  type="time"
                  name="departureTime"
                  value={formData.departureTime}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:dark:invert [&::-webkit-calendar-picker-indicator]:opacity-70 [&::-webkit-calendar-picker-indicator]:hover:opacity-100"
                  required
                />
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Click to select time</p>
            </div>
          </div>

          {/* Perks (Checkboxes) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
              🎁 Perks & Amenities
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {perksList.map(perk => (
                <label
                  key={perk.key}
                  className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all ${
                    formData.perks[perk.key]
                      ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500'
                      : 'bg-gray-50 dark:bg-gray-700 border-2 border-transparent hover:bg-gray-100 dark:hover:bg-gray-600'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.perks[perk.key]}
                    onChange={() => handlePerkChange(perk.key)}
                    className="sr-only"
                  />
                  <span className="text-2xl">{perk.icon}</span>
                  <span className="font-medium text-gray-800 dark:text-white">{perk.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              <FaImage className="inline mr-2 text-pink-600" />
              Ticket Image
            </label>
            <div className="flex items-center gap-6">
              <div className="flex-1">
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <FaImage className="text-4xl text-gray-400 mb-3" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Click to upload image
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              {imagePreview && (
                <div className="w-40 h-40 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-600">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Vendor Info (Readonly) */}
          <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Vendor Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-600 rounded-lg">
                <FaUser className="text-blue-600" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Vendor Name</p>
                  <p className="font-semibold text-gray-800 dark:text-white">{user?.displayName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-600 rounded-lg">
                <FaEnvelope className="text-green-600" />
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Vendor Email</p>
                  <p className="font-semibold text-gray-800 dark:text-white">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-colors"
          >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span>
                Adding Ticket...
              </>
            ) : (
              <>
                <FaPlus />
                Add Ticket
              </>
            )}
          </button>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            📋 Your ticket will be submitted with "Pending" status and requires admin approval
          </p>
        </form>
      </div>
    </div>
  );
};

export default VendorAddTicket;
