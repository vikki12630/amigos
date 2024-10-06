import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

interface User extends Document {
  name: string;
  lastname: string;
  email: string;
  profileImg: string;
  followers: string[];
  following: string[];
  password: string;
  isPasswordCorrect(password: string): Promise<boolean>;
}

const userSchema = new Schema<User>(
  {
    name: { 
      type: String, 
      required: true 
    },
    lastname: { 
      type: String, 
      required: true 
    },
    email: { 
      type: String,
      unique: true, 
      required: true 
    },
    password: { 
      type: String, 
      required: true 
    },
    profileImg: {
      type: String,
      default: ""
    },
    followers: {
      type: [String],
      default: [],
    },
    following: {
      type: [String],
      default: [],
    }
  },
  { timestamps: true }
);

// hashing password
userSchema.pre<User>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// decrypting password
userSchema.methods.isPasswordCorrect = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

// generate access token
export const generateAccessToken = (user: User): string => {
  return jwt.sign(
    { _id: user._id },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
    }
  );
};

//  generate refresh token
export const generateRefreshToken = (user: User): string => {
  return jwt.sign(
    { _id: user._id },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
    }
  );
};

export const User = mongoose.model<User>("User", userSchema);
