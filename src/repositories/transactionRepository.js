const pool = require('../database/db');

const createTransaction = async (user_id, item_id, quantity, total) => {
  const result = await pool.query(
    'INSERT INTO transactions(user_id, item_id, quantity, total) VALUES($1, $2, $3, $4) RETURNING *', [user_id, item_id, quantity, total]);
  return result.rows[0];
}

const payTransaction = async (id) => {
  try {
    const transaction = await pool.query(
      "SELECT * FROM transactions WHERE id = $1 AND status = 'pending'",
      [id]
    );

    if (transaction.rowCount === 0) {
      throw new Error("Transaction not found or paid already.");
    }

    const { item_id, user_id, quantity, total } = transaction.rows[0];

    const item = await pool.query(
      "SELECT * FROM items WHERE id = $1",
      [item_id]
    );
    if (item.rowCount === 0 || item.rows[0].stock < quantity) {
      throw new Error("Stock insufficient.");
    }

    const user = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [user_id]
    );
    if (user.rowCount === 0 || user.rows[0].balance < total) {
      throw new Error("User balance insufficient.");
    }

    await pool.query(
      "UPDATE items SET stock = stock - $1 WHERE id = $2",
      [quantity, item_id]
    );

    await pool.query(
      "UPDATE users SET balance = balance - $1 WHERE id = $2",
      [total, user_id]
    );

    const paidTransaction = await pool.query(
      "UPDATE transactions SET status = 'paid' WHERE id = $1 RETURNING *",
      [id]
    );

    return paidTransaction.rows[0];

  } catch (error) {
    throw error;
  }
}

const deleteTransaction = async (id) => {
  const result = await pool.query(
    'DELETE FROM transactions WHERE id = $1 RETURNING *', [id]
  )
  return result.rows[0];
}

const getTransactions = async () => {
  try {
      const result = await pool.query(`
          SELECT 
              t.*,
              json_build_object(
                  'id', u.id,
                  'name', u.name,
                  'email', u.email,
                  'password', u.password,
                  'balance', u.balance,
                  'created_at', u.created_at
              ) AS user,
              json_build_object(
                  'id', i.id,
                  'name', i.name,
                  'price', i.price,
                  'store_id', i.store_id,
                  'image_url', i.image_url,
                  'stock', i.stock,
                  'created_at', i.created_at
              ) AS item
          FROM transactions t
          JOIN users u ON t.user_id = u.id
          JOIN items i ON t.item_id = i.id
      `);
      
      return result.rows;
  } catch (error) {
      throw error;
  }
}


module.exports = { createTransaction, deleteTransaction, payTransaction, getTransactions }