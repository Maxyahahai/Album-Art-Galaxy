
"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { mockAlbums } from '@/data/mockAlbums';
import type { Album, UiTheme } from '@/types';
import { Button } from '@/components/ui/button';
import { Download, Heart, Palette, ArrowLeft } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { generateThemeFromArtAction } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { DynamicThemeStyle } from '@/components/DynamicThemeStyle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export default function AlbumDetailPage() {
  const params = useParams();
  const router = useRouter();
  const albumId = params.id as string;

  const [album, setAlbum] = useState<Album | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isThemeGenerating, setIsThemeGenerating] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<UiTheme | null>(null);

  const { isFavorite, toggleFavorite } = useFavorites();
  const { toast } = useToast();

  useEffect(() => {
    const foundAlbum = mockAlbums.find(a => a.id === albumId);
    if (foundAlbum) {
      setAlbum(foundAlbum);
    }
    setIsLoading(false);
  }, [albumId]);

  const handleGenerateTheme = async () => {
    if (!album) return;
    setIsThemeGenerating(true);
    setCurrentTheme(null); // Clear previous dynamic theme
    const result = await generateThemeFromArtAction(album.id, album.artUrl);
    setIsThemeGenerating(false);

    if ('error' in result) {
      toast({
        title: "Theme Generation Failed",
        description: result.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Theme Generated!",
        description: "New UI colors applied based on album art.",
      });
      setCurrentTheme(result);
    }
  };

  const handleDownload = () => {
    if (!album) return;
    const link = document.createElement('a');
    link.href = album.artUrl;
    // Sanitize filename
    const fileName = `${album.title}_${album.artist}_wallpaper.png`.replace(/[^a-z0-9_.-]/gi, '_');
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({ title: "Download Started", description: `${album.title} wallpaper.` });
  };

  if (isLoading) {
    return <p className="text-center text-muted-foreground py-8">Loading album details...</p>;
  }

  if (!album) {
    return <p className="text-center text-muted-foreground py-8">Album not found.</p>;
  }

  const favorited = isFavorite(album.id);

  return (
    <div className="max-w-4xl mx-auto" id="album-detail-page-container">
      {/* DynamicThemeStyle will apply theme to #album-detail-page-container or :root */}
      <DynamicThemeStyle theme={currentTheme} applyTo="#album-detail-page-container" />
      
      <Button variant="outline" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Albums
      </Button>

      <Card className="overflow-hidden shadow-xl">
        <div className="md:flex">
          <div className="md:w-1/2 relative aspect-square">
            <Image
              src={album.artUrl}
              alt={`Album art for ${album.title}`}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
              priority
              data-ai-hint={album.dataAiHint || "music album"}
            />
          </div>
          <div className="md:w-1/2 flex flex-col">
            <CardHeader className="pb-4">
              <CardTitle className="text-3xl lg:text-4xl font-headline font-bold text-primary">
                {album.title}
              </CardTitle>
              <CardDescription className="text-xl text-muted-foreground">
                by {album.artist}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 flex-grow">
              {album.year && <p><strong className="font-medium text-foreground">Year:</strong> {album.year}</p>}
              {album.genre && <p><strong className="font-medium text-foreground">Genre:</strong> {album.genre}</p>}
              {album.tags && album.tags.length > 0 && (
                <div>
                  <strong className="font-medium text-foreground">Tags:</strong>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {album.tags.map(tag => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <div className="p-6 border-t border-border space-y-3">
              <Button
                onClick={handleGenerateTheme}
                disabled={isThemeGenerating}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                size="lg"
              >
                <Palette className="mr-2 h-5 w-5" />
                {isThemeGenerating ? 'Generating Theme...' : 'Generate AI UI Theme'}
              </Button>
              <div className="grid grid-cols-2 gap-3">
                 <Button
                  onClick={() => toggleFavorite(album)}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  <Heart className={cn("mr-2 h-5 w-5", favorited ? "fill-destructive text-destructive" : "")} />
                  {favorited ? 'Favorited' : 'Favorite'}
                </Button>
                <Button onClick={handleDownload} variant="outline" size="lg" className="w-full">
                  <Download className="mr-2 h-5 w-5" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
