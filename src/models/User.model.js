import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
    },

    password: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: false,
    },

    refreshToken: {
     type: String,
    },

    sheetId:{
      type: String,
      default : null
    },
    profilePic: { 
      type: String, 
      default: "" 
    },

  },
  {
    timestamps: true,
  }
);


const User = mongoose.model("User", userSchema);

export default User;
