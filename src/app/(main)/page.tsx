"use client";

import { useState, useEffect, useMemo } from 'react';
import { mockAlbums } from '@/data/mockAlbums';
import type { Album } from '@/types';
import { SearchBar } from '@/components/SearchBar';
import { AlbumGrid } from '@/components/AlbumGrid';
import { useSearchParams } from 'next/navigation';

export default function HomePage() {
  const searchParams = useSearchParams();
  const initialSearchQuery = searchParams.get('q') || "";
  
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [allAlbums] = useState<Album[]>(mockAlbums); // Potentially fetch this in a real app

  useEffect(() => {
    setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Update URL without full navigation for shareable search results
    const newParams = new URLSearchParams(window.location.search);
    if (query) {
      newParams.set('q', query);
    } else {
      newParams.delete('q');
    }
    window.history.pushState({}, '', `${window.location.pathname}?${newParams.toString()}`);
  };

  const filteredAlbums = useMemo(() => {
    if (!searchQuery) {
      // Show some popular/random albums if no search query, or first few.
      return allAlbums.slice(0, 10); 
    }
    const lowerCaseQuery = searchQuery.toLowerCase();
    return allAlbums.filter(album =>
      album.title.toLowerCase().includes(lowerCaseQuery) ||
      album.artist.toLowerCase().includes(lowerCaseQuery) ||
      (album.genre && album.genre.toLowerCase().includes(lowerCaseQuery)) ||
      (album.tags && album.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery)))
    );
  }, [searchQuery, allAlbums]);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl md:text-4xl font-headline font-bold text-center text-primary my-4">
        Find Your Vibe
      </h1>
      <p className="text-center text-muted-foreground mb-8 max-w-2xl">
        Search for albums and EPs by name, artist, or keywords. Explore high-resolution album art and save your favorites.
      </p>
      <SearchBar onSearch={handleSearch} initialQuery={searchQuery} />
      <AlbumGrid albums={filteredAlbums} />
    </div>
  );
}
