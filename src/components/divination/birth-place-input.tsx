"use client";

import { Check, ChevronsUpDown, LoaderCircle, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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

  useEffect(() => {
    const trimmed = value.trim();

    if (trimmed.length < 2) {
      return;
    }

    const controller = new AbortController();

    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(`/api/locations/search?q=${encodeURIComponent(trimmed)}`, {
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
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className="h-13 w-full justify-between rounded-2xl px-5 text-base font-normal"
          >
            <span className={cn("truncate", !value && "text-muted-foreground")}>
              {value || "搜索并选择出生地"}
            </span>
            {isLoading ? (
              <LoaderCircle className="size-4 shrink-0 animate-spin opacity-60" />
            ) : (
              <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              value={value}
              onValueChange={(nextValue) => {
                onChange(nextValue);
                onSelectSuggestion(null);
                if (nextValue.trim().length < 2) {
                  setSuggestions([]);
                  setIsLoading(false);
                } else {
                  setIsLoading(true);
                }
              }}
              placeholder="输入城市、区县或国家地区"
            />
            <CommandList>
              <CommandEmpty>输入至少 2 个字开始搜索</CommandEmpty>
              <CommandGroup>
                {suggestions.map((suggestion) => (
                  <CommandItem
                    key={suggestion.id}
                    value={suggestion.label}
                    onSelect={() => handleSelect(suggestion)}
                    className="items-start"
                  >
                    <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                    <span className="flex-1 leading-6">{suggestion.label}</span>
                    <Check
                      className={cn(
                        "mt-0.5 size-4 shrink-0",
                        value === suggestion.label ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {helperText ? <p className="text-xs leading-6 text-muted-foreground">{helperText}</p> : null}
    </div>
  );
}
