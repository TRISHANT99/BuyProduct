import Cart from "../models/Cart.js";

// add item to cart
export const addToCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({
        userId,
        items: [
          {
            productId,
            quantity: 1,
          },
        ],
      });
    } else {
      const item = cart.items.find(
        (item) => item.productId.toString() === productId,
      );
      if (item) {
        item.quantity += 1;
      } else {
        cart.items.push({ productId, quantity: 1 });
      }
    }

    await cart.save();
    res.json({
      message: "item added to cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// removing from cart
export const removeItem = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found!" });
    }
    cart.items = cart.items.filter((i) => i.productId.toString() !== productId);
    await cart.save();
    res.json({
      message: "item removed from cart",
      cart,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
// update iten quantity in cart
export const updateQuantity = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart NOt Found!" });
    }
    const item = cart.items.find((i) => i.productId.toString() === productId);
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }
    item.quantity = quantity;
    await cart.save();
    res.json({
      message: "item quantity updated",
      cart,
    });
  } catch (err) {
    res.status(500).json({ message: "Server not found!", err });
  }
};

// get cart by user id!
export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId }).populate("items.productId");
    if (!cart) {
      return res.json({
        userId,
        items: [],
      });
    }
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: "server Error", error: err.message });
  }
};
