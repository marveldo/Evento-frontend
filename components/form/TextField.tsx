import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface TextFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "number" | "url";
  disabled?: boolean;
  className?: string;
  labelClassName?: string;
}

export function TextField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  disabled,
  className,
  labelClassName,
}: TextFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel className={cn("font-nunito text-[14px] font-[600] text-[#303030]", labelClassName)}>{label}</FormLabel>}
          <FormControl>
            <Input
              {...field}
              value={field.value ?? ""}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              className={cn("h-[56px] border border-[#EBEBEB]", className)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
