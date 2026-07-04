import Product from "../models/product.js";

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.json({
      message: "Product created successfully",
      product,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", err });
  }
};

export const getProducts = async (req, res) => {
  try {
    const { search, category } = req.query;

    let filter = {};
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }
    if (category) {
      filter.category = category;
    }
    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json(products);
  } catch (e) {
    res.status(500).json({ message: "Server Error", e });
  }
};
export const updateProduct = async (req, res) => {
  try {
    const update = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({
      message: "product updates successfully",
      update,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", err });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error", err });
  }
};
