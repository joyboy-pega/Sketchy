'use client';

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import clsx from 'clsx';
import { playClickSound } from '@/lib/sound-fx';

const popButtonVariants = cva(
  [
    'inline-flex select-none items-center justify-center gap-2',
    'rounded-xl border-3 border-ink',
    'transition-[transform,box-shadow] duration-[80ms] ease-out',
    'hover:-translate-y-0.5',
    'disabled:cursor-not-allowed disabled:border-graphite disabled:bg-paper-2',
    'disabled:text-graphite disabled:shadow-none disabled:hover:translate-y-0',
  ].join(' '),
  {
    variants: {
      variant: {
        primary: [
          'bg-civilian text-white shadow-hard',
          'font-display uppercase tracking-wide',
          'active:translate-x-[4px] active:translate-y-[4px] active:shadow-hard-pressed',
        ].join(' '),
        accent: [
          'bg-highlight text-ink shadow-hard',
          'font-display uppercase tracking-wide',
          'active:translate-x-[4px] active:translate-y-[4px] active:shadow-hard-pressed',
        ].join(' '),
        danger: [
          'bg-undercover text-white shadow-hard',
          'font-display uppercase tracking-wide',
          'active:translate-x-[4px] active:translate-y-[4px] active:shadow-hard-pressed',
        ].join(' '),
        secondary: [
          'bg-paper-2 text-ink shadow-hard-sm font-ui font-semibold',
          'active:translate-x-[2px] active:translate-y-[2px] active:shadow-hard-pressed',
        ].join(' '),
      },
      size: {
        md: 'px-5 py-3 text-base',
        lg: 'px-7 py-4 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export interface PopButtonProps
  extends
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>,
    VariantProps<typeof popButtonVariants> {
  children: ReactNode;
}

export const PopButton = forwardRef<HTMLButtonElement, PopButtonProps>(function PopButton(
  { children, className, variant, size, type = 'button', onClick, ...props },
  ref,
) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playClickSound();
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      ref={ref}
      type={type}
      className={clsx(popButtonVariants({ variant, size }), className)}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
});
