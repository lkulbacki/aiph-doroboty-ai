import type { ComponentProps } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type EditaurusTextareaProps = ComponentProps<typeof Textarea>;

export function EditaurusTextarea({ className, ...props }: EditaurusTextareaProps) {
  return <Textarea {...props} className={cn("editaurus-textarea", className)} />;
}
