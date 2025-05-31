// @ts-nocheck
"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Album } from '@/types';
import { useToast } from "@/hooks/use-toast";

const FAVORITES_STORAGE_KEY = 'albumArtWalls_favorites';

export function useFavorites() {
  const [favorites, setFavorites] = useState<Album[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
        if (storedFavorites) {
          setFavorites(JSON.parse(storedFavorites));
        }
      } catch (error) {
        console.error("Error loading favorites from localStorage:", error);
        // Optionally, clear corrupted data
        // localStorage.removeItem(FAVORITES_STORAGE_KEY);
      }
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isLoaded && typeof window !== 'undefined') {
      try {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.error("Error saving favorites to localStorage:", error);
      }
    }
  }, [favorites, isLoaded]);

  const addFavorite = useCallback((album: Album) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.find(fav => fav.id === album.id)) {
        return prevFavorites; // Already a favorite
      }
      toast({ title: "Added to Favorites", description: `${album.title} by ${album.artist}` });
      return [...prevFavorites, album];
    });
  }, [toast]);

  const removeFavorite = useCallback((albumId: string) => {
    setFavorites((prevFavorites) => {
      const albumToRemove = prevFavorites.find(fav => fav.id === albumId);
      if (albumToRemove) {
        toast({ title: "Removed from Favorites", description: `${albumToRemove.title} by ${albumToRemove.artist}` });
      }
      return prevFavorites.filter(fav => fav.id !== albumId);
    });
  }, [toast]);

  const isFavorite = useCallback((albumId: string) => {
    return favorites.some(fav => fav.id === albumId);
  }, [favorites]);

  const toggleFavorite = useCallback((album: Album) => {
    if (isFavorite(album.id)) {
      removeFavorite(album.id);
    } else {
      addFavorite(album);
    }
  }, [addFavorite, removeFavorite, isFavorite]);

  return { favorites, addFavorite, removeFavorite, isFavorite, toggleFavorite, isLoaded };
}
