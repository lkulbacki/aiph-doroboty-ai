import type { ComponentProps } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SecondaryButtonProps = Omit<ComponentProps<typeof Button>, "variant">;

export function SecondaryButton({ className, ...props }: SecondaryButtonProps) {
  return (
    <Button {...props} variant="outline" className={cn("editaurus-secondary-button", className)} />
  );
}
