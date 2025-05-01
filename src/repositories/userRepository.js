const pool = require('../database/db');
const bcrypt = require("bcrypt");

const registerUser = async (name, email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'INSERT INTO users(name, email, password) VALUES($1, $2, $3) RETURNING *', [name, email, hashedPassword]
  );
  return result.rows[0];
};

const loginUser = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

const getUserByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

const updateUser = async (id, name, email, password, balance) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'UPDATE users SET name = $1, email = $2, password = $3, balance = $4 WHERE id = $5 RETURNING *', [name, email, hashedPassword, balance, id]
  );
  return result.rows[0];
};

const deleteUser = async (id) => {
  const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

const topUpUser = async (id, amount) => {
  const result = await pool.query("UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING *", [amount, id]);
  return result.rows[0];
};


module.exports = {registerUser, loginUser, getUserByEmail, updateUser, deleteUser, topUpUser};
