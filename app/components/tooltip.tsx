import { Tooltip as TooltipPrimitive } from "@base-ui/react/tooltip";
import * as React from "react";
import { cn } from "@/lib/cn";

type ProviderProps = TooltipPrimitive.Provider.Props & { delayDuration?: number };
export function TooltipProvider({ delayDuration, delay = delayDuration, ...props }: ProviderProps) {
  return <TooltipPrimitive.Provider {...props} delay={delay} />;
}
export const Tooltip = TooltipPrimitive.Root;
type TriggerProps = TooltipPrimitive.Trigger.Props & { asChild?: boolean };
export function TooltipTrigger({ asChild = false, children, render, ...props }: TriggerProps) {
  return (
    <TooltipPrimitive.Trigger
      {...props}
      render={asChild && React.isValidElement(children) ? children : render}
    >
      {asChild ? undefined : children}
    </TooltipPrimitive.Trigger>
  );
}
type ContentProps = TooltipPrimitive.Popup.Props &
  Pick<TooltipPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset">;
export const TooltipContent = React.forwardRef<HTMLDivElement, ContentProps>(
  (
    {
      align = "center",
      alignOffset = 0,
      className,
      children,
      side = "top",
      sideOffset = 4,
      ...props
    },
    ref
  ) => (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        className="isolate z-50"
        side={side}
        sideOffset={sideOffset}
      >
        <TooltipPrimitive.Popup
          {...props}
          ref={ref}
          className={cn(
            "z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground data-open:animate-in data-closed:animate-out",
            className
          )}
        >
          {children}
        </TooltipPrimitive.Popup>
      </TooltipPrimitive.Positioner>
    </TooltipPrimitive.Portal>
  )
);
TooltipContent.displayName = "TooltipContent";
