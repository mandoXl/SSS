export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  duration: number; // seconds
  audioUrl: string;
  coverUrl: string;
  liked: boolean;
  createdAt: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  coverUrl: string;
  createdAt: string;
}

export interface PlaylistTrack {
  playlistId: string;
  trackId: string;
  position: number;
  addedAt: string;
}

export type RepeatMode = 'off' | 'all' | 'one';
