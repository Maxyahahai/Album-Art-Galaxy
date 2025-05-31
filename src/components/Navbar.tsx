import Link from 'next/link';
import { Music2 } from 'lucide-react';

export function Navbar() {
  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-xl font-headline font-semibold text-primary hover:text-accent transition-colors">
          <Music2 className="h-7 w-7" />
          Album Art Walls
        </Link>
        <nav className="flex items-center gap-4 sm:gap-6">
          <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/favorites" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Favorites
          </Link>
        </nav>
      </div>
    </header>
  );
}
