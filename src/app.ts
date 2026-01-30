// src/app.ts
import express from "express";
import bookings from "./routes/bookings";
import { errorHandler } from "./middleware/errorHandler";

export const app = express();
app.use(express.json());

app.use("/bookings", bookings);

app.use(errorHandler);

