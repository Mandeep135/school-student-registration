
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { randomUUID } from 'node:crypto';

dotenv.config();

const app = express();
const PORT = 3001;

const students = new Map();

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.post('/api/register', async (req, res) => {
  try {
    const {
      name,
      email,
      contact,
      gender,
      password,
      confirmPassword
    } = req.body;

    if (
      !name || !email || !contact ||
      !gender || !password || !confirmPassword
    ) {
      return res.status(400).json({
        message: 'All fields are required.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({
        message: 'Invalid email address.'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: 'Passwords do not match.'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: 'Password must contain at least 8 characters.'
      });
    }

    if (students.has(normalizedEmail)) {
      return res.status(409).json({
        message: 'Email already registered.'
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const student = {
      id: randomUUID(),
      name: name.trim(),
      email: normalizedEmail,
      contact,
      gender,
      passwordHash
    };

    students.set(normalizedEmail, student);

    return res.status(201).json({
      message: 'Student registered successfully.'
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Server error during registration.'
    });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({
        message: 'Email and password are required.'
      });
    }

    const student = students.get(email.trim().toLowerCase());

    if (!student) {
      return res.status(401).json({
        message: 'Invalid email or password.'
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      student.passwordHash
    );

    if (!validPassword) {
      return res.status(401).json({
        message: 'Invalid email or password.'
      });
    }

    const token = jwt.sign(
      { id: student.id, email: student.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.json({
      message: 'Login successful.',
      token,
      name: student.name
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Server error during login.'
    });
  }
});



app.get('/api/profile', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Access denied. No token provided.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    return res.status(200).json({
      message: 'Protected route accessed successfully.',
      student: decoded
    });
  } catch (error) {
    return res.status(401).json({
      message: 'Invalid or expired token.'
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
