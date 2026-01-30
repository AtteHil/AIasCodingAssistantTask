// src/routes/bookings.ts
import express from "express";
import { createBooking, cancelBooking, listBookings } from "../services/bookingService";

const router = express.Router();

router.post("/:roomId", async (req, res, next) => {
  try {
    const { startTime, endTime } = req.body;
    const booking = await createBooking(
      req.params.roomId,
      new Date(startTime),
      new Date(endTime)
    );
    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
});

router.delete("/:roomId/:bookingId", (req, res, next) => {
  try {
    cancelBooking(req.params.roomId, req.params.bookingId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

router.get("/:roomId", (req, res) => {
  res.json(listBookings(req.params.roomId));
});

export default router;
