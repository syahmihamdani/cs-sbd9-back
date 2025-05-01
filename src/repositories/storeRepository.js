const pool = require('../database/db');

const getAllStores = async () => {
  const result = await pool.query('SELECT * FROM stores');
  return result.rows;
};

const createStore = async (name, address) => {
  const result = await pool.query(
    'INSERT INTO stores(name, address) VALUES($1, $2) RETURNING *', [name, address]);
  return result.rows[0];
};

const getStoreById = async (id) => {
  const result = await pool.query('SELECT * FROM stores WHERE id = $1', [id]);
  return result.rows[0];
};

const updateStore = async (id, name, address) => {
  const result = await pool.query(
    'UPDATE stores SET name = $1, address = $2 WHERE id = $3 RETURNING *', [name, address, id]);
  return result.rows[0];
};

const deleteStore = async (id) => {
  const result = await pool.query('DELETE FROM stores WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

module.exports = { getAllStores, createStore, getStoreById, updateStore, deleteStore };
