import * as SheetPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/cn";

const Sheet = SheetPrimitive.Root;
const SheetTrigger = SheetPrimitive.Trigger;
const SheetClose = SheetPrimitive.Close;
const SheetPortal = SheetPrimitive.Portal;
const SheetTitle = SheetPrimitive.Title;
const SheetDescription = SheetPrimitive.Description;

type SheetContentProps = React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content> & {
  overlayClassName?: string;
  side?: "left" | "right";
};

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ className, children, overlayClassName, side = "right", ...props }, ref) => (
  <SheetPortal>
    <SheetPrimitive.Overlay
      className={cn(
        "fixed inset-0 z-50 bg-foreground/25 data-[state=closed]:animate-overlay-out data-[state=open]:animate-overlay-in motion-reduce:animate-none",
        overlayClassName
      )}
    />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(
        "fixed inset-y-0 z-50 w-[min(92vw,480px)] bg-background p-5 shadow-lg motion-reduce:animate-none",
        side === "left"
          ? "left-0 border-r data-[state=closed]:animate-sheet-out-left data-[state=open]:animate-sheet-in-left"
          : "right-0 border-l max-md:pb-[max(1.25rem,env(safe-area-inset-bottom))] max-md:pt-[max(1.25rem,env(safe-area-inset-top))] data-[state=closed]:animate-sheet-out-right data-[state=open]:animate-sheet-in-right",
        className
      )}
      {...props}
    >
      {children}
      <SheetPrimitive.Close
        className={cn(
          "absolute right-3 top-3 inline-flex size-10 min-h-10 min-w-10 items-center justify-center rounded-md text-muted-foreground transition-[color,background-color,transform] duration-200 [@media(hover:hover)]:hover:bg-muted [@media(hover:hover)]:hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] will-change-transform motion-reduce:transition-none",
          side === "right" && "max-md:top-[max(0.75rem,env(safe-area-inset-top))]"
        )}
      >
        <X className="size-4" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
));
SheetContent.displayName = SheetPrimitive.Content.displayName;

const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
);
SheetHeader.displayName = "SheetHeader";

const SheetFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props}
  />
);
SheetFooter.displayName = "SheetFooter";

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetPortal,
  SheetTitle,
  SheetTrigger
};
