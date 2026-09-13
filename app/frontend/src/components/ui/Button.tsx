import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

const variantClass: Record<Variant, string> = {
  primary:
    'bg-brand text-surface-raised hover:bg-brand-strong disabled:cursor-not-allowed disabled:bg-line disabled:text-ink-faint',
  secondary:
    'border border-line-strong bg-surface-raised text-ink hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-50',
  ghost:
    'text-brand underline-offset-2 hover:underline disabled:cursor-not-allowed disabled:opacity-50',
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  children: ReactNode
}

export function Button({
  variant = 'primary',
  className = '',
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium transition-colors ${variantClass[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
