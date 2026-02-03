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

    if (name !== undefined) req.user.name = name;
    if (phone !== undefined) req.user.phone = phone;

    await req.user.save();

    res.json({
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      profilePic: req.user.profilePic || ""
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Profile update failed" });
  }
};
