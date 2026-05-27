"use client";

import { initializePaddle, type Environments, type Paddle } from "@paddle/paddle-js";

let paddlePromise: Promise<Paddle | undefined> | null = null;

export function getPaddleClient(token: string, environment: Environments) {
  if (!paddlePromise) {
    paddlePromise = initializePaddle({
      token,
      environment,
    });
  }

  return paddlePromise;
}
