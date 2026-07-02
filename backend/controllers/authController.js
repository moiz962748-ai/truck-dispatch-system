const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id || user._id,
      role: user.role,
    },
    process.env.JWT_SECRET || 'defaultsecret',
    { expiresIn: '7d' }
  );
};

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const normalizedEmail = email.toLowerCase();

    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', normalizedEmail)
      .single();

    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const role = normalizedEmail === 'admin@gmail.com' ? 'admin' : 'driver';

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          name,
          email: normalizedEmail,
          password: hashedPassword,
          role,
        },
      ])
      .select();

    if (error) {
      throw error;
    }

    const newUser = data[0];
    const token = generateToken(newUser);

    return res.status(201).json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const normalizedEmail = email.toLowerCase();
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', normalizedEmail)
      .single();

    if (error || !user) {
      return res.status(400).json({ message: 'Invalid Email or Password' });
    }

    let isMatch = false;
    if (user.password === password) {
      isMatch = true;
    } else {
      try {
        isMatch = await bcrypt.compare(password, user.password);
      } catch (e) {
        isMatch = false;
      }
    }

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Email or Password' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};