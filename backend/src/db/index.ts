import mongoose from "mongoose";
import { DB_NAME } from "../constant";

const connectDb = async (): Promise<void> => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}${DB_NAME}`);
    console.log("\nMONGO_DB CONNECTED!!!");
  } catch (error) {
    console.error("\nMONGO_DB CONNECTION FAILED", error);
    process.exit(1);
  }
};

export default connectDb;
