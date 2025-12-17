import { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { AuthContext } from '../providers/AuthProvider';
import { auth } from '../firebase/firebase.config';
import toast, { Toaster } from 'react-hot-toast';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = () => {
  const { signIn, googleSignIn, createUser, updateUserProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    signIn(email, password)
      .then(() => {
        toast.success('Login successful! Welcome back!');
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1000);
      })
      .catch((error) => {
        setLoading(false);
        const errorMessage = error.message.includes('auth/user-not-found')
          ? 'No account found with this email'
          : error.message.includes('auth/wrong-password')
          ? 'Incorrect password'
          : error.message.includes('auth/invalid-credential')
          ? 'Invalid email or password'
          : error.message;
        toast.error(errorMessage);
      });
  };

  const handleGoogleSignIn = () => {
    setLoading(true);
    googleSignIn()
      .then(() => {
        toast.success('Login successful! Welcome!');
        setTimeout(() => {
          navigate(from, { replace: true });
        }, 1000);
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message || 'Google sign-in failed');
      });
  };

  const handleDemoLogin = async (role) => {
    const credentials = {
      admin: { email: 'admin@ticketbari.com', password: 'Admin@123' },
      vendor: { email: 'vendor@ticketbari.com', password: 'Vendor@123' },
      user: { email: 'user@ticketbari.com', password: 'User@123' }
    };
    
    const creds = credentials[role];
    setLoading(true);
    
    try {
      await signIn(creds.email, creds.password);
      toast.success(`${role.charAt(0).toUpperCase() + role.slice(1)} login successful!`);
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);
    } catch (error) {
      // If login fails, try to create the account automatically
      if (error.message.includes('auth/user-not-found') || error.message.includes('auth/invalid-credential')) {
        try {
          toast.loading('Creating demo account...', { id: 'creating' });
          
          // Register the user in Firebase
          await createUser(creds.email, creds.password);
          
          // Update profile
          await updateUserProfile(
            role === 'admin' ? 'Admin User' : role === 'vendor' ? 'Vendor User' : 'Normal User',
            `https://i.pravatar.cc/150?u=${role}`
          );
          
          // Save to backend
          const currentUser = auth.currentUser;
          await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: role === 'admin' ? 'Admin User' : role === 'vendor' ? 'Vendor User' : 'Normal User',
              email: creds.email,
              photoURL: `https://i.pravatar.cc/150?u=${role}`,
              role: role,
              uid: currentUser.uid
            }),
          });
          
          localStorage.setItem('userRole', role);
          toast.success('Demo account created and logged in!', { id: 'creating' });
          
          setTimeout(() => {
            navigate(from, { replace: true });
          }, 1000);
        } catch (createError) {
          setLoading(false);
          toast.error('Failed to create demo account. Please register manually.', { id: 'creating' });
          setEmail(creds.email);
          setPassword(creds.password);
        }
      } else {
        setLoading(false);
        toast.error(error.message);
        setEmail(creds.email);
        setPassword(creds.password);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-8 md:py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
        <div>
          <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-center text-sm md:text-base text-gray-600 dark:text-gray-300 mb-6 md:mb-8">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 md:space-y-6">
          <div>
            <label htmlFor="email" className="input-label">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="Enter your email"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            <div className="text-right mt-1">
              <Link
                to="/forgot-password"
                className="text-xs md:text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Forgot Password?
              </Link>
            </div>
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
                Signing In...
              </>
            ) : (
              'Sign In'
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
            Sign in with Google
          </button>
        </div>

        <p className="mt-4 md:mt-6 text-center text-xs md:text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            Register here
          </Link>
        </p>

        {/* Demo Credentials Box */}
        <div className="mt-6 md:mt-8 p-3 md:p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
          <h3 className="text-xs md:text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2 md:mb-3">Quick Login (Demo)</h3>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemoLogin('admin')}
              className="px-2 py-1.5 text-xs font-medium bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
            >
              Admin
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('vendor')}
              className="px-2 py-1.5 text-xs font-medium bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-700 rounded-lg hover:bg-purple-50 dark:hover:bg-gray-700 transition-colors"
            >
              Vendor
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin('user')}
              className="px-2 py-1.5 text-xs font-medium bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-700 rounded-lg hover:bg-green-50 dark:hover:bg-gray-700 transition-colors"
            >
              User
            </button>
          </div>
          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-2 text-center">
            Click to login instantly (accounts must be registered first)
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
