const Load = require('../models/Load');

exports.createLoad = async (req, res) => {
  const { pickupLocation, dropoffLocation, weight, distance, price, assignedDriver } = req.body;
  const numericWeight = Number(weight);
  const numericDistance = Number(distance);
  const calculatedPrice = price ? Number(price) : (numericWeight > 0 && numericDistance > 0 ? numericWeight * numericDistance * 10 : undefined);

  if (!calculatedPrice || Number.isNaN(calculatedPrice)) {
    return res.status(400).json({ message: 'Price could not be calculated. Please provide valid weight and distance.' });
  }

  try {
    const load = await Load.create({
      pickupLocation,
      dropoffLocation,
      weight: numericWeight,
      price: calculatedPrice,
      assignedDriver,
    });

    res.status(201).json(load);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create load', error: error.message });
  }
};

exports.getLoads = async (req, res) => {
  try {
    const loads = await Load.find().populate('assignedDriver', 'name email role');
    res.json(loads);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch loads', error: error.message });
  }
};

exports.getMyLoads = async (req, res) => {
  try {
    const loads = await Load.find({ assignedDriver: req.user._id }).populate('assignedDriver', 'name email role');
    res.json(loads);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch your loads', error: error.message });
  }
};

exports.updateLoad = async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };

  if (updates.driverId) {
    updates.assignedDriver = updates.driverId;
    delete updates.driverId;
  }

  // When the admin assigns a driver, mark the load as dispatched automatically.
  if (req.path.endsWith('/assign') && updates.assignedDriver) {
    updates.status = 'Dispatched';
  }

  try {
    const load = await Load.findById(id);
    if (!load) {
      return res.status(404).json({ message: 'Load not found' });
    }

    Object.assign(load, updates);
    await load.save();

    const updatedLoad = await Load.findById(id).populate('assignedDriver', 'name email role');
    res.json(updatedLoad);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update load', error: error.message });
  }
};

exports.deleteLoad = async (req, res) => {
  const { id } = req.params;

  try {
    const load = await Load.findById(id);
    if (!load) {
      return res.status(404).json({ message: 'Load not found' });
    }

    await load.deleteOne();
    res.json({ message: 'Load deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete load', error: error.message });
  }
};
