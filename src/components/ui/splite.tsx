'use client'

/**
 * Splite — a Framer Motion text-splitting animation component.
 *
 * Inspired by the "splite" component on 21st.dev (serafimcloud).
 * Splits the input text into characters or words and animates each unit in
 * with a configurable, staggered motion preset. Pure client component, no
 * external runtime deps beyond framer-motion (already in the stack).
 */

import { cn } from '@/lib/utils'
import {
  motion,
  useReducedMotion,
  type Variants,
  type Transition,
} from 'framer-motion'
import {
  createElement,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from 'react'

export type SpliteBy = 'char' | 'word'

export type SplitePreset =
  | 'fade'
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'scale'
  | 'rotate'
  | 'blur'
  | 'spring'

export interface SpliteProps {
  /** The text to animate. */
  text: string
  /** Split unit: per character or per word. */
  by?: SpliteBy
  /** Visual motion preset. */
  preset?: SplitePreset
  /** Stagger delay between each unit (seconds). */
  stagger?: number
  /** Initial delay before the first unit starts (seconds). */
  delay?: number
  /** Per-unit animation duration (seconds). */
  duration?: number
  /** Render as a different element (default: span). */
  as?: ElementType
  /** Extra class for the outer container. */
  className?: string
  /** Extra class for each animated unit. */
  unitClassName?: string
  /** Inline style for the outer container. */
  style?: CSSProperties
  /** Replay the animation whenever `text` changes. Default: true. */
  replayOnChange?: boolean
  /** Force animation to play only once. Default: false. */
  once?: boolean
  /** Optional aria label (defaults to the raw text). */
  ariaLabel?: string
  /** Separator inserted between words when by='word'. Default: a single space. */
  wordSeparator?: ReactNode
}

const PRESETS: Record<SplitePreset, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  },
  slideUp: {
    hidden: { opacity: 0, y: '0.6em' },
    visible: { opacity: 1, y: '0em' },
  },
  slideDown: {
    hidden: { opacity: 0, y: '-0.6em' },
    visible: { opacity: 1, y: '0em' },
  },
  slideLeft: {
    hidden: { opacity: 0, x: '0.6em' },
    visible: { opacity: 1, x: '0em' },
  },
  slideRight: {
    hidden: { opacity: 0, x: '-0.6em' },
    visible: { opacity: 1, x: '0em' },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.4 },
    visible: { opacity: 1, scale: 1 },
  },
  rotate: {
    hidden: { opacity: 0, rotate: -25, scale: 0.6 },
    visible: { opacity: 1, rotate: 0, scale: 1 },
  },
  blur: {
    hidden: { opacity: 0, filter: 'blur(10px)' },
    visible: { opacity: 1, filter: 'blur(0px)' },
  },
  spring: {
    hidden: { opacity: 0, y: '0.8em', scale: 0.6 },
    visible: {
      opacity: 1,
      y: '0em',
      scale: 1,
      transition: { type: 'spring', stiffness: 380, damping: 22 },
    },
  },
}

function splitText(text: string, by: SpliteBy): string[] {
  if (by === 'word') {
    // Keep whitespace as part of the following word so spacing is preserved
    // when we render inline-flex spans.
    const words = text.split(/(\s+)/).filter((s) => s.length > 0)
    return words
  }
  // char
  return Array.from(text)
}

export function Splite({
  text,
  by = 'char',
  preset = 'slideUp',
  stagger = 0.025,
  delay = 0,
  duration = 0.5,
  as = 'span',
  className,
  unitClassName,
  style,
  replayOnChange = true,
  once = false,
  ariaLabel,
  wordSeparator,
}: SpliteProps) {
  const reduceMotion = useReducedMotion()
  const units = splitText(text, by)
  const variants = PRESETS[preset] ?? PRESETS.slideUp

  // When reduced motion is preferred, just fade everything in instantly.
  const effectiveVariants: Variants = reduceMotion
    ? {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
      }
    : variants

  const unitTransition: Transition | undefined =
    preset === 'spring'
      ? undefined // spring preset embeds its own transition in variants
      : { duration, ease: [0.22, 1, 0.36, 1] }

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion ? 0 : stagger,
        delayChildren: delay,
      },
    },
  }

  const Wrapper: ElementType = motion[as as keyof typeof motion] ?? motion.span

  return createElement(
    Wrapper,
    {
      className: cn('inline-block', className),
      style: { willChange: 'transform', ...style },
      role: 'text',
      'aria-label': ariaLabel ?? text,
      initial: 'hidden',
      animate: 'visible',
      variants: containerVariants,
      // Use the text as the key so changing the message replays the animation.
      key: replayOnChange ? text : undefined,
    },
    units.map((unit, i) => {
      const isWhitespace = /^\s+$/.test(unit)
      return createElement(
        motion.span,
        {
          key: `${unit}-${i}`,
          className: cn(
            'inline-block whitespace-pre',
            isWhitespace && 'select-none',
            unitClassName,
          ),
          variants: effectiveVariants,
          transition: unitTransition,
          // Allow parent stagger to control timing.
          ...(once ? {} : {}),
        },
        isWhitespace && by === 'word' && wordSeparator
          ? wordSeparator
          : unit,
      )
    }),
  )
}

/**
 * Typewriter variant: types text out character-by-character. Useful for bot
 * "thinking" or live-streaming replies.
 */
export function SpliteTypewriter({
  text,
  speed = 35,
  startDelay = 0,
  className,
  onDone,
  cursorClassName,
  showCursor = true,
}: {
  text: string
  speed?: number
  startDelay?: number
  className?: string
  onDone?: () => void
  cursorClassName?: string
  showCursor?: boolean
}) {
  const reduceMotion = useReducedMotion()
  const chars = Array.from(text)

  if (reduceMotion) {
    return (
      <span className={cn('inline-block', className)} role="text">
        {text}
      </span>
    )
  }

  return (
    <span className={cn('inline-block', className)} role="text" aria-label={text}>
      {chars.map((_, i) => {
        const charDelay = startDelay + i * (speed / 1000)
        return (
          <motion.span
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.01, delay: charDelay }}
            className="inline-block whitespace-pre"
            onAnimationComplete={() => {
              if (i === chars.length - 1) onDone?.()
            }}
          >
            {chars[i]}
          </motion.span>
        )
      })}
      {showCursor && (
        <motion.span
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: startDelay + chars.length * (speed / 1000),
          }}
          className={cn('ml-0.5 inline-block', cursorClassName)}
        >
          ▋
        </motion.span>
      )}
    </span>
  )
}
