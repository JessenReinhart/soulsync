import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

// Define own props for the Button component
interface ButtonOwnProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
  children: React.ReactNode;
}

// Combine own props with HTMLMotionProps for the button element.
// Omit keys from HTMLMotionProps that are explicitly handled or defined in ButtonOwnProps to avoid conflicts.
type ButtonProps = ButtonOwnProps & Omit<HTMLMotionProps<'button'>, keyof ButtonOwnProps | 'children'>;

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  leftIcon,
  rightIcon,
  isLoading = false,
  className, 
  disabled,
  ...restMotionProps
}) => {
  const baseStyle = "font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-70 transition-all duration-150 ease-in-out inline-flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed shadow-soft-sm hover:shadow-soft-md";

  const variantStyles = {
    primary: "bg-primaryDark hover:bg-opacity-85 text-white focus:ring-primaryDark",
    secondary: "bg-secondaryLight hover:bg-opacity-85 text-secondaryDark dark:bg-secondaryDark dark:hover:bg-opacity-85 dark:text-secondaryLight focus:ring-secondaryDark",
    danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-500", // Keep danger distinct
    ghost: "bg-transparent hover:bg-primaryLight/30 dark:hover:bg-primaryDark/30 text-textLight dark:text-textDark focus:ring-primaryDark border border-primaryLight dark:border-primaryDark/50"
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const finalClassName = `${baseStyle} ${variantStyles[variant]} ${sizeStyles[size]} ${className || ''}`.trim();

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      {...restMotionProps}
      className={finalClassName}
      disabled={isLoading || disabled}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {leftIcon && !isLoading && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && !isLoading && <span className="ml-2">{rightIcon}</span>}
    </motion.button>
  );
};

export default Button;