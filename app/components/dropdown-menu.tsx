import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import * as React from "react";
import {
  DropdownMenu as BaseDropdownMenu,
  DropdownMenuCheckboxItem as BaseDropdownMenuCheckboxItem,
  type DropdownMenuContent as BaseDropdownMenuContent,
  DropdownMenuItem as BaseDropdownMenuItem,
  DropdownMenuRadioGroup as BaseDropdownMenuRadioGroup,
  DropdownMenuRadioItem as BaseDropdownMenuRadioItem,
  DropdownMenuTrigger as BaseDropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/cn";

const MenuActionsContext =
  React.createContext<React.RefObject<MenuPrimitive.Root.Actions | null> | null>(null);
export function DropdownMenu({
  actionsRef,
  ...props
}: React.ComponentProps<typeof BaseDropdownMenu>) {
  const internalActionsRef = React.useRef<MenuPrimitive.Root.Actions | null>(null);
  const activeActionsRef = actionsRef ?? internalActionsRef;
  return (
    <MenuActionsContext.Provider value={activeActionsRef}>
      <BaseDropdownMenu {...props} actionsRef={activeActionsRef} />
    </MenuActionsContext.Provider>
  );
}
type TriggerProps = React.ComponentProps<typeof BaseDropdownMenuTrigger> & { asChild?: boolean };
export function DropdownMenuTrigger({
  asChild = false,
  children,
  onClick,
  render,
  ...props
}: TriggerProps) {
  return (
    <BaseDropdownMenuTrigger
      {...props}
      nativeButton={props.nativeButton}
      onClick={onClick}
      render={asChild && React.isValidElement(children) ? children : render}
    >
      {asChild ? undefined : children}
    </BaseDropdownMenuTrigger>
  );
}
type ItemProps = Omit<React.ComponentProps<typeof BaseDropdownMenuItem>, "onClick" | "onSelect"> & {
  onClick?: React.ComponentProps<typeof BaseDropdownMenuItem>["onClick"];
  onSelect?: (event: Event) => void;
};
export const DropdownMenuItem = React.forwardRef<HTMLDivElement, ItemProps>(
  ({ onClick, onSelect, ...props }, ref) => {
    const actionsRef = React.useContext(MenuActionsContext);
    return (
      <BaseDropdownMenuItem
        {...props}
        ref={ref}
        onClick={(event) => {
          onClick?.(event);
          const selectEvent = new Event("select", { cancelable: true });
          onSelect?.(selectEvent);
          if (!selectEvent.defaultPrevented) {
            actionsRef?.current?.close();
            actionsRef?.current?.unmount();
          }
        }}
      />
    );
  }
);
DropdownMenuItem.displayName = "DropdownMenuItem";
type CheckboxProps = Omit<
  React.ComponentProps<typeof BaseDropdownMenuCheckboxItem>,
  "onClick" | "onSelect"
> & {
  onClick?: React.ComponentProps<typeof BaseDropdownMenuCheckboxItem>["onClick"];
  onSelect?: (event: Event) => void;
};
export const DropdownMenuCheckboxItem = React.forwardRef<HTMLDivElement, CheckboxProps>(
  ({ onClick, onSelect, ...props }, ref) => {
    const actionsRef = React.useContext(MenuActionsContext);
    return (
      <BaseDropdownMenuCheckboxItem
        {...props}
        ref={ref}
        onClick={(event) => {
          onClick?.(event);
          const selectEvent = new Event("select", { cancelable: true });
          onSelect?.(selectEvent);
          if (!selectEvent.defaultPrevented) {
            actionsRef?.current?.close();
            actionsRef?.current?.unmount();
          }
        }}
      />
    );
  }
);
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";
type ContentProps = React.ComponentProps<typeof BaseDropdownMenuContent> & {
  avoidCollisions?: boolean;
  collisionPadding?: number;
};
export const DropdownMenuContent = React.forwardRef<HTMLDivElement, ContentProps>(
  (
    {
      align = "start",
      alignOffset = 0,
      avoidCollisions = true,
      children,
      className,
      collisionPadding = 8,
      side = "bottom",
      sideOffset = 4,
      ...props
    },
    ref
  ) => (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner
        align={align}
        alignOffset={alignOffset}
        collisionAvoidance={
          avoidCollisions
            ? { side: "flip", align: "flip", fallbackAxisSide: "none" }
            : { side: "none", align: "none", fallbackAxisSide: "none" }
        }
        collisionPadding={collisionPadding}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-[2147483647] outline-none"
      >
        <MenuPrimitive.Popup
          {...props}
          ref={ref}
          className={cn(
            "relative z-[2147483647] max-h-[var(--available-height)] min-w-32 overflow-x-hidden overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-none",
            className
          )}
        >
          {children}
        </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  )
);
DropdownMenuContent.displayName = "DropdownMenuContent";
type RadioGroupProps = Omit<
  React.ComponentProps<typeof BaseDropdownMenuRadioGroup>,
  "onValueChange"
> & {
  onValueChange?: (value: string) => void;
};
export function DropdownMenuRadioGroup({ onValueChange, ...props }: RadioGroupProps) {
  return (
    <BaseDropdownMenuRadioGroup {...props} onValueChange={(value) => onValueChange?.(value)} />
  );
}
export const DropdownMenuRadioItem = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof BaseDropdownMenuRadioItem>
>((props, ref) => {
  const actionsRef = React.useContext(MenuActionsContext);
  return (
    <BaseDropdownMenuRadioItem
      {...props}
      ref={ref}
      onClick={(event) => {
        props.onClick?.(event);
        actionsRef?.current?.close();
        actionsRef?.current?.unmount();
      }}
    />
  );
});
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";

export { DropdownMenuGroup, DropdownMenuLabel, DropdownMenuSeparator };
