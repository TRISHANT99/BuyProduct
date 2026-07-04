import Address from "../models/Address.js";

export const saveAddress = async (req, res) => {
  try {
    const address = await Address.create(req.body);
    res.status(201).json({ message: "Address saved successfully", address });
  } catch (err) {
    res.status(500).json({ message: "server not found!", error: err.message });
  }
};

export const getAddresses = async (req, res) => {
  try {
    const address = await Address.find({ userId: req.params.userId });
    res.json(address);
  } catch (err) {
    res.status(500).json({ message: "server not found", error: err.message });
  }
};
