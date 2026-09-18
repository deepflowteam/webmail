import type * as React from "react";
import {
  Tabs as BaseTabs,
  TabsContent as BaseTabsContent,
  TabsList as BaseTabsList,
  TabsTrigger as BaseTabsTrigger
} from "@/components/ui/tabs";
import { cn } from "@/lib/cn";

export const Tabs = BaseTabs;
export function TabsList({ className, ...props }: React.ComponentProps<typeof BaseTabsList>) {
  return <BaseTabsList {...props} className={cn("h-8 rounded-full p-1", className)} />;
}
export function TabsTrigger({ className, ...props }: React.ComponentProps<typeof BaseTabsTrigger>) {
  return (
    <BaseTabsTrigger {...props} className={cn("h-7 min-h-0 rounded-full px-3 py-1", className)} />
  );
}
export function TabsContent({ className, ...props }: React.ComponentProps<typeof BaseTabsContent>) {
  return <BaseTabsContent {...props} className={cn("mt-3", className)} />;
}
