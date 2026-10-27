import Image from 'next/image';

import styles from './Avatar.module.css';

interface AvatarProps {
  /** Адрес картинки. null или undefined: показываем инициалы. */
  src?: string | null;
  name: string;
  size?: number;
}

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]!.toUpperCase())
    .join('');
}

// Аватары приходят с любых доменов (CDN провайдеров входа, наше хранилище), поэтому без оптимизации Next.
export function Avatar({ src, name, size = 32 }: AvatarProps) {
  return (
    <span className={styles.avatar} style={{ width: size, height: size, fontSize: size * 0.4 }} aria-hidden="true">
      {src ? (
        <Image src={src} alt="" width={size} height={size} unoptimized className={styles.image} />
      ) : (
        getInitials(name)
      )}
    </span>
  );
}
