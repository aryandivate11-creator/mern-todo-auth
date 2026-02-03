import User from "../models/User.model.js";
export const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id);

  res.json({
    name: user.name || "",
    phone: user.phone || "",
    email: user.email,
    profilePic: user.profilePic || ""
  });
};

export const updateProfile = async (req, res) => {
  try {
    const name = req.body.name || "";
    const phone = req.body.phone || "";

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      name: user.name,
      phone: user.phone,
      email: user.email,
      profilePic: user.profilePic
    });

  } catch (err) {
    console.error("PROFILE UPDATE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


export const uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePic: `/uploads/${req.file.filename}` },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ profilePic: user.profilePic });

  } catch (err) {
    console.error("PHOTO UPLOAD ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};

