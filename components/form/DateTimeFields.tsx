"use client";

import { forwardRef } from "react";
import { format, startOfToday } from "date-fns";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TimePicker } from "@/components/ui/TimePicker/time-picker";
import { cn } from "@/lib/utils";

interface PickerFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  disabled?: boolean;
}

interface PickerButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  empty: boolean;
  label: string;
}

const PickerButton = forwardRef<HTMLButtonElement, PickerButtonProps>(({ empty, label, className, ...props }, ref) => (
  <Button
    ref={ref}
    type="button"
    variant="outline"
    className={cn("flex h-[56px] items-center justify-start rounded-[8px] text-left font-normal", empty && "text-muted-foreground", className)}
    {...props}
  >
    {label}
    <ChevronDownIcon className="ms-auto size-4" />
  </Button>
));
PickerButton.displayName = "PickerButton";

export function DateField<T extends FieldValues>({ control, name, disabled }: PickerFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <PickerButton
                  empty={!field.value}
                  label={field.value ? format(field.value, "PPP") : "Pick a date"}
                  className="max-w-[178px] md:max-w-[228px]"
                  disabled={disabled}
                />
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={(day) => day && field.onChange(day)}
                disabled={(day) => day < startOfToday()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function TimeField<T extends FieldValues>({ control, name, disabled }: PickerFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <PickerButton
                  empty={!field.value}
                  label={field.value ? format(field.value, "hh:mm a") : "Pick a time"}
                  className="max-w-[128px] md:max-w-[156px]"
                  disabled={disabled}
                />
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4">
              <TimePicker date={field.value ?? new Date(new Date().setHours(0, 0, 0, 0))} setDate={(time) => time && field.onChange(time)} />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export function DateTimeRow<T extends FieldValues>({
  label,
  control,
  dateName,
  timeName,
  disabled,
}: {
  label: string;
  control: Control<T>;
  dateName: FieldPath<T>;
  timeName: FieldPath<T>;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center">
      <h3 className="me-auto font-montserrat text-[20px] font-[600]">{label}</h3>
      <div className="flex gap-x-2">
        <DateField control={control} name={dateName} disabled={disabled} />
        <TimeField control={control} name={timeName} disabled={disabled} />
      </div>
    </div>
  );
}
