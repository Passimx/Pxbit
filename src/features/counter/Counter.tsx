'use client';

import { useTranslations } from 'next-intl';

import { useAppDispatch, useAppSelector } from '@/store/hooks';

import styles from './Counter.module.css';
import { decrement, increment, reset, selectCount } from './counterSlice';

// Клиентский компонент: нужен state, обработчики событий и доступ к Redux.
export function Counter() {
  const t = useTranslations('Counter');
  const count = useAppSelector(selectCount);
  const dispatch = useAppDispatch();

  return (
    <section className={styles.counter}>
      <h2 className={styles.title}>{t('title')}</h2>
      <p className={styles.value} aria-live="polite">
        {t('value', { count })}
      </p>
      <div className={styles.actions}>
        <button type="button" className={styles.button} onClick={() => dispatch(decrement())}>
          {t('decrement')}
        </button>
        <button type="button" className={styles.button} onClick={() => dispatch(increment())}>
          {t('increment')}
        </button>
        <button type="button" className={styles.button} onClick={() => dispatch(reset())}>
          {t('reset')}
        </button>
      </div>
    </section>
  );
}
