import type { Track, Playlist, PlaylistTrack } from '../types';
import { mockPlaylists, mockTracksFull, mockPlaylistTracks } from '../data/mockData';

const STORAGE_KEYS = {
  tracks: 'spotifly_tracks',
  playlists: 'spotifly_playlists',
  playlistTracks: 'spotifly_playlist_tracks',
  seeded: 'spotifly_seeded',
};

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to write to storage', e);
  }
}

function seedIfNeeded(): void {
  const seeded = localStorage.getItem(STORAGE_KEYS.seeded);
  if (seeded === 'true') return;
  writeJSON(STORAGE_KEYS.tracks, mockTracksFull);
  writeJSON(STORAGE_KEYS.playlists, mockPlaylists);
  writeJSON(STORAGE_KEYS.playlistTracks, mockPlaylistTracks);
  localStorage.setItem(STORAGE_KEYS.seeded, 'true');
}

function genId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export const dataStore = {
  init(): void {
    seedIfNeeded();
  },

  getAllTracks(): Track[] {
    return readJSON<Track[]>(STORAGE_KEYS.tracks, []);
  },

  getAllPlaylists(): Playlist[] {
    return readJSON<Playlist[]>(STORAGE_KEYS.playlists, []);
  },

  getAllPlaylistTracks(): PlaylistTrack[] {
    return readJSON<PlaylistTrack[]>(STORAGE_KEYS.playlistTracks, []);
  },

  getTracksForPlaylist(playlistId: string): Track[] {
    const allTracks = this.getAllTracks();
    const allLinks = this.getAllPlaylistTracks();
    return allLinks
      .filter((lt) => lt.playlistId === playlistId)
      .sort((a, b) => a.position - b.position)
      .map((lt) => allTracks.find((t) => t.id === lt.trackId))
      .filter((t): t is Track => t !== undefined);
  },

  getLikedTracks(): Track[] {
    return this.getAllTracks().filter((t) => t.liked);
  },

  toggleLike(trackId: string): Track[] {
    const tracks = this.getAllTracks();
    const updated = tracks.map((t) =>
      t.id === trackId ? { ...t, liked: !t.liked } : t
    );
    writeJSON(STORAGE_KEYS.tracks, updated);
    return updated;
  },

  addTrack(track: Omit<Track, 'id' | 'createdAt' | 'liked'>): Track {
    const tracks = this.getAllTracks();
    const newTrack: Track = {
      ...track,
      id: genId('tr'),
      liked: false,
      createdAt: new Date().toISOString(),
    };
    writeJSON(STORAGE_KEYS.tracks, [...tracks, newTrack]);
    return newTrack;
  },

  addTrackToPlaylist(playlistId: string, trackId: string): void {
    const links = this.getAllPlaylistTracks();
    const playlistLinks = links.filter((lt) => lt.playlistId === playlistId);
    const maxPos = playlistLinks.reduce((max, lt) => Math.max(max, lt.position), -1);
    const newLink: PlaylistTrack = {
      playlistId,
      trackId,
      position: maxPos + 1,
      addedAt: new Date().toISOString(),
    };
    writeJSON(STORAGE_KEYS.playlistTracks, [...links, newLink]);
  },

  addTrackToPlaylists(trackId: string, playlistIds: string[]): void {
    let links = this.getAllPlaylistTracks();
    playlistIds.forEach((playlistId) => {
      const exists = links.some((lt) => lt.playlistId === playlistId && lt.trackId === trackId);
      if (!exists) {
        const playlistLinks = links.filter((lt) => lt.playlistId === playlistId);
        const maxPos = playlistLinks.reduce((max, lt) => Math.max(max, lt.position), -1);
        links = [...links, { playlistId, trackId, position: maxPos + 1, addedAt: new Date().toISOString() }];
      }
    });
    writeJSON(STORAGE_KEYS.playlistTracks, links);
  },

  createPlaylist(name: string, description: string, coverUrl: string): Playlist {
    const playlists = this.getAllPlaylists();
    const newPlaylist: Playlist = {
      id: genId('pl'),
      name,
      description,
      coverUrl: coverUrl || 'https://images.pexels.com/photos/8699994/pexels-photo-8699994.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
      createdAt: new Date().toISOString(),
    };
    writeJSON(STORAGE_KEYS.playlists, [...playlists, newPlaylist]);
    return newPlaylist;
  },

  deletePlaylist(playlistId: string): void {
    const playlists = this.getAllPlaylists().filter((p) => p.id !== playlistId);
    writeJSON(STORAGE_KEYS.playlists, playlists);
    const links = this.getAllPlaylistTracks().filter((lt) => lt.playlistId !== playlistId);
    writeJSON(STORAGE_KEYS.playlistTracks, links);
  },

  removeTrackFromPlaylist(playlistId: string, trackId: string): void {
    let links = this.getAllPlaylistTracks().filter(
      (lt) => !(lt.playlistId === playlistId && lt.trackId === trackId)
    );
    // Reindex positions
    const playlistLinks = links.filter((lt) => lt.playlistId === playlistId).sort((a, b) => a.position - b.position);
    playlistLinks.forEach((lt, i) => { lt.position = i; });
    links = links.filter((lt) => lt.playlistId !== playlistId).concat(playlistLinks);
    writeJSON(STORAGE_KEYS.playlistTracks, links);
  },

  getPlaylistById(playlistId: string): Playlist | undefined {
    return this.getAllPlaylists().find((p) => p.id === playlistId);
  },

  deleteTrack(trackId: string): void {
    const tracks = this.getAllTracks().filter((t) => t.id !== trackId);
    writeJSON(STORAGE_KEYS.tracks, tracks);
    const links = this.getAllPlaylistTracks().filter((lt) => lt.trackId !== trackId);
    writeJSON(STORAGE_KEYS.playlistTracks, links);
  },

  reorderPlaylistTracks(playlistId: string, trackIds: string[]): void {
    const allLinks = this.getAllPlaylistTracks();
    const otherLinks = allLinks.filter((lt) => lt.playlistId !== playlistId);
    const existingLinks = allLinks.filter((lt) => lt.playlistId === playlistId);
    const reordered = trackIds.map((trackId, position) => {
      const existing = existingLinks.find((lt) => lt.trackId === trackId);
      return {
        playlistId,
        trackId,
        position,
        addedAt: existing?.addedAt ?? new Date().toISOString(),
      } as PlaylistTrack;
    });
    writeJSON(STORAGE_KEYS.playlistTracks, [...otherLinks, ...reordered]);
  },
};
