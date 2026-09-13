import { Link } from 'react-router-dom'

const primaryCtaClass =
  'inline-flex bg-brand px-5 py-2.5 text-sm font-medium text-surface-raised hover:bg-brand-strong'
const primaryCtaDisabledClass =
  'inline-flex cursor-not-allowed bg-line px-5 py-2.5 text-sm font-medium text-ink-faint'

type PrimaryButtonLinkProps = {
  to: string
  children: string
  disabled?: boolean
}

export function PrimaryButtonLink({
  to,
  children,
  disabled = false,
}: PrimaryButtonLinkProps) {
  if (disabled) {
    return (
      <button type="button" disabled className={primaryCtaDisabledClass}>
        {children}
      </button>
    )
  }

  return (
    <Link to={to} className={primaryCtaClass}>
      {children}
    </Link>
  )
}
