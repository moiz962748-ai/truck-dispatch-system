import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchLoads, createLoad, updateLoadStatus, fetchDrivers, assignDriver, deleteLoad } from '../api/api';

function AdminDashboard() {
  const [loads, setLoads] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState('');
  const [driverError, setDriverError] = useState('');
  const [highlightedId, setHighlightedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const [animatedCounts, setAnimatedCounts] = useState({
    total: 0,
    pending: 0,
    dispatched: 0,
    delivered: 0,
  });
  const [newLoad, setNewLoad] = useState({
    pickupLocation: '',
    dropoffLocation: '',
    weight: '',
    distance: '',
    price: '',
    assignedDriver: '',
  });

  const loadData = async () => {
    setLoading(true);
    setError('');
    setDriverError('');

    try {
      const loadsData = await fetchLoads();
      setLoads(loadsData);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      const message = err.response?.data?.message || err.response?.statusText || err.message;
      setError(message || 'Unable to load dashboard data.');
    }

    try {
      const driversData = await fetchDrivers();
      setDrivers(driversData);
    } catch (err) {
      const message = err.response?.data?.message || err.response?.statusText || err.message;
      setDriverError(message || 'Unable to load drivers.');
      setDrivers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      loadData();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const targets = {
      total: loads.length,
      pending: loads.filter((l) => l.status === 'Pending').length,
      dispatched: loads.filter((l) => l.status === 'Dispatched').length,
      delivered: loads.filter((l) => l.status === 'Delivered').length,
    };

    const duration = 800;
    const start = performance.now();

    const animate = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      setAnimatedCounts({
        total: Math.round(targets.total * progress),
        pending: Math.round(targets.pending * progress),
        dispatched: Math.round(targets.dispatched * progress),
        delivered: Math.round(targets.delivered * progress),
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [loads]);

  const handleNewLoadSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setCreating(true);

    try {
      await createLoad({
        pickupLocation: newLoad.pickupLocation,
        dropoffLocation: newLoad.dropoffLocation,
        weight: Number(newLoad.weight),
        distance: Number(newLoad.distance),
        price: Number(newLoad.price),
        assignedDriver: newLoad.assignedDriver || undefined,
      });
      setNewLoad({ pickupLocation: '', dropoffLocation: '', weight: '', distance: '', price: '', assignedDriver: '' });
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create load.');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteLoad = async (loadId) => {
    const confirmed = window.confirm('Are you sure you want to delete this load?');
    if (!confirmed) return;

    setDeletingId(loadId);
    setError('');

    try {
      await deleteLoad(loadId);
      setLoads((current) => current.filter((load) => load.id !== loadId && load._id !== loadId));
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete load.');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredLoads = loads.filter((load) => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return true;
    return (
      load.pickupLocation?.toLowerCase().includes(query) ||
      load.assignedDriver?.name?.toLowerCase().includes(query)
    );
  });

  const handleStatusUpdate = async (loadId, status) => {
    try {
      await updateLoadStatus(loadId, status);
      setLoads((current) =>
        current.map((load) =>
          load.id === loadId || load._id === loadId ? { ...load, status } : load
        )
      );
      setHighlightedId(loadId);
      setTimeout(() => setHighlightedId(null), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update load status.');
    }
  };

  const handleAssignDriver = async (loadId, driverId) => {
    if (!driverId) return;
    try {
      const updatedLoad = await assignDriver(loadId, driverId);
      setLoads((current) =>
        current.map((load) =>
          load.id === loadId || load._id === loadId
            ? { ...load, assignedDriver: updatedLoad.assignedDriver }
            : load
        )
      );
      setHighlightedId(loadId);
      setTimeout(() => setHighlightedId(null), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to assign driver.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Dispatched':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  const stats = [
    { label: 'Total Loads', value: animatedCounts.total, icon: '📦' },
    { label: 'Pending', value: animatedCounts.pending, icon: '⏱️' },
    { label: 'Dispatched', value: animatedCounts.dispatched, icon: '🚚' },
    { label: 'Delivered', value: animatedCounts.delivered, icon: '✓' },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 rounded-2xl bg-gradient-to-r from-purple-600 to-purple-800 p-8 text-white shadow-lg"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="mt-2 text-purple-100">Manage loads, assign drivers, and optimize dispatch operations</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-white/80">Live status updates every 60s</span>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadData}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg bg-white/20 hover:bg-white/30 px-6 py-3 font-semibold text-white transition disabled:opacity-50"
            >
            <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </motion.button>
        </div>
      </div>
      </motion.section>

      {lastUpdated && (
        <div className="mb-4 text-sm text-slate-500 text-right">Last updated: {lastUpdated}</div>
      )}

      {/* Stats Grid */}
      <div className="mb-8 grid gap-4 md:grid-cols-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
            className="rounded-xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-2">{stat.icon}</div>
            <p className="text-sm text-slate-600 font-medium">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 rounded-lg bg-red-50 p-4 text-red-700 border border-red-200"
        >
          <p className="font-semibold">Error</p>
          <p className="text-sm">{error}</p>
        </motion.div>
      )}

      {/* Create Load Form */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-8 rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden"
      >
        <div className="p-8">
          <h2 className="mb-6 text-2xl font-bold text-slate-900">Add New Load</h2>
          <form onSubmit={handleNewLoadSubmit} className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Pickup Location</label>
              <input
                value={newLoad.pickupLocation}
                onChange={(e) => setNewLoad((prev) => ({ ...prev, pickupLocation: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                placeholder="Enter pickup location"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Dropoff Location</label>
              <input
                value={newLoad.dropoffLocation}
                onChange={(e) => setNewLoad((prev) => ({ ...prev, dropoffLocation: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                placeholder="Enter dropoff location"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Weight (kg)</label>
              <input
                type="number"
                value={newLoad.weight}
                onChange={(e) => {
                  const weight = e.target.value;
                  const distance = newLoad.distance;
                  const estimated = weight && distance ? Number(weight) * Number(distance) * 10 : '';
                  setNewLoad((prev) => ({ ...prev, weight, price: estimated, distance: prev.distance }));
                }}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                placeholder="Weight"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Distance (km)</label>
              <input
                type="number"
                value={newLoad.distance}
                onChange={(e) => {
                  const distance = e.target.value;
                  const weight = newLoad.weight;
                  const estimated = weight && distance ? Number(weight) * Number(distance) * 10 : '';
                  setNewLoad((prev) => ({ ...prev, distance, price: estimated }));
                }}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                placeholder="Distance"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">Estimated Quote</label>
              <input
                type="number"
                value={newLoad.price}
                readOnly
                className="w-full rounded-lg border border-slate-300 bg-slate-100 px-4 py-3 text-sm text-slate-900 outline-none"
                placeholder="Estimated price"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Assign Driver</label>
              <select
                value={newLoad.assignedDriver}
                onChange={(e) => setNewLoad((prev) => ({ ...prev, assignedDriver: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white"
                disabled={!drivers.length}
              >
                <option value="">Select a driver (optional)</option>
                {drivers.map((driver) => (
                  <option key={driver._id} value={driver._id}>
                    {driver.name}
                  </option>
                ))}
              </select>
              {!loading && !drivers.length && (
                <p className="mt-2 text-sm text-slate-500">No driver accounts found. Register a driver first, then assign them here.</p>
              )}
              {driverError && (
                <p className="mt-2 text-sm text-red-600">{driverError}</p>
              )}
            </div>
            <div className="md:col-span-2 flex items-center justify-end">
              <button
                type="submit"
                disabled={creating}
                className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
              >
                {creating ? 'Creating...' : 'Create Load'}
              </button>
            </div>
          </form>
        </div>
      </motion.section>

      {/* Loads Table */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="rounded-2xl border border-slate-200 bg-white shadow-lg overflow-hidden"
      >
        <div className="p-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold text-slate-900">All Loads</h2>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by pickup location or driver"
              className="max-w-sm rounded-lg border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none focus:border-purple-500 focus:bg-white"
            />
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center gap-2">
                <svg className="animate-spin h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-slate-600">Loading dashboard...</span>
              </div>
            </div>
          ) : filteredLoads.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📦</div>
              <p className="text-slate-600 text-lg">No matching loads found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-[700px] w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-left font-semibold text-slate-900">Pickup</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-900">Dropoff</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-900">Weight</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-900">Driver</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-900">Status</th>
                    <th className="px-6 py-4 text-left font-semibold text-slate-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredLoads.map((load) => {
                    const loadId = load.id || load._id;
                    const isHighlighted = highlightedId === loadId;

                    return (
                      <motion.tr
                        key={loadId}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`transition-all ${isHighlighted ? 'bg-green-50' : 'hover:bg-slate-50'}`}
                      >
                        <td className="px-6 py-4 text-slate-900 font-medium">{load.pickupLocation}</td>
                        <td className="px-6 py-4 text-slate-900 font-medium">{load.dropoffLocation}</td>
                        <td className="px-6 py-4 text-slate-700">{load.weight} kg</td>
                        <td className="px-6 py-4 text-slate-700">{load.assignedDriver?.name || 'Unassigned'}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold border capitalize ${getStatusColor(load.status)}`}>
                            {load.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 space-y-2">
                                        <motion.select
                            whileHover={{ scale: 1.02 }}
                            value={load.assignedDriver?._id || ''}
                            onChange={(e) => handleAssignDriver(loadId, e.target.value)}
                            className="block w-full rounded-lg border-2 border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                          >
                            <option value="">👤 Assign Driver</option>
                            {drivers.map((driver) => (
                              <option key={driver._id} value={driver._id}>
                                {driver.name}
                              </option>
                            ))}
                          </motion.select>
                          <motion.select
                            whileHover={{ scale: 1.02 }}
                            value={load.status}
                            onChange={(e) => handleStatusUpdate(loadId, e.target.value)}
                            className="block w-full rounded-lg border-2 border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                          >
                            <option value="Pending">⏱️ Pending</option>
                            <option value="Dispatched">📍 Dispatched</option>
                            <option value="Delivered">✓ Delivered</option>
                          </motion.select>
                          <button
                            type="button"
                            onClick={() => handleDeleteLoad(loadId)}
                            disabled={deletingId === loadId}
                            className="w-full rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                          >
                            {deletingId === loadId ? 'Deleting...' : 'Delete'}
                          </button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.section>
    </div>
  );
}

export default AdminDashboard;
