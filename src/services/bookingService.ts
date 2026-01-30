// src/services/bookingService.ts
import { Booking } from "../models/Booking";
import { ApiError } from "../utils/errors";
import { Mutex } from "../utils/mutex";
import { randomUUID } from "crypto";

const bookingsByRoom = new Map<string, Booking[]>();
const roomLocks = new Map<string, Mutex>();

function getRoomLock(roomId: string): Mutex {
  if (!roomLocks.has(roomId)) {
    roomLocks.set(roomId, new Mutex());
  }
  return roomLocks.get(roomId)!;
}

export async function createBooking(
  roomId: string,
  startTime: Date,
  endTime: Date
): Promise<Booking> {

  if (startTime >= endTime) {
    throw new ApiError(400, "Aloitusajan täytyy olla ennen lopetusaikaa");
  }

  if (startTime < new Date()) {
    throw new ApiError(400, "Varaus ei voi olla menneisyydessä");
  }

  const lock = await getRoomLock(roomId).lock();

  try {
    const roomBookings = bookingsByRoom.get(roomId) || [];

    const overlap = roomBookings.some(b =>
      startTime < b.endTime && endTime > b.startTime
    );

    if (overlap) {
      throw new ApiError(409, "Huone on jo varattu kyseiselle ajalle");
    }

    const booking: Booking = {
      id: randomUUID(),
      roomId,
      startTime,
      endTime
    };

    roomBookings.push(booking);
    bookingsByRoom.set(roomId, roomBookings);

    return booking;
  } finally {
    lock();
  }
}

export function cancelBooking(roomId: string, bookingId: string) {
  const bookings = bookingsByRoom.get(roomId);
  if (!bookings) {
    throw new ApiError(404, "Varausta ei löytynyt");
  }

  const index = bookings.findIndex(b => b.id === bookingId);
  if (index === -1) {
    throw new ApiError(404, "Varausta ei löytynyt");
  }

  bookings.splice(index, 1);
}

export function listBookings(roomId: string): Booking[] {
  return bookingsByRoom.get(roomId) || [];
}
