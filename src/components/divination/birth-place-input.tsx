"use client";

import { LoaderCircle, MapPin, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export interface BirthPlaceSuggestion {
  id: string;
  label: string;
  shortLabel: string;
  lat: string;
  lon: string;
}

interface BirthPlaceInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelectSuggestion: (suggestion: BirthPlaceSuggestion | null) => void;
  showLabel?: boolean;
  helperText?: string | null;
}

export function BirthPlaceInput({
  value,
  onChange,
  onSelectSuggestion,
  showLabel = true,
  helperText = "支持模糊搜索城市、区县和海外地点，后续可用于更精确的时间换算。",
}: BirthPlaceInputProps) {
  const [suggestions, setSuggestions] = useState<BirthPlaceSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    const keyword = value.trim();

    if (keyword.length < 2) {
      return;
    }

    const controller = new AbortController();

    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/locations/search?q=${encodeURIComponent(keyword)}`, {
          signal: controller.signal,
        });
        const payload = (await response.json().catch(() => null)) as
          | { suggestions?: BirthPlaceSuggestion[] }
          | null;

        setSuggestions(payload?.suggestions ?? []);
        setIsOpen(true);
      } catch {
        if (!controller.signal.aborted) {
          setSuggestions([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [value]);

  function handleSelect(suggestion: BirthPlaceSuggestion) {
    onChange(suggestion.label);
    onSelectSuggestion(suggestion);
    setSuggestions([]);
    setIsOpen(false);
  }

  return (
    <div className="space-y-2 text-sm">
      {showLabel ? <span className="text-muted-foreground">出生地点</span> : null}
      <div
        className="relative"
        onFocus={() => {
          if (closeTimer.current) {
            window.clearTimeout(closeTimer.current);
          }
          if (suggestions.length > 0) {
            setIsOpen(true);
          }
        }}
        onBlur={() => {
          closeTimer.current = window.setTimeout(() => {
            setIsOpen(false);
          }, 120);
        }}
      >
        <Input
          value={value}
          onChange={(event) => {
            const nextValue = event.target.value;
            onChange(nextValue);
            onSelectSuggestion(null);
            if (nextValue.trim().length < 2) {
              setSuggestions([]);
              setIsOpen(false);
              setIsLoading(false);
            } else {
              setIsLoading(true);
            }
          }}
          placeholder="输入城市、区县或国家地区"
          autoComplete="off"
          className="pr-10"
        />
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-muted-foreground">
          {isLoading ? <LoaderCircle className="size-4 animate-spin" /> : <Search className="size-4" />}
        </div>

        {isOpen && suggestions.length > 0 ? (
          <div className="absolute z-20 mt-2 max-h-72 w-full overflow-y-auto rounded-[1.2rem] border border-border bg-white p-2 shadow-[0_18px_36px_-28px_rgba(22,20,17,0.24)]">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                type="button"
                className={cn(
                  "flex w-full items-start gap-3 rounded-[1rem] px-3 py-3 text-left transition hover:bg-muted/70",
                )}
                onClick={() => handleSelect(suggestion)}
              >
                <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span className="text-sm leading-6">{suggestion.label}</span>
              </button>
            ))}
          </div>
        ) : null}
      </div>
      {helperText ? <p className="text-xs leading-6 text-muted-foreground">{helperText}</p> : null}
    </div>
  );
}
