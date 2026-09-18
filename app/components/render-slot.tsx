import { useRender } from "@base-ui/react/use-render";
import * as React from "react";

type RenderSlotProps = { children?: React.ReactNode; [key: string]: unknown };
export const RenderSlot = React.forwardRef<HTMLElement, RenderSlotProps>(
  ({ children, ...props }, ref) =>
    useRender({
      defaultTagName: "span",
      props: { ...props, children: React.isValidElement(children) ? undefined : children },
      ref,
      render: React.isValidElement(children) ? children : undefined
    })
);
RenderSlot.displayName = "RenderSlot";
