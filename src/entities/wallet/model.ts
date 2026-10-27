import { z } from 'zod';

import { FIAT_CURRENCIES, SETTLEMENT_ASSET } from '@/shared/config/currencies';
import { decimalStringSchema } from '@/shared/lib/decimal';

export const balanceSchema = z.object({
  asset: z.literal(SETTLEMENT_ASSET),
  /** Можно тратить и выводить. */
  available: decimalStringSchema,
  /** Заблокировано под активные сделки (эскроу). */
  locked: decimalStringSchema,
});
export type Balance = z.infer<typeof balanceSchema>;

export const ratesSchema = z.object({
  base: z.literal(SETTLEMENT_ASSET),
  /** Сколько единиц фиата стоит 1 USDT. */
  rates: z.record(z.enum(FIAT_CURRENCIES), decimalStringSchema),
  updatedAt: z.iso.datetime(),
});
export type Rates = z.infer<typeof ratesSchema>;
