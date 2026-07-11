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
import { useI18n } from "@/components/i18n-provider";

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
  helperText,
}: BirthPlaceInputProps) {
  const { t } = useI18n();
  const resolvedHelperText = helperText === undefined ? t("form.placeHint") : helperText;
  const [suggestions, setSuggestions] = useState<BirthPlaceSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const trimmed = query.trim();

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
  }, [isOpen, query]);

  function handleSelect(suggestion: BirthPlaceSuggestion) {
    setQuery(suggestion.label);
    onChange(suggestion.label);
    onSelectSuggestion(suggestion);
    setSuggestions([]);
    setIsOpen(false);
  }

  return (
    <div className="space-y-2 text-sm">
      {showLabel ? <span className="text-muted-foreground">{t("form.birthPlace")}</span> : null}
      <Popover
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);

          if (open) {
            setQuery(value);
            setSuggestions([]);
            setIsLoading(false);
            return;
          }

          setQuery(value);
          setSuggestions([]);
          setIsLoading(false);
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className="h-13 w-full justify-between rounded-2xl px-5 text-base font-normal"
          >
            <span className={cn("truncate", !value && "text-muted-foreground")}>
              {value || t("form.searchPlace")}
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
              value={query}
              onValueChange={(nextValue) => {
                setQuery(nextValue);
                onChange(nextValue);
                onSelectSuggestion(null);
                if (nextValue.trim().length < 2) {
                  setSuggestions([]);
                  setIsLoading(false);
                } else {
                  setIsLoading(true);
                }
              }}
              placeholder={t("form.placePlaceholder")}
            />
            <CommandList>
              <CommandEmpty>{t("form.placeEmpty")}</CommandEmpty>
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
                        query === suggestion.label ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {resolvedHelperText ? <p className="text-xs leading-6 text-muted-foreground">{resolvedHelperText}</p> : null}
    </div>
  );
}
