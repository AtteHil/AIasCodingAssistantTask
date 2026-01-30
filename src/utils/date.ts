import { ApiError } from "./errors";

export function parseUtcDate(value: string): Date {
  const date = new Date(value);

  if (isNaN(date.getTime())) {
    throw new ApiError(400, "Virheellinen aikamuoto");
  }

  // Pakota UTC: vaadi Z tai offset
  if (!value.endsWith("Z") && !value.match(/[+-]\d{2}:\d{2}$/)) {
    throw new ApiError(
      400,
      "Ajan täytyy olla UTC-muodossa (esim. 2026-02-01T10:00:00Z)"
    );
  }

  return date;
}