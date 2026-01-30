import { createSheetForUser } from "../utils/googleSheets.js";
import User from "../models/User.model.js"

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      name: user.name || "",
      email: user.email,
      phone: user.phone || "",
      sheetConnected: Boolean(user.sheetId),
      sheetId: user.sheetId,
    });
  } catch (error) {
    console.error("Profile error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

export const connectSheet = async (req, res) => {
  try {
    const { accessToken } = req.body;

    const sheetId = await createSheetForUser(
      accessToken,
      req.user.email
    );

    req.user.sheetId = sheetId;
    await req.user.save();

    res.json({ message: "Sheet connected", sheetId });
  } catch (err) {
    res.status(500).json({ message: "Failed to connect sheet" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    // const { name, phone } = req.body;

   const updates = {};

    if (req.body.name !== undefined) updates.name = req.body.name;
    if (req.body.phone !== undefined) updates.phone = req.body.phone;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true }
    );

    res.json({
      name: user.name,
      email: user.email,
      phone: user.phone,
      sheetConnected: !!user.sheetId,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};
