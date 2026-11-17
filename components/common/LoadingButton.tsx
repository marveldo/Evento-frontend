import { forwardRef } from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { Spinner } from "@/components/common/icons";
import { cn } from "@/lib/utils";

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean;
}

export const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ loading = false, disabled, className, children, ...props }, ref) => (
    <Button ref={ref} disabled={disabled || loading} className={cn("gap-x-2", className)} {...props}>
      {loading && <Spinner />}
      {children}
    </Button>
  ),
);
LoadingButton.displayName = "LoadingButton";
