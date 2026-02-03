import User from "../models/User.model.js";
export const getProfile = (req, res) => {
  res.json({
    name: req.user.name || "",
    email: req.user.email,
    phone: req.user.phone || "",
    profilePic: req.user.profilePic || ""
  });
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: name || "",
        phone: phone || ""
      },
      { new: true, runValidators: true }
    );

    res.json({
      name: user.name,
      phone: user.phone,
      email: user.email,
      profilePic: user.profilePic
    });

  } catch (err) {
    console.error("PROFILE UPDATE ERROR:", err);
    res.status(500).json({ message: "Profile update failed" });
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

    res.json({ profilePic: user.profilePic });

  } catch (err) {
    console.error("PHOTO UPLOAD ERROR:", err);
    res.status(500).json({ message: "Upload failed" });
  }
};

