import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose, // Import DialogClose for the cancel button
} from "@/components/ui/dialog";
import { Loader2 } from 'lucide-react'; // For loading state

interface ConfirmationDialogProps {
  trigger: React.ReactNode;
  title: string;
  description: React.ReactNode; // Allow complex descriptions
  content?: React.ReactNode; // Optional content area (e.g., for a select dropdown)
  onConfirm: () => Promise<any>; // Async function for the confirm action
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export function ConfirmationDialog({
  trigger,
  title,
  description,
  content,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false,
}: ConfirmationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleConfirm = async () => {
    setIsPending(true);
    try {
      await onConfirm();
      setIsOpen(false); // Close dialog on successful confirmation
    } catch (error) {
      console.error("Confirmation action failed:", error);
      // Keep dialog open on error? Or close? For now, keep open.
      // Optionally show an error message inside the dialog
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {content && <div className="grid gap-4 py-4">{content}</div>}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>{cancelText}</Button>
          </DialogClose>
          <Button
            type="button" // Use type="button" to prevent form submission if nested
            variant={isDestructive ? "destructive" : "default"}
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
