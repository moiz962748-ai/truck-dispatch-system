const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const mapLoad = (record) => {
  if (!record) return null;

  const assignedDriver = Array.isArray(record.users)
    ? record.users[0] || null
    : record.users || null;

  return {
    ...record,
    id: record.id,
    _id: record.id,
    pickupLocation: record.pickup_location ?? record.pickupLocation,
    dropoffLocation: record.dropoff_location ?? record.dropoffLocation,
    assignedDriver,
    assignedDriverId: record.assigned_driver ?? record.assignedDriver,
  };
};

const getLoadsWithDriver = async (filterColumn, filterValue) => {
  let query = supabase
    .from('loads')
    .select('*, users!assigned_driver(name, email, role)');

  if (filterColumn && filterValue !== undefined) {
    query = query.eq(filterColumn, filterValue);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data || []).map(mapLoad);
};

exports.createLoad = async (req, res) => {
  const { pickupLocation, dropoffLocation, weight, distance, price, assignedDriver } = req.body;
  const numericWeight = Number(weight);
  const numericDistance = Number(distance);
  const calculatedPrice = price ? Number(price) : (numericWeight > 0 && numericDistance > 0 ? numericWeight * numericDistance * 10 : undefined);

  if (!calculatedPrice || Number.isNaN(calculatedPrice)) {
    return res.status(400).json({ message: 'Price could not be calculated. Please provide valid weight and distance.' });
  }

  try {
    const { data, error } = await supabase
      .from('loads')
      .insert([
        {
          pickup_location: pickupLocation,
          dropoff_location: dropoffLocation,
          weight: numericWeight,
          price: calculatedPrice,
          distance: numericDistance,
          assigned_driver: assignedDriver || null,
        },
      ])
      .select('*, users!assigned_driver(name, email, role)')
      .single();

    if (error) throw error;

    res.status(201).json(mapLoad(data));
  } catch (error) {
    res.status(500).json({ message: 'Failed to create load', error: error.message });
  }
};

exports.getLoads = async (req, res) => {
  try {
    const loads = await getLoadsWithDriver();
    res.json(loads);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch loads', error: error.message });
  }
};

exports.getMyLoads = async (req, res) => {
  try {
    const driverId = req.user?.id || req.user?._id;
    const loads = await getLoadsWithDriver('assigned_driver', driverId);
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

  const supabaseUpdates = {};

  Object.entries(updates).forEach(([key, value]) => {
    if (key === 'pickupLocation') {
      supabaseUpdates.pickup_location = value;
    } else if (key === 'dropoffLocation') {
      supabaseUpdates.dropoff_location = value;
    } else if (key === 'assignedDriver') {
      supabaseUpdates.assigned_driver = value;
    } else if (key === 'status') {
      supabaseUpdates.status = value;
    } else if (key === 'weight') {
      supabaseUpdates.weight = value;
    } else if (key === 'distance') {
      supabaseUpdates.distance = value;
    } else if (key === 'price') {
      supabaseUpdates.price = value;
    } else {
      supabaseUpdates[key] = value;
    }
  });

  try {
    const { data, error } = await supabase
      .from('loads')
      .update(supabaseUpdates)
      .eq('id', id)
      .select('*, users!assigned_driver(name, email, role)')
      .single();

    if (error) {
      if (error.message?.includes('No rows') || error.code === 'PGRST116') {
        return res.status(404).json({ message: 'Load not found' });
      }
      throw error;
    }

    res.json(mapLoad(data));
  } catch (error) {
    res.status(500).json({ message: 'Failed to update load', error: error.message });
  }
};

exports.deleteLoad = async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase.from('loads').delete().eq('id', id);

    if (error) throw error;

    res.json({ message: 'Load deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete load', error: error.message });
  }
};
