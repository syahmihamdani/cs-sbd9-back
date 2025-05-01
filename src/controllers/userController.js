const userRepository = require('../repositories/userRepository');
const passwordCheck = require('../utils/comparePassword');
const bcrypt = require("bcrypt");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

const registerUser = async (req, res) => {
  const { name, email, password } = req.query;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Name, email, or password missing", payload: null });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: "Wrong format for email", payload: null });
  }
  else if (!passwordRegex.test(password)) {
    return res.status(400).json({ success: false, message: "Password doesn't match criteria: \n - At least one digit \n - At least one special character [@$!%*?&] \n - Minimum 8 characters", payload: null });
  }

  try {
    const newUser = await userRepository.registerUser(name, email, password);
    res.status(201).json({ success: true, message: "User Created", payload: newUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, payload: null });
  }
};


const loginUser = async (req, res) => {
  const { email, password } = req.query;
  if (!email || !password) {
    return res.status(400).json({ succes: false, message: "Email or Password missing", payload: null });
  }
  try {
    const user = await userRepository.loginUser(email);
    if (!user) {
      return res.status(404).json({ succes: false, message: "User not found", payload: null });
    }

    const matchedPassword = await bcrypt.compare(password, user.password);

    if (!matchedPassword) {
      return res.status(401).json({ success: false, message: "Invalid Password." });
    }

    res.status(200).json({ success: true, message: "Login successful", user });

  } catch (err) {
    res.status(500).json({ succes: false, message: err.message, payload: null });
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const user = await userRepository.getUserByEmail(req.params.email);
    if (!user) {
      return res.status(404).json({ succes: false, message: "User not found", payload: null });
    }
    res.json({ succes: true, message: "User found", payload: user });
  } catch (err) {
    res.status(500).json({ succes: false, message: err.message, payload: null });
  }
};

const updateUser = async (req, res) => {
  const { id, name, email, password, balance } = req.body;

  if (!id) {
    return res.status(400).json({ success: false, message: "ID is required", payload: null });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: "Wrong format for email", payload: null });
  }
  else if (!passwordRegex.test(password)) {
    return res.status(400).json({ success: false, message: "Password doesn't match the criteria", payload: null });
  }

  try {
    const updatedUser = await userRepository.updateUser(id, name, email, password, balance);
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found", payload: null });
    }
    res.json({ success: true, message: "User updated", payload: updatedUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, payload: null });
  }
};


const deleteUser = async (req, res) => {
  try {
    const deletedUser = await userRepository.deleteUser(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ succes: false, message: "User not found", payload: null });
    }
    res.json({ succes: true, message: "User deleted", payload: deletedUser });
  } catch (err) {
    res.status(500).json({ succes: false, message: err.message, payload: null });
  }
};

const topUpUser = async (req, res) => {
  const { id, amount } = req.query;

  if (!id) {
    return res.status(400).json({ success: false, message: "ID missing", payload: null });
  }
  if (!amount) {
    return res.status(400).json({ success: false, message: "Amount not specified", payload: null });
  }

  try {
    const topUpAmount = parseFloat(amount);
    if (isNaN(topUpAmount) || topUpAmount <= 0) {
      return res.status(400).json({ success: false, message: "Invalid amount", payload: null });
    }

    const result = await userRepository.topUpUser(id, topUpAmount);

    if (result) {
      return res.status(200).json({ success: true, message: "Balance Added", payload: result });
    } else {
      return res.status(400).json({ success: false, message: "Balance not added. Error", payload: null });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, payload: null });
  }
};


module.exports = { registerUser, loginUser, getUserByEmail, updateUser, deleteUser, topUpUser };
