import { Link } from 'react-router';
import { FaHome, FaExclamationTriangle } from 'react-icons/fa';

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <FaExclamationTriangle className="text-9xl text-yellow-500 animate-pulse" />
            <div className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full w-20 h-20 flex items-center justify-center text-3xl font-bold shadow-lg">
              404
            </div>
          </div>
        </div>

        <h1 className="text-6xl font-bold text-gray-800 dark:text-white mb-4">Oops!</h1>
        <h2 className="text-3xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-md hover:shadow-lg"
          >
            <FaHome className="text-xl" />
            Go to Homepage
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition font-medium"
          >
            Go Back
          </button>
        </div>

        <div className="mt-12">
          <svg
            className="w-full max-w-lg mx-auto opacity-50"
            viewBox="0 0 500 300"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="150" cy="150" r="50" fill="#CBD5E0" opacity="0.3" />
            <circle cx="350" cy="150" r="50" fill="#CBD5E0" opacity="0.3" />
            <rect x="100" y="180" width="300" height="100" rx="10" fill="#E2E8F0" />
            <rect x="130" y="200" width="240" height="60" rx="5" fill="#CBD5E0" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
