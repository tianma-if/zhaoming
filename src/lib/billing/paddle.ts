import { createHmac, timingSafeEqual } from "node:crypto";

function parsePaddleSignature(signature: string) {
  const parts = signature.split(";").map((part) => part.trim());
  const timestamp = parts.find((part) => part.startsWith("ts="))?.slice(3) ?? null;
  const hashes = parts
    .filter((part) => part.startsWith("h1="))
    .map((part) => part.slice(3))
    .filter(Boolean);

  return {
    timestamp,
    hashes,
  };
}

export function verifyPaddleWebhookSignature(input: {
  rawBody: string;
  signature: string;
  secret: string;
  toleranceSeconds?: number;
}) {
  const { timestamp, hashes } = parsePaddleSignature(input.signature);

  if (!timestamp || hashes.length === 0) {
    return false;
  }

  const toleranceSeconds = input.toleranceSeconds ?? 5;
  const eventTimestamp = Number(timestamp);

  if (!Number.isFinite(eventTimestamp)) {
    return false;
  }

  const currentTimestamp = Math.floor(Date.now() / 1000);

  if (Math.abs(currentTimestamp - eventTimestamp) > toleranceSeconds) {
    return false;
  }

  const signedPayload = `${timestamp}:${input.rawBody}`;
  const computedHash = createHmac("sha256", input.secret).update(signedPayload).digest("hex");
  const computedBuffer = Buffer.from(computedHash, "utf8");

  return hashes.some((hash) => {
    const receivedBuffer = Buffer.from(hash, "utf8");

    if (receivedBuffer.length !== computedBuffer.length) {
      return false;
    }

    return timingSafeEqual(receivedBuffer, computedBuffer);
  });
}
