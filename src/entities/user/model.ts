import { z } from 'zod';

import { fiatCurrencySchema } from '@/shared/config/currencies';

export const userSchema = z.object({
  id: z.string(),
  nickname: z.string(),
  /** Валюта, в которой пользователь хочет видеть суммы. Деньги при этом всегда в USDT. */
  displayCurrency: fiatCurrencySchema,
});
export type User = z.infer<typeof userSchema>;

export type UserSettings = Pick<User, 'displayCurrency'>;
