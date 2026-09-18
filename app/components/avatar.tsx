import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import * as React from "react";

import { cn } from "@/lib/cn";

export const Avatar = React.forwardRef<HTMLSpanElement, AvatarPrimitive.Root.Props>(
  ({ className, ...props }, ref) => (
    <AvatarPrimitive.Root
      {...props}
      ref={ref}
      className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
    />
  )
);
Avatar.displayName = "Avatar";
export const AvatarImage = React.forwardRef<HTMLImageElement, AvatarPrimitive.Image.Props>(
  ({ className, ...props }, ref) => (
    <AvatarPrimitive.Image
      {...props}
      ref={ref}
      className={cn("aspect-square h-full w-full", className)}
    />
  )
);
AvatarImage.displayName = "AvatarImage";
export const AvatarFallback = React.forwardRef<HTMLSpanElement, AvatarPrimitive.Fallback.Props>(
  ({ className, ...props }, ref) => (
    <AvatarPrimitive.Fallback
      {...props}
      ref={ref}
      className={cn(
        "flex h-full w-full items-center justify-center rounded-full bg-muted",
        className
      )}
    />
  )
);
AvatarFallback.displayName = "AvatarFallback";
