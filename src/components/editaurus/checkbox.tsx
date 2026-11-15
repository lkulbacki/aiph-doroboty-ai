import type { ComponentProps } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

type EditaurusCheckboxProps = ComponentProps<typeof Checkbox>;

export function EditaurusCheckbox({ className, ...props }: EditaurusCheckboxProps) {
  return <Checkbox {...props} className={cn("editaurus-checkbox", className)} />;
}
