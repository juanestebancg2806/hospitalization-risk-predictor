import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'

const variantClass: Record<Variant, string> = {
  primary:
    'rounded-xl bg-brand text-on-brand shadow-cta hover:bg-brand-strong disabled:cursor-not-allowed disabled:bg-line disabled:text-ink-faint disabled:shadow-none',
  secondary:
    'rounded-xl border border-line bg-surface-raised text-ink shadow-sm hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-50',
  ghost:
    'rounded-xl text-brand hover:bg-brand-fog disabled:cursor-not-allowed disabled:opacity-50',
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
