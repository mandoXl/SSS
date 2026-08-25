import { useState, useMemo } from 'react';
import { Search, Play } from 'lucide-react';
import type { Track, Playlist } from '../types';
import { usePlayer } from '../context/PlayerContext';
import { TrackTable } from './TrackTable';
import { formatTotalDuration, getGradientFromId } from '../lib/utils';

interface SearchViewProps {
  allTracks: Track[];
  allPlaylists: Playlist[];
  onToggleLike: (trackId: string) => void;
  onNavigate: (view: string) => void;
  onDeleteTrack?: (trackId: string) => void;
  onPlayNext?: (track: Track) => void;
}

export function SearchView({ allTracks, allPlaylists, onToggleLike, onNavigate, onDeleteTrack, onPlayNext }: SearchViewProps) {
  const { playTrack } = usePlayer();
  const [query, setQuery] = useState('');

  const filteredTracks = useMemo(() => {
    if (!query.trim()) return [];
    const lower = query.toLowerCase();
    return allTracks.filter(
      (t) =>
        t.title.toLowerCase().includes(lower) ||
        t.artist.toLowerCase().includes(lower) ||
        t.album.toLowerCase().includes(lower) ||
        t.genre.toLowerCase().includes(lower)
    );
  }, [allTracks, query]);

  const filteredPlaylists = useMemo(() => {
    if (!query.trim()) return [];
    const lower = query.toLowerCase();
    return allPlaylists.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower)
    );
  }, [allPlaylists, query]);

  const genres = useMemo(() => {
    const set = new Set(allTracks.map((t) => t.genre).filter(Boolean));
    return Array.from(set);
  }, [allTracks]);

  const genreColors: Record<string, string> = {
    Electronic: 'from-cyan-600 to-blue-800',
    Ambient: 'from-teal-600 to-green-800',
    'Lo-Fi': 'from-orange-600 to-red-800',
    Chill: 'from-pink-600 to-purple-800',
    'Hip-Hop': 'from-amber-600 to-orange-800',
  };

  const hasResults = query.trim() && (filteredTracks.length > 0 || filteredPlaylists.length > 0);

  return (
    <div className="px-4 md:px-8 py-6">
      {/* Search bar */}
      <div className="relative max-w-md mb-8">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What do you want to listen to?"
          className="w-full bg-white text-black text-base rounded-full pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-spotify-accent transition-all placeholder:text-neutral-500 font-medium"
          autoFocus
        />
      </div>

      {!query.trim() ? (
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Browse Genres</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {genres.map((genre) => (
              <div
                key={genre}
                onClick={() => setQuery(genre)}
                className={`bg-gradient-to-br ${genreColors[genre] || 'from-neutral-700 to-neutral-900'} rounded-lg p-4 h-32 flex items-end cursor-pointer hover:scale-[1.02] transition-transform overflow-hidden`}
              >
                <span className="text-white font-bold text-lg">{genre}</span>
              </div>
            ))}
          </div>
        </div>
      ) : !hasResults ? (
        <div className="text-center py-16 text-neutral-500">
          <Search size={48} className="mx-auto mb-3 opacity-40" />
          <p className="text-lg font-medium">No results found for "{query}"</p>
          <p className="text-sm mt-1">Check your spelling or try different keywords</p>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {/* Playlists */}
          {filteredPlaylists.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Playlists</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredPlaylists.map((pl) => (
                  <div
                    key={pl.id}
                    onClick={() => onNavigate(`playlist:${pl.id}`)}
                    className="group bg-spotify-card hover:bg-spotify-elevated rounded-lg p-3 cursor-pointer transition-all"
                  >
                    <div className="relative mb-3">
                      <img
                        src={pl.coverUrl}
                        alt={pl.name}
                        className="w-full aspect-square rounded-md object-cover shadow-lg"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate(`playlist:${pl.id}`);
                        }}
                        className="absolute bottom-2 right-2 w-11 h-11 rounded-full bg-spotify-accent flex items-center justify-center opacity-0 group-hover:opacity-100 hover:scale-105 transition-all shadow-xl translate-y-2 group-hover:translate-y-0"
                      >
                        <Play size={18} className="text-black fill-black ml-0.5" />
                      </button>
                    </div>
                    <div className="font-bold text-white text-sm truncate">{pl.name}</div>
                    <div className="text-neutral-400 text-xs truncate mt-1">{pl.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tracks */}
          {filteredTracks.length > 0 && (
            <div>
              <h2 className="text-xl font-bold text-white mb-4">Songs</h2>
              <TrackTable
                tracks={filteredTracks}
                onToggleLike={onToggleLike}
                onDeleteTrack={onDeleteTrack}
                onPlayNext={onPlayNext}
                showAddedAt={false}
                showAlbum={true}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
