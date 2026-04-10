const express = require('express');
const router = express.Router();
const { createLoad, getLoads, getMyLoads, updateLoad, deleteLoad } = require('../controllers/loadController');
const { getDrivers } = require('../controllers/driverController');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');

// GET routes
router.get('/drivers', authMiddleware, getDrivers);
router.get('/my-loads', authMiddleware, getMyLoads);
router.get('/', authMiddleware, getLoads);

// POST routes
router.post('/', authMiddleware, adminOnly, createLoad);

// PUT routes (specific sub-routes before generic :id)
router.put('/:id/assign', authMiddleware, adminOnly, updateLoad);
router.put('/:id/status', authMiddleware, updateLoad);
router.put('/:id', authMiddleware, updateLoad);

// DELETE routes
router.delete('/:id', authMiddleware, adminOnly, deleteLoad);

module.exports = router;
