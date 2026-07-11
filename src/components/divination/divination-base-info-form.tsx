"use client";

import type { BirthPlaceSuggestion } from "@/components/divination/birth-place-input";
import { BirthPlaceInput } from "@/components/divination/birth-place-input";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { BirthDivinationInputForm } from "@/lib/divination/schemas";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useI18n } from "@/components/i18n-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DivinationBaseInfoForm({
  form,
  birthDate,
  calendarType,
  isDatePickerOpen,
  onDatePickerOpenChange,
}: {
  form: UseFormReturn<BirthDivinationInputForm>;
  birthDate: string;
  calendarType: BirthDivinationInputForm["calendarType"];
  isDatePickerOpen: boolean;
  onDatePickerOpenChange: (open: boolean) => void;
}) {
  const { t } = useI18n();
  const selectedDate = birthDate ? new Date(`${birthDate}T00:00:00`) : undefined;
  const minBirthMonth = new Date(1900, 0, 1);
  const maxBirthMonth = new Date(new Date().getFullYear() + 1, 11, 1);
  const defaultCalendarMonth = selectedDate ?? new Date(1995, 0, 1);

  return (
    <>
      <section className="space-y-6">
        <div className="space-y-1">
          <h3 className="text-2xl font-semibold tracking-tight text-foreground">{t("form.basicInfo")}</h3>
          <p className="text-sm text-muted-foreground">{t("form.basicInfoHint")}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="subjectName"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>{t("form.name")} *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={t("form.namePlaceholder")} className="h-11 rounded-md" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>{t("form.gender")} *</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="h-11 rounded-md">
                      <SelectValue placeholder={t("form.genderPlaceholder")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">{t("form.male")}</SelectItem>
                    <SelectItem value="female">{t("form.female")}</SelectItem>
                    <SelectItem value="other">{t("form.other")}</SelectItem>
                    <SelectItem value="unknown">{t("form.unknown")}</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </section>

      <section className="space-y-6">
        <div className="space-y-1">
          <h3 className="text-2xl font-semibold tracking-tight text-foreground">{t("form.timeInfo")}</h3>
          <p className="text-sm text-muted-foreground">{t("form.timeInfoHint")}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="calendarType"
              render={({ field }) => (
                <FormItem className="space-y-3 text-sm">
                  <FormLabel>{t("form.birthDate")} *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="h-11 rounded-md">
                        <SelectValue placeholder={t("form.calendarPlaceholder")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="solar">{t("form.solar")}</SelectItem>
                      <SelectItem value="lunar">{t("form.lunar")}</SelectItem>
                    </SelectContent>
                  </Select>

                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field: birthDateField }) => (
                      <FormItem>
                        <Popover open={isDatePickerOpen} onOpenChange={onDatePickerOpenChange}>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                className="h-11 w-full justify-between rounded-md font-normal"
                              >
                                <span className={cn(!selectedDate && "text-muted-foreground")}>
                                  {selectedDate
                                    ? format(selectedDate, "yyyy年MM月dd日", { locale: zhCN })
                                    : t("form.birthDatePlaceholder")}
                                </span>
                                <CalendarIcon className="size-4 opacity-60" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto rounded-xl p-3" align="start">
                            <Calendar
                              mode="single"
                              locale={zhCN}
                              captionLayout="dropdown"
                              navLayout="around"
                              startMonth={minBirthMonth}
                              endMonth={maxBirthMonth}
                              defaultMonth={defaultCalendarMonth}
                              selected={selectedDate}
                              className="rounded-xl border bg-background"
                              onSelect={(date) => {
                                if (!date) {
                                  return;
                                }
                                birthDateField.onChange(format(date, "yyyy-MM-dd"));
                                onDatePickerOpenChange(false);
                              }}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="birthPlace"
              render={({ field }) => (
                <FormItem className="space-y-3 text-sm">
                  <FormLabel>{t("form.birthPlace")} *</FormLabel>
                  <BirthPlaceInput
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    onSelectSuggestion={(suggestion) =>
                      form.setValue("birthPlaceMeta", suggestion as BirthPlaceSuggestion | null, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                    showLabel={false}
                    helperText={null}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-6">
            <FormField
              control={form.control}
              name="birthTime"
              render={({ field }) => (
                <FormItem className="space-y-3 text-sm">
                  <FormLabel>{t("form.birthTime")} *</FormLabel>
                  <FormControl>
                    <Input {...field} type="time" className="h-11 rounded-md" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {calendarType === "lunar" ? (
              <FormField
                control={form.control}
                name="isLeapMonth"
                render={({ field }) => (
                  <FormItem>
                    <label className="flex items-center gap-3 rounded-md border border-border bg-white px-4 py-3 text-sm text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={Boolean(field.value)}
                        onChange={(event) => field.onChange(event.target.checked)}
                      />
                      {t("form.leapMonth")}
                    </label>
                  </FormItem>
                )}
              />
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
