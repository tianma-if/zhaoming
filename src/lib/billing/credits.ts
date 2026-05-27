import type { Database } from "@/types/database";

type UserProfile = Database["public"]["Tables"]["users"]["Row"];

export function canConsumeCredits(profile: UserProfile | null) {
  if (!profile) {
    return { allowed: true, reason: "Profile not found yet; allow during bootstrap." };
  }

  if (profile.subscription_status === "active") {
    return { allowed: true, reason: "Active subscription." };
  }

  if (profile.credits > 0) {
    return { allowed: true, reason: "Has remaining credits." };
  }

  return {
    allowed: true,
    reason: "Credits enforcement placeholder; wire billing provider and hard limits later.",
  };
}

export async function reserveDivinationCredits() {
  // TODO: connect billing provider fulfillment + credits deduction workflow here.
  return { reserved: false };
}
