import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";

interface ResultDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  title: string;
  content: React.ReactNode;
  acceptButtonText: string;
  cancelButtonText: string;
}

export function ResultDialog({
  isOpen,
  onClose,
  onAccept,
  title,
  content,
  acceptButtonText,
  cancelButtonText,
}: ResultDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">{content}</div>
        <DialogFooter>
          <Button onClick={onClose}>{cancelButtonText}</Button>
          <Button onClick={onAccept} className="bg-red-600 hover:bg-red-800">
            {acceptButtonText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
