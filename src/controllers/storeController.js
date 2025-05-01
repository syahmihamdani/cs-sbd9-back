const storeRepository = require('../repositories/storeRepository');

const getAllStores = async (req, res) => {
  try {
    const stores = await storeRepository.getAllStores();
    res.json({ succes: true, message: "Stores found", payload: stores });
  } catch (err) {
    res.status(500).json({ succes: false, message: err.message, payload: null });
  }
};

const createStore = async (req, res) => {
  const { name, address } = req.body;
  if (!name || !address) {
    return res.status(400).json({ succes: false, message: "Name or address missing", payload: null });
  }
  try {
    const newStore = await storeRepository.createStore(name, address);
    res.status(201).json({ succes: true, message: "Store created", payload: newStore });
  } catch (err) {
    res.status(500).json({ succes: false, message: err.message, payload: null });
  }
};

const getStoreById = async (req, res) => {
  try {
    const store = await storeRepository.getStoreById(req.params.id);
    if (!store) {
      return res.status(404).json({ succes: false, message: "Store not found", data: null });
    }
    res.json({ succes: true, message: "Store found", data: store });
  } catch (err) {
    res.status(500).json({ succes: false, message: err.message, data: null });
  }
};

const updateStore = async (req, res) => {
  const { id, name, address } = req.body;
  try {
    const updatedStore = await storeRepository.updateStore(id, name, address);
    if (!updatedStore) {
      return res.status(404).json({ succes: false, message: "Store not found", data: null });
    }
    res.json({ succes: true, message: "Store updated", data: updatedStore });
  } catch (err) {
    res.status(500).json({ succes: false, message: err.message, data: null });
  }
};

const deleteStore = async (req, res) => {
  try {
    const deletedStore = await storeRepository.deleteStore(req.params.id);
    if (!deletedStore) {
      return res.status(404).json({ succes: false, message: "Store not found", data: null });
    }
    res.json({ succes: true, message: "Store deleted", data: deletedStore });
  } catch (err) {
    res.status(500).json({ succes: false, message: err.message, data: null });
  }
};

module.exports = { getAllStores, createStore, getStoreById, updateStore, deleteStore };
