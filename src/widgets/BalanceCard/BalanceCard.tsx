'use client';

import { useLocale, useTranslations } from 'next-intl';

import { useGetMeQuery } from '@/entities/user';
import {
  addUsdt,
  convertUsdtToFiat,
  formatFiat,
  formatUsdt,
  useGetBalanceQuery,
  useGetRatesQuery,
} from '@/entities/wallet';
import { DisplayCurrencySelect } from '@/features/display-currency';

import styles from './BalanceCard.module.css';

const RATES_POLLING_MS = 60_000;

// Баланс пользователя: деньги лежат в USDT, суммы показываются в выбранном фиате.
export function BalanceCard() {
  const t = useTranslations('BalanceCard');
  const locale = useLocale();

  const me = useGetMeQuery();
  const balance = useGetBalanceQuery();
  const rates = useGetRatesQuery(undefined, { pollingInterval: RATES_POLLING_MS });

  const queries = [me, balance, rates];
  const isError = queries.some((query) => query.isError);

  let content;
  if (isError) {
    content = (
      <div className={styles.state}>
        <p>{t('error')}</p>
        <button type="button" className={styles.retry} onClick={() => queries.forEach((query) => query.refetch())}>
          {t('retry')}
        </button>
      </div>
    );
  } else if (!me.data || !balance.data || !rates.data) {
    content = (
      <p className={styles.state} aria-busy="true">
        {t('loading')}
      </p>
    );
  } else {
    const currency = me.data.displayCurrency;
    const rate = rates.data.rates[currency];
    const { available, locked } = balance.data;
    const total = addUsdt(available, locked);
    const fiat = (usdt: string) => formatFiat(convertUsdtToFiat(usdt, rate), currency, locale);

    content = (
      <>
        <div className={styles.total}>
          <p className={styles.totalFiat} data-testid="balance-total">
            {fiat(total)}
          </p>
          <p className={styles.muted}>≈ {formatUsdt(total, locale)}</p>
        </div>
        <dl className={styles.breakdown}>
          <div className={styles.row}>
            <dt className={styles.muted}>{t('available')}</dt>
            <dd>
              {fiat(available)} <span className={styles.muted}>{formatUsdt(available, locale)}</span>
            </dd>
          </div>
          <div className={styles.row}>
            <dt className={styles.muted}>{t('locked')}</dt>
            <dd>
              {fiat(locked)} <span className={styles.muted}>{formatUsdt(locked, locale)}</span>
            </dd>
          </div>
        </dl>
        <p className={styles.rate}>{t('rate', { rate: formatFiat(rate, currency, locale) })}</p>
      </>
    );
  }

  return (
    <section className={styles.card} aria-labelledby="balance-title">
      <header className={styles.header}>
        <h2 id="balance-title" className={styles.title}>
          {t('title')}
        </h2>
        <DisplayCurrencySelect />
      </header>
      {content}
    </section>
  );
}
