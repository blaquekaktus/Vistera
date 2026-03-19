'use client';

import { useFormStatus } from 'react-dom';

interface SubmitButtonProps {
  className?: string;
  pendingText: string;
  children: React.ReactNode;
}

export function SubmitButton({ className, pendingText, children }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? pendingText : children}
    </button>
  );
}
