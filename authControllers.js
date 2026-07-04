import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "user already exixts" });
    }
    //hash Password
    const hashPassword = await bcrypt.hash(password, 10);

    //create user
    await User.create({ name, email, password: hashPassword });

    res.json({ message: "User registered successfully" });
  } catch (e) {
    res.status(500).json({ message: "Server error", e });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({
        message: "invalid credentials",
      });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      message: "login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (e) {
    res.status(500).json({ message: "Server error", e });
  }
};

