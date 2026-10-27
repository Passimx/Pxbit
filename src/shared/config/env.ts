import { z } from 'zod';

// Публичные переменные (NEXT_PUBLIC_*) встраиваются в клиентский бандл при сборке,
// поэтому к ним обращаемся явно, а не через перебор process.env.
const publicEnvSchema = z.object({
  NEXT_PUBLIC_API_URL: z.url().default('http://localhost:3000/api'),
});

export const publicEnv = publicEnvSchema.parse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});
