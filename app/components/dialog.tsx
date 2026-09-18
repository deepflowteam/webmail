import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/cn";

export function Dialog({ disablePointerDismissal = true, ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root {...props} disablePointerDismissal={disablePointerDismissal} />;
}
type Composed<T extends { children?: React.ReactNode; render?: unknown }> = T & {
  asChild?: boolean;
};
export function DialogTrigger({
  asChild = false,
  children,
  render,
  ...props
}: Composed<DialogPrimitive.Trigger.Props>) {
  return (
    <DialogPrimitive.Trigger
      {...props}
      render={asChild && React.isValidElement(children) ? children : render}
    >
      {asChild ? undefined : children}
    </DialogPrimitive.Trigger>
  );
}
export function DialogClose({
  asChild = false,
  children,
  render,
  ...props
}: Composed<DialogPrimitive.Close.Props>) {
  return (
    <DialogPrimitive.Close
      {...props}
      render={asChild && React.isValidElement(children) ? children : render}
    >
      {asChild ? undefined : children}
    </DialogPrimitive.Close>
  );
}
export const DialogPortal = DialogPrimitive.Portal;
export const DialogOverlay = DialogPrimitive.Backdrop;
type OutsideHandler = (
  event: CustomEvent<{ originalEvent: React.PointerEvent<HTMLDivElement> }>
) => void;
export type DialogContentProps = DialogPrimitive.Popup.Props & {
  onPointerDownOutside?: OutsideHandler;
  showCloseButton?: boolean;
};
export const DialogContent = React.forwardRef<HTMLDivElement, DialogContentProps>(
  (
    { className, children, onClick, onPointerDownOutside, showCloseButton = true, ...props },
    ref
  ) => (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop
        className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm"
        onPointerDown={(originalEvent) =>
          onPointerDownOutside?.(
            new CustomEvent("pointerDownOutside", { cancelable: true, detail: { originalEvent } })
          )
        }
      />
      <DialogPrimitive.Popup
        {...props}
        ref={ref}
        data-slot="dialog-content"
        className={cn(
          "fixed left-1/2 top-1/2 z-50 grid w-[min(92vw,720px)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-lg border bg-background p-5 shadow-lg",
          className
        )}
        onClick={(event) => {
          onClick?.(event);
          event.stopPropagation();
        }}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close className="absolute right-3 top-3 max-md:size-10 rounded-sm opacity-70">
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  )
);
DialogContent.displayName = "DialogContent";
export const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col gap-1.5 text-left", className)} {...props} />
);
export const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
    {...props}
  />
);
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;
