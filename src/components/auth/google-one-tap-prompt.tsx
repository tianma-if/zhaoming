"use client";

import { createAuthClient } from "better-auth/react";
import { oneTapClient } from "better-auth/client/plugins";
import { useEffect, useMemo, useRef } from "react";

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
            maxAttempts: 1,
          },
        }),
      ],
    });
  }, [clientId]);

  useEffect(() => {
    if (!enabled || !oneTapAuthClient || promptedRef.current) {
      return;
    }

    promptedRef.current = true;

    void oneTapAuthClient.oneTap({
      callbackURL,
      context: "signin",
      onPromptNotification: (notification) => {
        if (process.env.NODE_ENV === "development") {
          console.info("Google One Tap prompt was not displayed or was dismissed.", notification);
        }
      },
    });
  }, [callbackURL, enabled, oneTapAuthClient]);

  return null;
}
