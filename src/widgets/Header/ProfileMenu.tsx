'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useId, useRef, useState } from 'react';

import { useGetMeQuery } from '@/entities/user';
import { LogoutButton } from '@/features/auth';
import { Avatar } from '@/shared/ui/Avatar';

import styles from './ProfileMenu.module.css';

const COPIED_RESET_MS = 2000;

// Кнопка профиля в хедере. На десктопе открывает выпадающую панель, на мобильном шторку снизу.
// Внутри нет пунктов навигации, поэтому это раскрывающаяся панель (disclosure), а не role="menu".
export function ProfileMenu() {
  const t = useTranslations('ProfileMenu');
  const { data: user } = useGetMeQuery();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = () => {
    setOpen(false);
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    panelRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), COPIED_RESET_MS);
    return () => clearTimeout(timer);
  }, [copied]);

  const copyId = async () => {
    if (!user) return;
    try {
      await navigator.clipboard.writeText(user.id);
      setCopied(true);
    } catch {
      // Буфер обмена недоступен (нет разрешения или HTTP): ID всё равно виден и выделяется.
    }
  };

  if (!user) {
    return <span className={styles.placeholder} aria-hidden="true" />;
  }

  return (
    <div className={styles.root}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={t('open')}
        onClick={() => (open ? close() : setOpen(true))}
      >
        <Avatar src={user.avatarUrl} name={user.nickname} />
        <span className={styles.triggerName}>{user.nickname}</span>
      </button>

      {open && (
        <>
          <div className={styles.backdrop} onClick={close} aria-hidden="true" />
          <div ref={panelRef} id={panelId} className={styles.panel} tabIndex={-1} aria-label={t('title')} role="dialog">
            <div className={styles.profile}>
              <Avatar src={user.avatarUrl} name={user.nickname} size={56} />
              <p className={styles.name}>{user.nickname}</p>
            </div>

            <div className={styles.account}>
              <span className={styles.label}>{t('accountId')}</span>
              <div className={styles.idRow}>
                <code className={styles.id}>{user.id}</code>
                <button type="button" className={styles.copy} onClick={() => void copyId()}>
                  {copied ? t('copied') : t('copy')}
                </button>
              </div>
            </div>

            <LogoutButton className={styles.logout} />
          </div>
        </>
      )}
    </div>
  );
}
