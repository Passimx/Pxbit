import { createNavigation } from 'next-intl/navigation';

import { routing } from './routing';

// Используйте эти обёртки вместо next/link и next/navigation: они учитывают текущую локаль.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
