import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";
import * as React from "react";
import { cn } from "@/lib/cn";

type SeparatorProps = SeparatorPrimitive.Props & { decorative?: boolean };
export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, decorative = true, orientation = "horizontal", role, ...props }, ref) => (
    <SeparatorPrimitive
      {...props}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className
      )}
      orientation={orientation}
      ref={ref}
      role={decorative ? "none" : role}
    />
  )
);
Separator.displayName = "Separator";
