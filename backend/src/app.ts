import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(
  cors({
    origin:"http://localhost:5173",
    credentials:true
  })
);

app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

app.use(cookieParser());

//import routes
import userRoutes from "./routes/userRoutes"

// routes declaration
app.use("/api/v1/users", userRoutes)

export { app };
