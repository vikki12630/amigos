import dotenv from "dotenv";
import connectDb from "./db/index";
import { app } from "./app";

dotenv.config({
  path: "./.env",
});

connectDb()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`server started on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("MONGO DB connection failed !!!", error);
  });
