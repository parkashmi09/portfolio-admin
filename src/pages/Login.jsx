
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, isAuthenticated } from '../utils/auth';
import { toast } from 'sonner';
import { LogIn, Mail, Lock, Loader } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If already authenticated, redirect to admin dashboard
    if (isAuthenticated()) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const success = login(email, password);
      
      if (success) {
        toast.success('Login successful');
        navigate('/admin');
      } else {
        toast.error('Invalid credentials');
        setIsLoading(false);
      }
    }, 800); // Simulate API call
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-smooth p-8 animate-scale-in">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">Admin Login</h1>
            <p className="text-gray-600 mt-2">Sign in to access the admin panel</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="block w-full pl-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all-smooth"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all-smooth"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all-smooth"
              >
                {isLoading ? (
                  <Loader className="h-5 w-5 animate-spin mr-2" />
                ) : (
                  <LogIn className="h-5 w-5 mr-2" />
                )}
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>For demo: email: admin@example.com | password: admin123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
