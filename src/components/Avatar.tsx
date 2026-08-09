import { useState } from 'react';
import { cn } from '../utils/cn';

interface AvatarProps {
  /** Full image URL, or null/undefined to render the initials placeholder. */
  src?: string | null;
  name: string;
  gender: 'male' | 'female';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZES = {
  sm: 'w-16 h-16 text-lg',
  md: 'w-20 h-20 text-xl',
  lg: 'w-28 h-28 text-3xl',
} as const;

/** First letter of the first two words — works for Latin and Malayalam alike. */
function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => Array.from(word)[0] ?? '')
    .join('');
}

/**
 * Photo with a graceful initials fallback.
 * Falls back automatically if the image is missing or fails to load,
 * so a not-yet-added photo never leaves a broken image on the page.
 */
export function Avatar({ src, name, gender, size = 'md', className }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const showPhoto = Boolean(src) && !failed;

  return (
    <div
      className={cn(
        'relative rounded-full overflow-hidden flex items-center justify-center font-semibold shrink-0 ring-2 ring-white/70 dark:ring-slate-700 shadow-sm',
        SIZES[size],
        !showPhoto &&
          (gender === 'male'
            ? 'bg-gradient-to-br from-sky-100 to-blue-200 text-blue-700 dark:from-sky-900/40 dark:to-blue-900/40 dark:text-blue-300'
            : 'bg-gradient-to-br from-rose-100 to-pink-200 text-rose-700 dark:from-rose-900/40 dark:to-pink-900/40 dark:text-rose-300'),
        className
      )}
    >
      {showPhoto ? (
        <img
          src={src as string}
          alt={name}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className="w-full h-full object-cover"
        />
      ) : (
        <span aria-hidden="true" className="select-none leading-none">
          {getInitials(name)}
        </span>
      )}
    </div>
  );
}
