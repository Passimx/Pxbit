import { notFound } from 'next/navigation';

// Ловит все неизвестные пути внутри локали, чтобы показать локализованную not-found.tsx.
export default function CatchAllPage() {
  notFound();
}
