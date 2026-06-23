"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface ModalProps {
  isOpen: boolean;
  title: string;
  eyebrow?: string;
  closeLabel: string;
  children: ReactNode;
  footer?: ReactNode;
  onClose: () => void;
  maxWidthClassName?: string;
}

export function Modal({
  isOpen,
  title,
  eyebrow,
  closeLabel,
  children,
  footer,
  onClose,
  maxWidthClassName = "max-w-2xl"
}: ModalProps): JSX.Element | null {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent): void {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 px-3 py-4 backdrop-blur-sm sm:items-center"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className={`max-h-[92vh] w-full overflow-hidden rounded-md border border-line bg-white shadow-soft outline-none ${maxWidthClassName}`}
      >
        <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div>
            {eyebrow ? (
              <p className="text-xs font-black uppercase text-leaf">{eyebrow}</p>
            ) : null}
            <h2 id="modal-title" className="mt-1 text-lg font-black text-ink">
              {title}
            </h2>
          </div>
          <Button
            type="button"
            variant="danger"
            size="icon"
            onClick={onClose}
            aria-label={closeLabel}
            title={closeLabel}
          >
            <X aria-hidden="true" size={18} />
          </Button>
        </header>
        {children}
        {footer ? (
          <footer className="border-t border-line px-5 py-4">{footer}</footer>
        ) : null}
      </div>
    </div>
  );
}

