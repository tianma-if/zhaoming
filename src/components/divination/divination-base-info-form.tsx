"use client";

import type { BirthPlaceSuggestion } from "@/components/divination/birth-place-input";
import { BirthPlaceInput } from "@/components/divination/birth-place-input";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import { cn } from "@/lib/utils";
import type { DivinationInputForm } from "@/lib/divination/schemas";
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
  form: UseFormReturn<DivinationInputForm>;
  birthDate: string;
  calendarType: DivinationInputForm["calendarType"];
  isDatePickerOpen: boolean;
  onDatePickerOpenChange: (open: boolean) => void;
}) {
  const selectedDate = birthDate ? new Date(`${birthDate}T00:00:00`) : undefined;
  const minBirthMonth = new Date(1900, 0, 1);
  const maxBirthMonth = new Date(new Date().getFullYear() + 1, 11, 1);
  const defaultCalendarMonth = selectedDate ?? new Date(1995, 0, 1);

  return (
    <>
      <section className="space-y-6">
        <div className="space-y-1">
          <h3 className="text-2xl font-semibold tracking-tight text-foreground">基本信息</h3>
          <p className="text-sm text-muted-foreground">先填写最基础的身份信息。</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="subjectName"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>姓名 *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="请输入姓名" className="h-11 rounded-md" />
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
                <FormLabel>性别 *</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="h-11 rounded-md">
                      <SelectValue placeholder="请选择性别" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="male">男</SelectItem>
                    <SelectItem value="female">女</SelectItem>
                    <SelectItem value="other">其他</SelectItem>
                    <SelectItem value="unknown">未知</SelectItem>
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
          <h3 className="text-2xl font-semibold tracking-tight text-foreground">时间信息</h3>
          <p className="text-sm text-muted-foreground">出生时间越准确，排盘结果越稳定。</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="calendarType"
              render={({ field }) => (
                <FormItem className="space-y-3 text-sm">
                  <FormLabel>出生日期 *</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="h-11 rounded-md">
                        <SelectValue placeholder="请选择历法" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="solar">阳历</SelectItem>
                      <SelectItem value="lunar">农历</SelectItem>
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
                                    : "请选择出生日期"}
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
                  <FormLabel>出生地点 *</FormLabel>
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
                  <FormLabel>出生时辰 *</FormLabel>
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
                      当前日期为农历闰月
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
