import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, //  Cloudinary URL
      required: true,
    },
    coverImage: {
      type: String, //  Cloudinary URL
    },
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

//  (Pre-save Hook) For Password Hashing before saving user
userSchema.pre("save", async function (next) {
  // if password is not modified, skip hashing and  go to next()
  if (!this.isModified("password")) return next();

  // if password is modified, hash it
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Custom Method Design For Compare normal & hashed password
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
}; // password (normal) given by user & this.password (hashed) which is encrypted

// Custom Method Design For Generate Access & Refresh Token
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      //(Payload)  Include user information
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

export const User = mongoose.model("User", userSchema);
