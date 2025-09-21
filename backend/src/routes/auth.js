import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const user = new User({ fullname, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
