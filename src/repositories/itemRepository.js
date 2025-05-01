const pool = require('../database/db');

const createItem = async (itemData) => {
    try {
        const { name, price, store_id, image_url, stock } = itemData;

        const query = `
            INSERT INTO items (name, price, store_id, image_url, stock)
            VALUES ($1, $2, $3, $4, $5) RETURNING *;
        `;

        const values = [name, price, store_id, image_url, stock];
        const result = await pool.query(query, values);

        return result.rows[0];
    } catch (error) {
        throw new Error("Database Insertion Failed");
    }
};

const getAllItems = async () => {
    const result = await pool.query(`
        SELECT items.*, stores.name AS store_name
        FROM items
        JOIN stores ON items.store_id = stores.id
      `);
          return result.rows;
};

const getItemById = async (id) => {
    const result = await pool.query('SELECT * FROM items WHERE id = $1', [id]);
    return result.rows[0];
};

const getItemByStoreId = async (store_id) => {
    const result = await pool.query('SELECT * FROM items WHERE store_id = $1', [store_id]);
    return result.rows;
};

const updateItem = async (itemData) => {
    const { id, name, price, store_id, image_url, stock } = itemData;

    try {
        const query = `
            UPDATE items 
            SET name = $1, price = $2, store_id = $3, image_url = $4, stock = $5
            WHERE id = $6 
            RETURNING *;
        `;

        const values = [name, price, store_id, image_url, stock, id];
        const result = await pool.query(query, values);

        return result.rows[0];
    } catch (error) {
        console.error("Error updating item:", error);
        throw new Error("Database Update Failed");
    }
};

const deleteItem = async (id) => {
    const result = await pool.query('DELETE FROM items WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
};

module.exports = { createItem, getAllItems, getItemById, getItemByStoreId, updateItem, deleteItem };
