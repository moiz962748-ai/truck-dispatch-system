import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { registerUser } from '../api/api';

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('driver');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token) {
      navigate(role === 'admin' ? '/admin' : '/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const data = await registerUser({ name, email, password, role });
      const userRole = data.user?.role ?? data.role ?? 'driver';
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', userRole);
      navigate(userRole === 'admin' ? '/admin-dashboard' : '/dashboard', { replace: true });
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-slate-50 to-slate-100">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
                <span className="text-white font-bold text-lg">+</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Create Account</h2>
            <p className="text-sm text-slate-600 mt-1">Join our dispatch network</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <label className="mb-2 block text-sm font-semibold text-slate-700">Full Name</label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border-2 border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-200 outline-none transition-all"
                placeholder="John Doe"
                required
              />
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border-2 border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-200 outline-none transition-all"
                placeholder="you@example.com"
                required
              />
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border-2 border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-200 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </motion.div>

            {/* Confirm Password */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
            >
              <label className="mb-2 block text-sm font-semibold text-slate-700">Confirm Password</label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border-2 border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-200 outline-none transition-all"
                placeholder="••••••••"
                required
              />
            </motion.div>

            {/* Role Selection */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <label className="mb-2 block text-sm font-semibold text-slate-700">Account Type</label>
              <motion.select
                whileFocus={{ scale: 1.02 }}
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-lg border-2 border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-green-500 focus:bg-white focus:ring-2 focus:ring-green-200 outline-none transition-all"
              >
                <option value="driver">Driver</option>
                <option value="admin">Admin</option>
              </motion.select>
            </motion.div>

            {/* Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200"
              >
                <span>⚠️</span>
                <span>{error}</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-400 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200"></div>
            <span className="text-xs text-slate-500">or</span>
            <div className="h-px flex-1 bg-slate-200"></div>
          </div>

          {/* Sign In Link */}
          <p className="text-center text-sm text-slate-600">
            Already have an account?{' '}
            <a href="/login" className="font-semibold text-blue-600 hover:text-blue-700">
              Sign in
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Register;
