import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../providers/AuthProvider';
import { FaHistory, FaSearch, FaTicketAlt, FaCalendarAlt, FaReceipt } from 'react-icons/fa';

const Transactions = () => {
  const { user } = useContext(AuthContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Sample transaction data (would come from Stripe API)
  useEffect(() => {
    const sampleTransactions = [
      {
        id: 'txn_1234567890ABCDEF',
        amount: 1600,
        ticketTitle: 'Premium AC Coach - Dhaka to Chittagong',
        paymentDate: '2025-12-18T14:30:00Z',
        status: 'succeeded',
        paymentMethod: 'card',
        last4: '4242'
      },
      {
        id: 'txn_2345678901BCDEFG',
        amount: 10500,
        ticketTitle: 'Domestic Flight Economy - Dhaka to Cox\'s Bazar',
        paymentDate: '2025-12-15T09:15:00Z',
        status: 'succeeded',
        paymentMethod: 'card',
        last4: '1234'
      },
      {
        id: 'txn_3456789012CDEFGH',
        amount: 2200,
        ticketTitle: 'Intercity Express Train - Dhaka to Rajshahi',
        paymentDate: '2025-12-10T16:45:00Z',
        status: 'succeeded',
        paymentMethod: 'card',
        last4: '5678'
      },
      {
        id: 'txn_4567890123DEFGHI',
        amount: 600,
        ticketTitle: 'Express Train Service - Dhaka to Sylhet',
        paymentDate: '2025-12-08T11:20:00Z',
        status: 'succeeded',
        paymentMethod: 'card',
        last4: '9012'
      },
      {
        id: 'txn_5678901234EFGHIJ',
        amount: 850,
        ticketTitle: 'Night Coach Return - Chittagong to Dhaka',
        paymentDate: '2025-12-05T08:00:00Z',
        status: 'succeeded',
        paymentMethod: 'card',
        last4: '3456'
      },
      {
        id: 'txn_6789012345FGHIJK',
        amount: 1000,
        ticketTitle: 'Deluxe Cabin Launch - Dhaka to Barisal',
        paymentDate: '2025-12-01T19:30:00Z',
        status: 'succeeded',
        paymentMethod: 'card',
        last4: '7890'
      }
    ];

    setTimeout(() => {
      setTransactions(sampleTransactions);
      setLoading(false);
    }, 500);
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredTransactions = transactions.filter(txn =>
    txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    txn.ticketTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAmount = transactions.reduce((sum, txn) => sum + txn.amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-2">
          Transaction History
        </h1>
        <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400">
          View all your Stripe payment transactions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-6 shadow-lg">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
              <FaReceipt className="text-xl lg:text-2xl text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">Total Transactions</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">{transactions.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-6 shadow-lg">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
              <span className="text-xl lg:text-2xl">💰</span>
            </div>
            <div>
              <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">Total Amount</p>
              <p className="text-xl lg:text-2xl font-bold text-green-600">৳{totalAmount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-6 shadow-lg">
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
              <FaTicketAlt className="text-xl lg:text-2xl text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400">Tickets Purchased</p>
              <p className="text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">{transactions.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Box */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 lg:p-6 mb-6 lg:mb-8">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by Transaction ID or Ticket Title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 lg:py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-sm lg:text-base text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4 mb-6">
        {filteredTransactions.length > 0 ? (
          filteredTransactions.map((transaction) => (
            <div key={transaction.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FaTicketAlt className="text-blue-600 dark:text-blue-400" />
                  <span className="font-semibold text-gray-800 dark:text-white text-sm line-clamp-1">
                    {transaction.ticketTitle.split(' - ')[0]}
                  </span>
                </div>
                <span className="text-lg font-bold text-green-600">
                  ৳{transaction.amount.toLocaleString()}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
                  <span>Transaction ID</span>
                  <span className="font-mono text-xs">{transaction.id.slice(4, 16)}...</span>
                </div>
                <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
                  <span>Date</span>
                  <span>{formatDate(transaction.paymentDate).split(',')[0]}</span>
                </div>
                <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
                  <span>Payment</span>
                  <span className="flex items-center gap-1">
                    💳 •••• {transaction.last4}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <FaHistory className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No transactions found</p>
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Transaction ID
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Ticket Title
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Amount
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Payment Date
                </th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600 dark:text-gray-300">
                  Payment Method
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction, index) => (
                  <tr 
                    key={transaction.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaReceipt className="text-gray-400" />
                        <span className="font-mono text-sm text-gray-800 dark:text-white">
                          {transaction.id.slice(0, 20)}...
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FaTicketAlt className="text-blue-600 dark:text-blue-400" />
                        <span className="text-gray-800 dark:text-white max-w-xs truncate">
                          {transaction.ticketTitle}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-lg font-bold text-green-600">
                        ৳{transaction.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <FaCalendarAlt className="text-gray-400" />
                        {formatDate(transaction.paymentDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-5 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center">
                          <span className="text-white text-xs">💳</span>
                        </div>
                        <span className="text-gray-600 dark:text-gray-300">
                          •••• {transaction.last4}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <FaHistory className="text-5xl text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No transactions found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {filteredTransactions.length > 0 && (
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Showing <span className="font-semibold">{filteredTransactions.length}</span> of <span className="font-semibold">{transactions.length}</span> transactions
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
