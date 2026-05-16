import { Lunar, Solar } from "lunar-typescript";
import tzLookup from "tz-lookup";
import type { DivinationInput } from "./schemas";

interface ResolvedBirthContext {
  inputSolar: Solar;
  correctedSolar: Solar;
  timezone: string | null;
  longitudeCorrectionMinutes: number;
}

function getDateParts(date: Date, timeZone: string) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(date);
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? "0");

  return {
    year: read("year"),
    month: read("month"),
    day: read("day"),
    hour: read("hour"),
    minute: read("minute"),
    second: read("second"),
  };
}

function resolveTimeZoneOffsetMinutes(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string,
) {
  const localAsUtc = Date.UTC(year, month - 1, day, hour, minute, 0);
  let guessUtc = localAsUtc;

  for (let index = 0; index < 3; index += 1) {
    const zoned = getDateParts(new Date(guessUtc), timeZone);
    const zonedAsUtc = Date.UTC(
      zoned.year,
      zoned.month - 1,
      zoned.day,
      zoned.hour,
      zoned.minute,
      zoned.second,
    );
    guessUtc += localAsUtc - zonedAsUtc;
  }

  return Math.round((localAsUtc - guessUtc) / 60000);
}

function shiftSolarByMinutes(solar: Solar, minutes: number) {
  if (minutes === 0) {
    return solar;
  }

  const [datePart, timePart] = solar.toYmdHms().split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute, second] = timePart.split(":").map(Number);

  const shifted = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
  shifted.setUTCMinutes(shifted.getUTCMinutes() + minutes);

  return Solar.fromYmdHms(
    shifted.getUTCFullYear(),
    shifted.getUTCMonth() + 1,
    shifted.getUTCDate(),
    shifted.getUTCHours(),
    shifted.getUTCMinutes(),
    shifted.getUTCSeconds(),
  );
}

function getInputSolar(input: DivinationInput) {
  const [year, month, day] = input.birthDate.split("-").map(Number);
  const [hour, minute] = input.birthTime.split(":").map(Number);

  if (input.calendarType === "solar") {
    return Solar.fromYmdHms(year, month, day, hour, minute, 0);
  }

  return Lunar.fromYmdHms(year, input.isLeapMonth ? -month : month, day, hour, minute, 0).getSolar();
}

export function resolveBirthContext(input: DivinationInput): ResolvedBirthContext {
  const inputSolar = getInputSolar(input);
  const meta = input.birthPlaceMeta;

  if (!meta) {
    return {
      inputSolar,
      correctedSolar: inputSolar,
      timezone: null,
      longitudeCorrectionMinutes: 0,
    };
  }

  const latitude = Number(meta.lat);
  const longitude = Number(meta.lon);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return {
      inputSolar,
      correctedSolar: inputSolar,
      timezone: null,
      longitudeCorrectionMinutes: 0,
    };
  }

  const timezone = tzLookup(latitude, longitude);
  const offsetMinutes = resolveTimeZoneOffsetMinutes(
    inputSolar.getYear(),
    inputSolar.getMonth(),
    inputSolar.getDay(),
    inputSolar.getHour(),
    inputSolar.getMinute(),
    timezone,
  );
  const standardMeridian = (offsetMinutes / 60) * 15;
  const longitudeCorrectionMinutes = Math.round((longitude - standardMeridian) * 4);

  return {
    inputSolar,
    correctedSolar: shiftSolarByMinutes(inputSolar, longitudeCorrectionMinutes),
    timezone,
    longitudeCorrectionMinutes,
  };
}
