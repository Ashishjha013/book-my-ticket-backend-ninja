import pool from '../db/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const asHttpError = (message, status) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const isValidEmail = (email) => /.+@.+\..+/.test(email);

// REGISTER
export const register = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw asHttpError('Name, email and password are required', 400);
  }

  if (password.length < 6) {
    throw asHttpError('Password must be at least 6 characters', 400);
  }

  const normalizedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedName || !isValidEmail(normalizedEmail)) {
    throw asHttpError('Please provide valid name and email', 400);
  }

  // 1. check if user already exists
  const existingUser = await pool.query('SELECT * FROM users WHERE email=$1', [normalizedEmail]);

  if (existingUser.rows.length > 0) {
    throw asHttpError('User already exists', 409);
  }

  // 2. hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. insert user
  const result = await pool.query(
    'INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING id, name, email',
    [normalizedName, normalizedEmail, hashedPassword],
  );

  return result.rows[0];
};

// LOGIN
export const login = async ({ email, password }) => {
  if (!email || !password) {
    throw asHttpError('Email and password are required', 400);
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!isValidEmail(normalizedEmail)) {
    throw asHttpError('Please provide a valid email', 400);
  }

  // 1. find user
  const result = await pool.query('SELECT * FROM users WHERE email=$1', [normalizedEmail]);

  const user = result.rows[0];

  if (!user) {
    throw asHttpError('User not found', 404);
  }

  // 2. compare password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw asHttpError('Invalid credentials', 401);
  }

  if (!process.env.JWT_SECRET) {
    throw asHttpError('Server misconfiguration: JWT secret missing', 500);
  }

  // 3. generate token
  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    token,
  };
};
