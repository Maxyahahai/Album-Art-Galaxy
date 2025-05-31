export interface Album {
  id: string;
  title: string;
  artist: string;
  artUrl: string;
  genre?: string;
  year?: number;
  tags?: string[]; // For keywords like "hiphop", "indian hiphop"
}

export interface UiTheme {
  primaryColor: string;
  backgroundColor: string;
  accentColor: string;
}
