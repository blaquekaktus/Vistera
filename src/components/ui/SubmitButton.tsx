'use client';

import { useFormStatus } from 'react-dom';

interface SubmitButtonProps {
  className?: string;
  pendingText: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export function SubmitButton({ className, pendingText, children, disabled }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending || disabled} className={className}>
      {pending ? pendingText : children}
    </button>
  );
}
