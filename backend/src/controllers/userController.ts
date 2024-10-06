import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { generateAccessToken, generateRefreshToken } from "../models/userModel";
import { User } from "../models/userModel";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import jwt from "jsonwebtoken";
import { access } from "fs";

interface Register extends Request {
  body: {
    name: string;
    lastname: string;
    email: string;
    password: string;
  };
}

interface Login extends Request {
  body: {
    email: string;
    password: string;
  };
}

// refresh access token
const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const cookies = req.cookies;

  if (!cookies?.refreshToken) {
    throw new ApiError(401, "no refresh token provided");
  }

  const refreshToken = cookies.refreshToken;

  try {
    //verifying refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as { _id: string };

    // finding user by id
    const user = await User.findById(decoded._id);

    if (!user) {
      throw new ApiError(401, "user not found --- refreshaccesstoken");
    }

    // generating new access token
    const newAccessToken = generateAccessToken(user);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { accessToken: newAccessToken },
          "access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(403, "invalid or expired refresh token");
  }
});

// signup or register
const register = asyncHandler(async (req: Register, res: Response) => {
  const { name, lastname, email, password } = req.body;

  if (!name || !lastname || !email || !password) {
    throw new ApiError(400, "all feilds are required");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(401, "user alredy exist with this email");
  }

  const user = await User.create({
    name,
    lastname,
    email,
    password,
  });

  const userData = await User.findById(user._id).select("-password");

  if (!userData) {
    throw new ApiError(500, "unable to register");
  }

  const accessToken = generateAccessToken(userData);
  const refreshToken = generateRefreshToken(userData);

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: false,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  };

  res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { userData, accessToken },
        "user created successfully"
      )
    );
});

//  login user
const login = asyncHandler(async (req: Login, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "all feilds required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "user not found");
  }

  const verifyUser = await user.isPasswordCorrect(password);

  if (!verifyUser) {
    throw new ApiError(403, "invalid email or password");
  }

  const userData = await User.findById(user._id).select("-password");

  if (!userData) {
    throw new ApiError(409, "unable to login");
  }

  const accessToken = generateAccessToken(userData);
  const refreshToken = generateRefreshToken(userData);

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: false,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  };

  res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { userData, accessToken },
        "user logged in  successfully"
      )
    );
});

// logout user
const logout = asyncHandler(async (req: Request, res: Response) => {
  const cookies = req.cookies;
  if (!cookies) {
    throw new ApiError(404, "no refresh token");
  }

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(201)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "cookie clear -- user logged out "));
});

// get current user
const getCurrentUser = asyncHandler(async(req:Request, res:Response) => {
  const userData = await User.findById(req.user._id).select("-password")

  return res
  .status(200)
  .json(new ApiResponse(200, {userData}, "user fetched successfully"))
})
export { refreshAccessToken, register, login, logout, getCurrentUser };
