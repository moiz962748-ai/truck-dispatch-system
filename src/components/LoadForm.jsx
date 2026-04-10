import { useState } from 'react';
import { createLoad } from '../api/api';
import { motion } from 'framer-motion';

function LoadForm({ onSuccess }) {
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [weight, setWeight] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await createLoad({ pickupLocation, dropoffLocation, weight });
      setPickupLocation('');
      setDropoffLocation('');
      setWeight('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create load.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 shadow-lg"
    >
      <h2 className="mb-6 text-2xl font-bold text-slate-900">Submit New Load Request</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <label className="mb-2 block text-sm font-semibold text-slate-700">Pickup Location</label>
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
            className="w-full rounded-lg border-2 border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            placeholder="e.g., New York, NY"
            required
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          <label className="mb-2 block text-sm font-semibold text-slate-700">Dropoff Location</label>
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            value={dropoffLocation}
            onChange={(e) => setDropoffLocation(e.target.value)}
            className="w-full rounded-lg border-2 border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            placeholder="e.g., Los Angeles, CA"
            required
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <label className="mb-2 block text-sm font-semibold text-slate-700">Weight (kg)</label>
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="number"
            min="0"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="w-full rounded-lg border-2 border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            placeholder="Enter weight"
            required
          />
        </motion.div>

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

        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700 border border-green-200"
          >
            <span>✓</span>
            <span>Load created successfully!</span>
          </motion.div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-6 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:from-slate-400 disabled:to-slate-400"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </>
          ) : (
            <>
              <span>➕ Create Load</span>
            </>
          )}
        </motion.button>
      </form>
    </motion.section>
  );
}

export default LoadForm;
