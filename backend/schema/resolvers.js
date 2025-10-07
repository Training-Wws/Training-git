const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SECRET = 'secret123';

module.exports = {
  register: async ({ name, email, password, role }) => {   // <-- add role
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error('Email already exists');

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role });  // <-- save role

    const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '1h' });

    return {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }   // <-- include role
    };
  },

  login: async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid password');

    const token = jwt.sign({ userId: user.id }, SECRET, { expiresIn: '1h' });

    return {
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }   // <-- include role
    };
  },

  me: async (args, context) => context.user || null,

  updateProfile: async ({ name, email, password, role }, context) => {
    if (!context.user) throw new Error('Not authenticated');

    const user = await User.findById(context.user.userId);
    if (!user) throw new Error('User not found');

    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (role) user.role = role;

    await user.save();
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }
};
