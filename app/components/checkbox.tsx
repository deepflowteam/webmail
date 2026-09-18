import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { Check } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/cn";

type CheckedState = boolean | "indeterminate";
type CheckboxProps = Omit<
  CheckboxPrimitive.Root.Props,
  "checked" | "defaultChecked" | "onCheckedChange"
> & {
  checked?: CheckedState;
  defaultChecked?: CheckedState;
  onCheckedChange?: (checked: CheckedState) => void;
};

export const Checkbox = React.forwardRef<HTMLElement, CheckboxProps>(
  ({ checked, className, defaultChecked, onCheckedChange, ...props }, ref) => (
    <CheckboxPrimitive.Root
      {...props}
      checked={checked === true}
      className={cn(
        "peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring data-disabled:cursor-not-allowed data-disabled:opacity-50 data-checked:bg-primary data-checked:text-primary-foreground",
        className
      )}
      defaultChecked={defaultChecked === true}
      indeterminate={checked === "indeterminate" || defaultChecked === "indeterminate"}
      nativeButton
      render={<button type="button" />}
      onCheckedChange={(next) => onCheckedChange?.(next)}
      ref={ref}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        <Check className="h-3.5 w-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
);
Checkbox.displayName = "Checkbox";
