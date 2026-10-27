import type { ComponentPropsWithoutRef } from 'react';

import styles from './Container.module.css';

// Серверный по умолчанию: нет состояния и обработчиков, поэтому 'use client' не нужен.
// Такой компонент можно использовать и в серверных, и в клиентских компонентах.
export function Container({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return <div className={className ? `${styles.container} ${className}` : styles.container} {...props} />;
}
