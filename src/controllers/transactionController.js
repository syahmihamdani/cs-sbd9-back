const transactionRepository = require('../repositories/transactionRepository');
const itemRepository = require('../repositories/itemRepository');

const createTransaction = async (req, res) => {
    const { item_id, quantity, user_id } = req.body;

    if (!item_id) {
        return res.status(400).json({ success: false, message: "item_id missing", payload: null });
    } else if (!quantity) {
        return res.status(400).json({ success: false, message: "quantity not specified", payload: null });
    } else if (!user_id) {
        return res.status(400).json({ success: false, message: "user_id missing", payload: null });
    }

    const parsedQuantity = parseFloat(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
        return res.status(400).json({ success: false, message: "Invalid quantity", payload: null });
    }

    try {
        const item = await itemRepository.getItemById(item_id);
        if (!item) {
            return res.status(400).json({ success: false, message: "item not found", payload: null });
        }
        const price = item.price;
        const total = price * quantity;
        const transaction = await transactionRepository.createTransaction(user_id, item_id, quantity, total);
        res.status(201).json({ success: true, message: "Transaction Created", payload: transaction });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message, payload: null });
    }
};

const payTransaction = async (req, res) => {
    const { id } = req.query;
    if (!id) {
        return res.status(400).json({ success: false, message: "transaction id missing", payload: null });
    }
    try {
        const result = transactionRepository.payTransaction(id);
        res.status(201).json({ success: true, message: "Transaction Paid", payload: result });
    }
    catch {
        res.status(500).json({ success: false, message: err.message, payload: null });

    }
};

const deleteTransaction = async (req, res) => {
    try {
        const deletedTransaction = await transactionRepository.deleteTransaction(req.params.id);
        if (!deletedTransaction) {
            return res.status(404).json({ succes: false, message: "Transaction not found", data: null });
        }
        res.json({ succes: true, message: "Transaction Deleted", payload: deletedTransaction });
    } catch (err) {
        res.status(500).json({ succes: false, message: err.message, payload: null });
    }
};

const getTransactions = async (req, res) => {
    try {
        const transactions = await transactionRepository.getTransactions();

        if (!transactions) {
            return res.status(404).json({ success: false, message: err.message, payload: null });
        }
        res.json({ success: true, message: "Transactions Found", payload: transactions });
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message, payload: null });
    }
}

module.exports = { createTransaction, payTransaction, deleteTransaction, getTransactions }
