import { Header } from '@/widgets/Header';

// Приватная часть: сюда пускает только proxy.ts, если есть cookie сессии.
export default function AppLayout({ children }: LayoutProps<'/[locale]'>) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  );
}
