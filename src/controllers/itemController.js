const axios = require("axios");
const FormData = require("form-data");
const stream = require("stream");
const itemRepository = require("../repositories/itemRepository");

const createItem = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "Missing image file" });
    }


    try {
        const formData = new FormData();
        const bufferStream = new stream.PassThrough();
        bufferStream.end(req.file.buffer);

        formData.append("file", bufferStream, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });

        const imageResponse = await axios.post(
            process.env.BASE_URL_ZIPLINE + "/api/upload",
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    Authorization: process.env.TOKEN_ZIPLINE,
                },
            }
        );

        let imageUrl = imageResponse.data.files;

        if (typeof imageUrl === "string") {
            try {
                imageUrl = JSON.parse(imageUrl);
            } catch (err) {
                console.warn("Failed to parse image URL, using raw string.");
            }
        }

        if (typeof imageUrl === "object") {
            imageUrl = Object.values(imageUrl)[0];
        }

        const itemData = {
            name: req.body.name,
            price: req.body.price,
            store_id: req.body.store_id,
            image_url: imageUrl,
            stock: req.body.stock,
        };

        const newItem = await itemRepository.createItem(itemData);

        res.status(200).json({ message: "Item created successfully", data: newItem });

    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
};

const getAllItems = async (req, res) => {
    try {
        const items = await itemRepository.getAllItems();

        if (!items || items.length === 0) {
            return res.status(404).json({ success: false, message: "No items found", payload: [] });
        }

        res.json({ success: true, message: "Items found", payload: items });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message, payload: null });
    }
};

const getItemById = async (req, res) => {
    try {
        const item = await itemRepository.getItemById(req.params.id);
        if (!item) {
            return res.status(404).json({ succes: false, message: "Item not found", data: null });
        }
        res.json({ succes: true, message: "Item found", data: item });
    } catch (err) {
        res.status(500).json({ succes: false, message: err.message, data: null });
    }
};

const getItemByStoreId = async (req, res) => {
    try {
        const items = await itemRepository.getItemByStoreId(req.params.store_id);
        if (!items || items.length === 0) {
            return res.status(404).json({ succes: false, message: "Items not found", data: null });
        }
        res.json({ succes: true, message: "Items found", data: items });
    } catch (err) {
        res.status(500).json({ succes: false, message: err.message, data: null });
    }
};

const updateItem = async (req, res) => {
    try {
        const { id, name, price, store_id, stock } = req.body;


        const existingItem = await itemRepository.getItemById(id);
        if (!existingItem) {
            return res.status(404).json({ success: false, message: "Item not found", data: null });
        } else {
            console.log("Found item:", existingItem);
        }

        let imageUrl = existingItem.image_url;

        if (req.file) {
            const formData = new FormData();
            const bufferStream = new stream.PassThrough();
            bufferStream.end(req.file.buffer);

            formData.append("file", bufferStream, {
                filename: req.file.originalname,
                contentType: req.file.mimetype,
            });

            const imageResponse = await axios.post(
                process.env.BASE_URL_ZIPLINE + "/api/upload",
                formData,
                {
                    headers: {
                        ...formData.getHeaders(),
                        Authorization: process.env.TOKEN_ZIPLINE,
                    },
                }
            );

            let newImageUrl = imageResponse.data.files;

            if (typeof newImageUrl === "string") {
                try {
                    newImageUrl = JSON.parse(newImageUrl);
                } catch (err) {
                    console.warn("Failed to parse image URL, using raw string.");
                }
            }

            if (typeof newImageUrl === "object") {
                newImageUrl = Object.values(newImageUrl)[0];
            }

            imageUrl = newImageUrl;
        }

        const updatedItemData = {
            id,
            name: name || existingItem.name,
            price: price || existingItem.price,
            store_id: store_id || existingItem.store_id,
            image_url: imageUrl,
            stock: stock || existingItem.stock,
        };

        const updatedItem = await itemRepository.updateItem(updatedItemData);

        res.status(200).json({ success: true, message: "Item updated successfully", data: updatedItem });

    } catch (err) {
        console.error("Error updating item:", err);
        res.status(500).json({ success: false, message: "Internal Server Error", details: err.message });
    }
};

const deleteItem = async (req, res) => {
    try {
        const deletedItem = await itemRepository.deleteItem(req.params.id);
        if (!deletedItem) {
            return res.status(404).json({ succes: false, message: "Item to be deleted not found", data: null });
        }
        res.json({ succes: true, message: "Item successfully deleted", data: deletedItem });
    } catch (err) {
        res.status(500).json({ succes: false, message: err.message, data: null });
    }
};


module.exports = { createItem, getAllItems, getItemById, getItemByStoreId, updateItem, deleteItem };
