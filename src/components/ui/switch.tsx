import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export function Switch({
  checked = false,
  onCheckedChange,
  className,
  disabled,
  ...props
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      data-state={checked ? "checked" : "unchecked"}
      disabled={disabled}
      className={cn(
        "inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-black/10 bg-black/10 p-0.5 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-black/20 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-black",
        className,
      )}
      onClick={() => onCheckedChange?.(!checked)}
      {...props}
    >
      <span
        data-state={checked ? "checked" : "unchecked"}
        className="block size-5 rounded-full bg-white shadow-sm transition-transform data-[state=checked]:translate-x-5"
      />
    </button>
  );
}
