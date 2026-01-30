// src/app.ts
import express from "express";
import { Request, Response, NextFunction } from "express";
import bookings from "./routes/bookings";
import { ApiError } from "./utils/errors";

export const app = express();
app.use(express.json());

app.use("/bookings", bookings);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ error: err.message });
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});
