import User from "../models/User.model.js"

export const updateProfile = async (req, res) => {
  const { name, phone } = req.body;

  req.user.name = name || req.user.name;
  req.user.phone = phone || req.user.phone;

  await req.user.save();

  res.json({
    name: req.user.name,
    phone: req.user.phone,
    email: req.user.email,
    profilePic: req.user.profilePic
  });
};
