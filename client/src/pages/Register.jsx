import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthContext } from '../providers/AuthProvider';
import toast, { Toaster } from 'react-hot-toast';
import { FaEye, FaEyeSlash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const Register = () => {
  const { createUser, updateUserProfile, googleSignIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    photoURL: '',
    password: '',
    confirmPassword: '',
    role: 'user' // Default role
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Password validation states
  const [passwordValidation, setPasswordValidation] = useState({
    hasUppercase: false,
    hasLowercase: false,
    hasMinLength: false
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Validate password in real-time
    if (name === 'password') {
      setPasswordValidation({
        hasUppercase: /[A-Z]/.test(value),
        hasLowercase: /[a-z]/.test(value),
        hasMinLength: value.length >= 6
      });
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();

    // Validation
    if (!passwordValidation.hasUppercase) {
      toast.error('Password must contain at least one uppercase letter');
      return;
    }

    if (!passwordValidation.hasLowercase) {
      toast.error('Password must contain at least one lowercase letter');
      return;
    }

    if (!passwordValidation.hasMinLength) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    createUser(formData.email, formData.password)
      .then((result) => {
        const user = result.user;
        updateUserProfile(formData.name, formData.photoURL)
          .then(async () => {
            // Save user to backend with role
            try {
              const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/users`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  name: formData.name,
                  email: formData.email,
                  photoURL: formData.photoURL,
                  role: formData.role,
                  uid: user.uid
                }),
              });

              if (response.ok) {
                localStorage.setItem('userRole', formData.role);
                toast.success(`Registration successful as ${formData.role}! Welcome to TicketBari!`);
                setTimeout(() => {
                  navigate('/');
                }, 1000);
              } else {
                const errorData = await response.json().catch(() => ({}));
                console.error('Server error:', errorData);
                toast.error(errorData.error || 'Failed to save user data to database');
                setLoading(false);
              }
            } catch (error) {
              console.error('Error saving user:', error);
              toast.error('Failed to complete registration');
            }
          });
      })
      .catch((error) => {
        setLoading(false);
        console.error('Registration error:', error);
        
        let errorMessage = 'Registration failed';
        
        if (error.code === 'auth/email-already-in-use') {
          errorMessage = 'This email is already registered. Please login instead.';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = 'Invalid email address format';
        } else if (error.code === 'auth/weak-password') {
          errorMessage = 'Password is too weak. Use at least 6 characters with uppercase and lowercase letters.';
        } else if (error.code === 'auth/operation-not-allowed') {
          errorMessage = 'Email/Password authentication is not enabled in Firebase Console';
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        toast.error(errorMessage);
      });
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    googleSignIn()
      .then(async (result) => {
        const user = result.user;
        // Save or update user to backend with default role
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/users`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: user.displayName,
              email: user.email,
              photoURL: user.photoURL,
              role: 'user', // Default role for Google sign-in
              uid: user.uid
            }),
          });

          if (response.ok) {
            localStorage.setItem('userRole', 'user');
          }
          
          toast.success('Registration successful! Welcome!');
          setTimeout(() => {
            navigate('/');
          }, 1000);
        } catch (error) {
          console.error('Error saving user:', error);
          toast.success('Signed in successfully!');
          setTimeout(() => {
            navigate('/');
          }, 1000);
        }
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message || 'Google sign-in failed');
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-8 md:py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
        <div>
          <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Create Account
          </h2>
          <p className="text-center text-sm md:text-base text-gray-600 dark:text-gray-300 mb-6 md:mb-8">
            Join TicketBari today
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-3 md:space-y-4">
          <div>
            <label htmlFor="name" className="input-label">
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="input-label">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="photoURL" className="input-label">
              Photo URL
            </label>
            <input
              id="photoURL"
              name="photoURL"
              type="url"
              value={formData.photoURL}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter photo URL (optional)"
            />
          </div>

          <div>
            <label htmlFor="password" className="input-label">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={handleChange}
                className="input-field pr-10"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Password validation indicators */}
            {formData.password && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center text-xs md:text-sm">
                  {passwordValidation.hasUppercase ? (
                    <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                  ) : (
                    <FaTimesCircle className="text-red-500 mr-2 flex-shrink-0" />
                  )}
                  <span className={passwordValidation.hasUppercase ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
                    At least one uppercase letter
                  </span>
                </div>
                <div className="flex items-center text-xs md:text-sm">
                  {passwordValidation.hasLowercase ? (
                    <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                  ) : (
                    <FaTimesCircle className="text-red-500 mr-2 flex-shrink-0" />
                  )}
                  <span className={passwordValidation.hasLowercase ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
                    At least one lowercase letter
                  </span>
                </div>
                <div className="flex items-center text-xs md:text-sm">
                  {passwordValidation.hasMinLength ? (
                    <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                  ) : (
                    <FaTimesCircle className="text-red-500 mr-2 flex-shrink-0" />
                  )}
                  <span className={passwordValidation.hasMinLength ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}>
                    At least 6 characters
                  </span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="input-label">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="input-field pr-10"
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="role" className="input-label">
              I want to register as
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input-field"
            >
              <option value="user">User (Book Tickets)</option>
              <option value="vendor">Vendor (Provide Transport Services)</option>
              <option value="admin">Admin (Manage System)</option>
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {formData.role === 'vendor' 
                ? 'As a vendor, you can add and manage tickets for your transport services'
                : formData.role === 'admin'
                ? 'As an admin, you have full access to manage users and system settings'
                : 'As a user, you can search and book tickets from available vendors'}
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <div className="mt-4 md:mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="mt-4 w-full flex items-center justify-center px-4 py-2.5 md:py-3 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Sign up with Google
          </button>
        </div>

        <p className="mt-4 md:mt-6 text-center text-xs md:text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
