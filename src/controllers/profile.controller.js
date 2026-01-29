import { createSheetForUser } from "../utils/googleSheets.js";

export const getProfile = (req, res) => {
  res.json({
    name: req.user.name || "",
    email: req.user.email,
    phone: req.user.phone || "",
    sheetConnected: Boolean(req.user.sheetId),
    sheetId: req.user.sheetId,
  });
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
