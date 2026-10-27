import styles from './layout.module.css';

// Страницы входа: без хедера с профилем, карточка по центру экрана.
export default function AuthLayout({ children }: LayoutProps<'/[locale]'>) {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <p className={styles.logo}>Pxbit</p>
        {children}
      </div>
    </main>
  );
}
