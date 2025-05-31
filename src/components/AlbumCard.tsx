
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import type { Album } from '@/types';
import { useFavorites } from '@/hooks/useFavorites';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AlbumCardProps {
  album: Album;
}

export function AlbumCard({ album }: AlbumCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(album.id);

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
      <CardHeader className="p-0">
        <Link href={`/album/${album.id}`} className="block aspect-square relative overflow-hidden group">
          <Image
            src={album.artUrl}
            alt={`Album art for ${album.title} by ${album.artist}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            data-ai-hint={album.dataAiHint || "music album"}
            priority={album.id === '1' || album.id === '2'} // Example: Prioritize first few images
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Link href={`/album/${album.id}`}>
          <CardTitle className="text-lg font-headline font-semibold hover:text-primary transition-colors truncate">
            {album.title}
          </CardTitle>
        </Link>
        <p className="text-sm text-muted-foreground truncate">{album.artist}</p>
        {album.genre && <p className="text-xs text-muted-foreground mt-1">{album.genre}</p>}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggleFavorite(album)}
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
          className="w-full flex items-center justify-center gap-2 text-muted-foreground hover:text-primary"
        >
          <Heart className={cn("h-5 w-5", favorited ? "fill-destructive text-destructive" : "text-muted-foreground")} />
          <span>{favorited ? 'Favorited' : 'Favorite'}</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
