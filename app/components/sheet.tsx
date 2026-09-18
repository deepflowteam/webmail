import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/cn";

export const Sheet = SheetPrimitive.Root;
export const SheetPortal = SheetPrimitive.Portal;
type Composed<T extends { children?: React.ReactNode; render?: unknown }> = T & {
  asChild?: boolean;
};
export function SheetTrigger({
  asChild = false,
  children,
  render,
  ...props
}: Composed<SheetPrimitive.Trigger.Props>) {
  return (
    <SheetPrimitive.Trigger
      {...props}
      render={asChild && React.isValidElement(children) ? children : render}
    >
      {asChild ? undefined : children}
    </SheetPrimitive.Trigger>
  );
}
export function SheetClose({
  asChild = false,
  children,
  render,
  ...props
}: Composed<SheetPrimitive.Close.Props>) {
  return (
    <SheetPrimitive.Close
      {...props}
      render={asChild && React.isValidElement(children) ? children : render}
    >
      {asChild ? undefined : children}
    </SheetPrimitive.Close>
  );
}
type ContentProps = SheetPrimitive.Popup.Props & {
  overlayClassName?: string;
  side?: "left" | "right";
  onOpenAutoFocus?: (event: { preventDefault(): void }) => void;
};
export const SheetContent = React.forwardRef<HTMLDivElement, ContentProps>(
  (
    {
      className,
      children,
      overlayClassName,
      side = "right",
      onOpenAutoFocus,
      initialFocus,
      ...props
    },
    ref
  ) => (
    <SheetPortal>
      <SheetPrimitive.Backdrop
        className={cn(
          "fixed inset-0 z-50 bg-foreground/25 data-closed:animate-overlay-out data-open:animate-overlay-in motion-reduce:animate-none",
          overlayClassName
        )}
      />
      <SheetPrimitive.Popup
        {...props}
        ref={ref}
        initialFocus={
          onOpenAutoFocus
            ? () => {
                let prevented = false;
                onOpenAutoFocus({
                  preventDefault: () => {
                    prevented = true;
                  }
                });
                return !prevented;
              }
            : initialFocus
        }
        className={cn(
          "fixed inset-y-0 z-50 w-[min(92vw,480px)] bg-background p-5 shadow-lg motion-reduce:animate-none",
          side === "left"
            ? "left-0 border-r data-closed:animate-sheet-out-left data-open:animate-sheet-in-left"
            : "right-0 border-l max-md:pb-[max(1.25rem,env(safe-area-inset-bottom))] max-md:pt-[max(1.25rem,env(safe-area-inset-top))] data-closed:animate-sheet-out-right data-open:animate-sheet-in-right",
          className
        )}
      >
        {children}
        <SheetPrimitive.Close
          className={cn(
            "absolute right-3 top-3 inline-flex size-10 items-center justify-center rounded-md text-muted-foreground",
            side === "right" && "max-md:top-[max(0.75rem,env(safe-area-inset-top))]"
          )}
        >
          <X className="size-4" />
          <span className="sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Popup>
    </SheetPortal>
  )
);
SheetContent.displayName = "SheetContent";
export const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
);
export const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props}
  />
);
export const SheetTitle = SheetPrimitive.Title;
export const SheetDescription = SheetPrimitive.Description;
