import { Request, Response, NextFunction} from "express"
import jwt from "jsonwebtoken"
import { User } from "../models/userModel"
import { ApiError } from "../utils/ApiError"
import { asyncHandler } from "../utils/asyncHandler"

const verifyJWT = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      (!authHeader.startsWith("Bearer ") && !authHeader.startsWith("bearer "))
    ) {
      throw new ApiError(401, "unauthorized access");
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET as string
      ) as { _id: string };
      const user = await User.findById(decoded._id);

      if (!user) {
        throw new ApiError(404, "user not found");
      }

      req.user = user;
      next();
    } catch (error) {
      throw new ApiError(401, "invalid or expired token");
    }
  }
);

export {verifyJWT}
