import React from 'react';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost';
};

export default function Button({ variant = 'primary', className = '', ...props }: ButtonProps) {
  const base = 'rounded-md px-5 py-2.5 font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantClass =
    variant === 'primary'
      ? 'bg-primary text-white hover:opacity-95 focus:ring-primary/50'
      : 'bg-transparent border border-gray-200 text-gray-900 hover:bg-gray-50 focus:ring-gray-200/60';

  return <button className={`${base} ${variantClass} ${className}`} {...props} />;
}
