"use client";

import { createAuthClient } from "better-auth/react";
import { oneTapClient } from "better-auth/client/plugins";
import { useEffect, useMemo, useRef } from "react";
import {
  AuthTransitionOverlay,
  finishAuthTransition,
  startAuthTransition,
} from "@/components/auth/auth-transition-state";

export function GoogleOneTapPrompt({
  callbackURL,
  clientId,
  enabled = true,
}: {
  callbackURL: string;
  clientId: string | null;
  enabled?: boolean;
}) {
  const promptedRef = useRef(false);
  const isLocalhost =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1" ||
      window.location.hostname === "::1");

  const oneTapAuthClient = useMemo(() => {
    if (!clientId) {
      return null;
    }

    return createAuthClient({
      plugins: [
        oneTapClient({
          clientId,
          autoSelect: false,
          cancelOnTapOutside: true,
          context: "signin",
          promptOptions: {
            fedCM: !isLocalhost,
            maxAttempts: 1,
          },
        }),
      ],
    });
  }, [clientId, isLocalhost]);

  useEffect(() => {
    if (!enabled || !oneTapAuthClient || promptedRef.current) {
      return;
    }

    promptedRef.current = true;

    void oneTapAuthClient
      .oneTap({
        callbackURL,
        context: "signin",
        onPromptNotification: (notification) => {
          const dismissedReason = notification?.getDismissedReason?.();
          if (dismissedReason === "credential_returned") {
            startAuthTransition();
            return;
          }

          finishAuthTransition();
        },
      })
      .catch(() => {
        finishAuthTransition();
      });
  }, [callbackURL, clientId, enabled, isLocalhost, oneTapAuthClient]);

  return <AuthTransitionOverlay />;
}
