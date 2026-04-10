import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchMyLoads, updateLoadStatus } from '../api/api';

function DriverDashboard() {
  const [loads, setLoads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusUpdating, setStatusUpdating] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('');

  const loadMyLoads = async () => {
    setLoading(true);
    setError('');

    try {
      const data = await fetchMyLoads();
      setLoads(data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load your assigned loads.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (loadId, status) => {
    setStatusUpdating(loadId);
    setError('');
    setLoads((current) =>
      current.map((load) =>
        load.id === loadId || load._id === loadId ? { ...load, status } : load
      )
    );

    try {
      const updatedLoad = await updateLoadStatus(loadId, status);
      setLoads((current) =>
        current.map((load) =>
          load.id === loadId || load._id === loadId ? updatedLoad : load
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update load status.');
      await loadMyLoads();
    } finally {
      setStatusUpdating(null);
    }
  };

  useEffect(() => {
    loadMyLoads();
    const interval = setInterval(loadMyLoads, 60000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    const normalized = status?.toLowerCase();
    switch (normalized) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'dispatched':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white shadow-lg"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Driver Dashboard</h1>
            <p className="mt-2 text-blue-100">View your assigned loads and submit new pickup requests</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadMyLoads}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-white/20 hover:bg-white/30 px-6 py-3 font-semibold text-white transition disabled:opacity-50"
          >
            <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </motion.button>
        </div>
      </motion.section>

      {/* Assigned Loads */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-8 rounded-2xl border border-slate-200 bg-white shadow-lg p-8"
      >
        <h2 className="mb-6 text-2xl font-bold text-slate-900">Your Assigned Loads</h2>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2">
              <svg className="animate-spin h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-slate-600">Loading loads...</span>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-lg bg-red-50 p-4 text-red-700 border border-red-200">
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : loads.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">📦</div>
            <p className="text-slate-600 text-lg">No loads assigned yet</p>
            <p className="text-slate-500">Complete the form below to submit new loads</p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-slate-500 text-right">Live status updates every 60s</div>
            <div className="grid gap-4 md:grid-cols-2">
              {loads.map((load, idx) => (
              <motion.div
                key={load.id || load._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="group rounded-lg border-2 border-slate-200 hover:border-blue-300 bg-slate-50 p-6 transition-all hover:shadow-lg"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-slate-900">Load #{load.id || load._id}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border capitalize ${getStatusColor(load.status)}`}>
                    {load.status}
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <span className="text-lg">📍</span>
                    <div>
                      <p className="text-slate-600 font-medium">Pickup</p>
                      <p className="text-slate-900 font-semibold">{load.pickupLocation}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-lg">🎯</span>
                    <div>
                      <p className="text-slate-600 font-medium">Dropoff</p>
                      <p className="text-slate-900 font-semibold">{load.dropoffLocation}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-lg">⚖️</span>
                    <div>
                      <p className="text-slate-600 font-medium">Weight</p>
                      <p className="text-slate-900 font-semibold">{load.weight} kg</p>
                    </div>
                  </div>

                  {load.driverName && (
                    <div className="flex items-start gap-3">
                      <span className="text-lg">👤</span>
                      <div>
                        <p className="text-slate-600 font-medium">Assigned Driver</p>
                        <p className="text-slate-900 font-semibold">{load.driverName}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">Update Status</label>
                  <select
                    value={load.status}
                    onChange={(e) => handleStatusChange(load.id || load._id, e.target.value)}
                    disabled={statusUpdating === (load.id || load._id)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-blue-200"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Dispatched">Dispatched</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>
              </motion.div>
            ))}
          </div>
          </>
        )}
      </motion.section>

      {/* Load Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">About Loads</h2>
          <p className="text-slate-600">
            Your assigned loads will appear above. Admins create loads and assign them to drivers. 
            Accept and complete your assigned loads to keep the dispatch network running smoothly.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default DriverDashboard;
