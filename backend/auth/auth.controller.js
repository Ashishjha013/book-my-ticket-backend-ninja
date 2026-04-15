import * as authService from './auth.service.js';

// REGISTER
export const register = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const data = await authService.login(req.body);
    res.status(200).json(data);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message });
  }
};
