import { useTheme } from '../providers/ThemeProvider';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  const handleToggle = () => {
    console.log('Theme toggle clicked, current mode:', isDarkMode);
    toggleTheme();
  };

  return (
    <button
      onClick={handleToggle}
      className="relative w-14 h-7 bg-gray-300 dark:bg-gray-700 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      aria-label="Toggle theme"
      type="button"
    >
      <div
        className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${
          isDarkMode ? 'translate-x-7' : 'translate-x-0'
        }`}
      >
        {isDarkMode ? (
          <FaMoon className="text-blue-600 text-sm" />
        ) : (
          <FaSun className="text-yellow-500 text-sm" />
        )}
      </div>
    </button>
  );
};

export default ThemeToggle;
