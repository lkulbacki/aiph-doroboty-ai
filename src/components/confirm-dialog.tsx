"use client";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
export function ConfirmDialog({
  appearance,
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  pending,
  error,
  label = "Potwierdź",
}: {
  appearance?: "editaurus";
  open: boolean;
  onOpenChange: (value: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  pending: boolean;
  error?: string;
  label?: string;
}) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(value) => {
        if (!pending) onOpenChange(value);
      }}
    >
      <AlertDialogContent
        className={appearance === "editaurus" ? "editaurus-surface editaurus-confirm" : undefined}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        {error && (
          <p role="alert" className="error-message">
            {error}
          </p>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel
            className={appearance === "editaurus" ? "editaurus-secondary-button" : undefined}
            disabled={pending}
          >
            Anuluj
          </AlertDialogCancel>
          <AlertDialogAction
            className={
              appearance === "editaurus"
                ? "editaurus-secondary-button editaurus-danger-button"
                : undefined
            }
            variant="destructive"
            disabled={pending}
            onClick={onConfirm}
          >
            {pending ? "Zapisywanie…" : label}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
