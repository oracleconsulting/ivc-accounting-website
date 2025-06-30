import Link from 'next/link'
import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary'
  size?: 'small' | 'medium' | 'large'
  href?: string
  onClick?: () => void
  fullWidth?: boolean
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  className?: string
}

export default function Button({
  children,
  variant = 'primary',
  size = 'medium',
  href,
  onClick,
  fullWidth = false,
  type = 'button',
  disabled = false,
  className = '',
}: ButtonProps) {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 inline-flex items-center justify-center'
  
  const variantClasses = {
    primary: 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-transparent border-2 border-white hover:bg-white hover:text-gray-900',
  }
  
  const sizeClasses = {
    small: 'px-4 py-2 text-sm',
    medium: 'px-6 py-3 text-base',
    large: 'px-8 py-4 text-lg',
  }
  
  const widthClass = fullWidth ? 'w-full' : ''
  
  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className} ${
    disabled ? 'opacity-50 cursor-not-allowed' : ''
  }`
  
  if (href && !disabled) {
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    )
  }
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={combinedClasses}
    >
      {children}
    </button>
  )
} 