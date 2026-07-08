import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-sans font-bold text-xs rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';
  
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-150 py-2.5 px-4',
    secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 px-4',
    outline: 'border border-slate-250 hover:bg-slate-50 text-slate-750 py-2.5 px-4 bg-white',
    ghost: 'hover:bg-slate-100 text-slate-650 py-2 px-3.5',
    danger: 'bg-rose-600 hover:bg-rose-705 text-white shadow-sm py-2.5 px-4'
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {isLoading && <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />}
      {!isLoading && leftIcon && <span className="mr-1.5">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-1.5">{rightIcon}</span>}
    </button>
  );
};
