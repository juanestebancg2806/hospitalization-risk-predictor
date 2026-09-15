import { Link } from 'react-router-dom'

type TextLinkProps = {
  to: string
  children: string
}

/** Secondary navigation link (e.g. back to home). */
export function TextLink({ to, children }: TextLinkProps) {
  return (
    <Link
      to={to}
      className="inline-block font-mono text-xs text-brand underline-offset-4 hover:underline"
    >
      {children}
    </Link>
  )
}
