'use client';

import { cn } from '@/utils/helpers';
import Link from 'next/link';
import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  variant?: 'filled' | 'outlined' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  shape?: 'rounded' | 'pill' | 'square';
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string; // for link variant
};

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'filled',
  size = 'md',
  shape = 'rounded',
  iconLeft,
  iconRight,
  className,
  onClick,
  href,
}) => {
  const variantStyles = {
    filled: 'bg-[#123524] text-white hover:bg-[#123524]/90',
    outlined:
      'border border-white text-white relative overflow-hidden focus:ring-2 focus:ring-white/50',
    ghost:
      'bg-transparent text-gray-200 hover:bg-gray-700/20 focus:ring-2 focus:ring-gray-400/50',
    link: 'bg-transparent text-white hover:text-gray-300 focus:outline-none',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const shapeStyles = {
    rounded: 'rounded-md',
    pill: 'rounded-full',
    square: 'rounded-none',
  };

  const content = (
    <span className="flex items-center gap-2 leading-none">
      {iconLeft && (
        <span className="flex items-center justify-center relative z-10">
          {iconLeft}
        </span>
      )}

      <span className="relative z-10">{children}</span>

      {iconRight && (
        <span className="flex items-center justify-center text-2xl relative z-10 transform transition-transform duration-300 group-hover:translate-x-1">
          {iconRight}
        </span>
      )}
    </span>
  );

  if (variant === 'link' && href) {
    return (
      <Link
        href={href}
        className={cn(
          'inline-flex items-center font-medium gap-2 transition-all duration-300 ease-in-out group relative p-0',
          variantStyles[variant],
          sizeStyles[size],
          shapeStyles[shape],
          className
        )}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center font-medium gap-2 transition-all duration-300 ease-in-out focus:outline-none group relative',
        variantStyles[variant],
        sizeStyles[size],
        shapeStyles[shape],
        className
      )}
    >
      {variant === 'outlined' && (
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-500 ease-in-out group-hover:translate-x-full" />
      )}
      {content}
    </button>
  );
};

export default Button;
