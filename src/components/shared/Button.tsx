import { type ButtonHTMLAttributes, type ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  block?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
  isLoading?: boolean;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  block = false,
  icon,
  children,
  isLoading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-[#00AD51] text-white hover:bg-[#008A41]',
    secondary: 'bg-[#00246B] text-white hover:bg-[#001D56]',
    outline: 'border-2 border-[#00AD51] text-[#00AD51] hover:bg-[#00AD51] hover:text-white',
    ghost: 'text-[#4F4F4F] hover:bg-gray-100',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-lg',
    icon: 'p-2 rounded-lg',
  };

  const blockStyles = block ? 'w-full' : '';

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${blockStyles} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="spinner" />
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
}
