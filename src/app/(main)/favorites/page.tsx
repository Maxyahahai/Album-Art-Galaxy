"use client";

import { useFavorites } from '@/hooks/useFavorites';
import { AlbumGrid } from '@/components/AlbumGrid';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function FavoritesPage() {
  const { favorites, isLoaded } = useFavorites();

  if (!isLoaded) {
    return <p className="text-center text-muted-foreground py-8">Loading favorites...</p>;
  }

  return (
    <div>
      <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary mb-8">
        Your Favorites
      </h1>
      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground mb-4">You haven&apos;t favorited any albums yet.</p>
          <Button asChild variant="default" size="lg">
            <Link href="/">Explore Albums</Link>
          </Button>
        </div>
      ) : (
        <AlbumGrid albums={favorites} />
      )}
    </div>
  );
}
