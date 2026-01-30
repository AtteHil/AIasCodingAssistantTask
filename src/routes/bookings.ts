// src/routes/bookings.ts
import express from "express";
import { createBooking, cancelBooking, listBookings } from "../services/bookingService";
import { parseUtcDate } from "../utils/date";
const router = express.Router();

router.post("/:roomId", async (req, res, next) => {
  try {
    const startTime = parseUtcDate(req.body.startTime);
    const endTime = parseUtcDate(req.body.endTime);

    const booking = await createBooking(
      req.params.roomId,
      startTime,
      endTime
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
