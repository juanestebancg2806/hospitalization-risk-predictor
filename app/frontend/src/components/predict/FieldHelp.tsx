import { useEffect, useId, useRef, useState } from 'react'

type FieldHelpProps = {
  text: string
}

/**
 * Toggletip (not hover tooltip): tap/click to open so it works on touch.
 * Closes on a second tap, outside press, or Escape.
 */
export function FieldHelp({ text }: FieldHelpProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLSpanElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelId = useId()

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (!rootRef.current?.contains(target)) {
        setOpen(false)
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.stopPropagation()
      setOpen(false)
      buttonRef.current?.focus()
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <span ref={rootRef} className="relative inline-flex align-middle">
      <button
        ref={buttonRef}
        type="button"
        className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-ink-faint ring-1 ring-line transition-colors hover:text-brand hover:ring-brand/40"
        aria-label="Más información"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="font-sans text-caption font-semibold" aria-hidden>
          ?
        </span>
      </button>
      {open ? (
        <span
          id={panelId}
          role="status"
          className="absolute top-full left-0 z-30 mt-1.5 w-64 max-w-[min(16rem,calc(100vw-2rem))] rounded-xl bg-ink px-3 py-2 text-left text-xs font-normal leading-snug text-on-brand shadow-card"
        >
          {text}
        </span>
      ) : null}
    </span>
  )
}
