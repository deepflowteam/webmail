import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-[color,background-color,border-color,opacity,box-shadow] duration-200 ease-out motion-reduce:transition-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [@media(hover:hover)]:hover:bg-primary/92",
        destructive:
          "bg-destructive text-destructive-foreground [@media(hover:hover)]:hover:bg-destructive/90",
        outline: "border border-input bg-background [@media(hover:hover)]:hover:bg-muted",
        secondary:
          "bg-secondary text-secondary-foreground [@media(hover:hover)]:hover:bg-secondary/80",
        ghost: "[@media(hover:hover)]:hover:bg-muted [@media(hover:hover)]:hover:text-foreground",
        link: "text-primary underline-offset-4 [@media(hover:hover)]:hover:underline",
        liquidGlass: "btn-liquid-glass rounded-full"
      },
      size: {
        default: "h-[30px] min-h-[30px] px-4 py-1",
        sm: "h-[27px] min-h-[27px] rounded-md px-3 text-xs",
        lg: "h-[33px] min-h-[33px] rounded-md px-5",
        icon: "size-[30px] min-h-[30px] min-w-[30px]"
      }
    },
    defaultVariants: { variant: "default", size: "default" }
  }
);

export type ButtonProps = Omit<ButtonPrimitive.Props, "className" | "render"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    className?: string;
    render?: ButtonPrimitive.Props["render"];
  };

export const Button = React.forwardRef<HTMLElement, ButtonProps>(
  (
    { asChild = false, children, className, nativeButton, render, size, variant, ...props },
    ref
  ) => (
    <ButtonPrimitive
      {...props}
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      nativeButton={asChild ? false : nativeButton}
      render={asChild && React.isValidElement(children) ? children : render}
    >
      {asChild ? undefined : children}
    </ButtonPrimitive>
  )
);
Button.displayName = "Button";

export { buttonVariants };
