'use client';

import { useTranslations } from 'next-intl';

import { useGetMeQuery, useUpdateSettingsMutation } from '@/entities/user';
import { FIAT_CURRENCIES } from '@/shared/config/currencies';

import styles from './DisplayCurrencySelect.module.css';

// Переключатель валюты отображения. Выбор сохраняется в профиле на сервере.
export function DisplayCurrencySelect() {
  const t = useTranslations('DisplayCurrency');
  const { data: user } = useGetMeQuery();
  const [updateSettings] = useUpdateSettingsMutation();

  return (
    <div role="radiogroup" aria-label={t('label')} className={styles.group}>
      {FIAT_CURRENCIES.map((currency) => {
        const selected = user?.displayCurrency === currency;
        return (
          <button
            key={currency}
            type="button"
            role="radio"
            aria-checked={selected}
            title={t(`names.${currency}`)}
            disabled={!user}
            className={selected ? `${styles.option} ${styles.selected}` : styles.option}
            onClick={() => {
              if (!selected) void updateSettings({ displayCurrency: currency });
            }}
          >
            {currency}
          </button>
        );
      })}
    </div>
  );
}
