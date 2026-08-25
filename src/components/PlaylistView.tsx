import { useState, useMemo } from 'react';
import { Play, Pause, Search, Plus, Music2, Heart, Clock } from 'lucide-react';
import type { Track, Playlist } from '../types';
import { TrackTable } from './TrackTable';
import { usePlayer } from '../context/PlayerContext';
import { formatTotalDuration, getGradientFromId } from '../lib/utils';

interface PlaylistViewProps {
  playlist: Playlist | null;
  tracks: Track[];
  onToggleLike: (trackId: string) => void;
  onAddTrack: () => void;
  onDeleteTrack?: (trackId: string) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  onPlayNext?: (track: Track) => void;
  variant?: 'playlist' | 'liked';
}

export function PlaylistView({ playlist, tracks, onToggleLike, onAddTrack, onDeleteTrack, onReorder, onPlayNext, variant = 'playlist' }: PlaylistViewProps) {
  const { currentTrack, isPlaying, playQueue, togglePlay } = usePlayer();
  const [filter, setFilter] = useState('');

  const filteredTracks = useMemo(() => {
    if (!filter.trim()) return tracks;
    const lower = filter.toLowerCase();
    return tracks.filter(
      (t) =>
        t.title.toLowerCase().includes(lower) ||
        t.artist.toLowerCase().includes(lower) ||
        t.album.toLowerCase().includes(lower)
    );
  }, [tracks, filter]);

  const totalDuration = useMemo(
    () => tracks.reduce((sum, t) => sum + t.duration, 0),
    [tracks]
  );

  const isThisQueuePlaying = useMemo(() => {
    if (!currentTrack || !isPlaying) return false;
    return tracks.some((t) => t.id === currentTrack.id);
  }, [currentTrack, isPlaying, tracks]);

  const handlePlayAll = () => {
    if (isThisQueuePlaying) {
      togglePlay();
    } else if (tracks.length > 0) {
      playQueue(tracks, 0);
    }
  };

  const gradient = variant === 'liked'
    ? 'from-purple-700 via-pink-600 to-spotify-base'
    : getGradientFromId(playlist?.id || 'default');

  const title = variant === 'liked' ? 'Liked Songs' : playlist?.name || 'Playlist';
  const coverUrl = variant === 'liked' ? null : playlist?.coverUrl;
  const description = variant === 'liked' ? '' : playlist?.description || '';

  return (
    <div className="flex flex-col">
      {/* Header banner */}
      <div className={`bg-gradient-to-b ${gradient} px-4 md:px-8 pt-6 pb-6`}>
        <div className="flex items-end gap-4 md:gap-6 flex-col md:flex-row">
          <div className="flex-shrink-0 w-full md:w-48 md:h-48 shadow-2xl rounded overflow-hidden">
            {variant === 'liked' ? (
              <div className="w-full h-48 md:h-full bg-gradient-to-br from-purple-700 via-pink-600 to-spotify-accent flex items-center justify-center">
                <Heart size={64} className="text-white fill-white" />
              </div>
            ) : coverUrl ? (
              <img src={coverUrl} alt={title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-spotify-elevated flex items-center justify-center">
                <Music2 size={48} className="text-neutral-500" />
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <span className="text-xs font-bold uppercase tracking-wider text-white/90">Playlist</span>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              {title}
            </h1>
            {description && (
              <p className="text-sm text-white/70 line-clamp-2">{description}</p>
            )}
            <div className="flex items-center gap-1 text-sm text-white/90 flex-wrap">
              <span className="font-bold">Spotifly</span>
              <span className="text-white/60">·</span>
              <span>{tracks.length} song{tracks.length !== 1 ? 's' : ''}</span>
              {totalDuration > 0 && (
                <>
                  <span className="text-white/60">·</span>
                  <span className="text-white/70">{formatTotalDuration(totalDuration)}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action bar */}
      <div className="bg-gradient-to-b from-black/30 to-spotify-base px-4 md:px-8 py-4 flex items-center gap-4 flex-wrap">
        <button
          onClick={handlePlayAll}
          disabled={tracks.length === 0}
          className="w-14 h-14 rounded-full bg-spotify-accent flex items-center justify-center hover:bg-spotify-accent-hover hover:scale-105 transition-all shadow-lg disabled:opacity-50 disabled:hover:scale-100"
          aria-label={isThisQueuePlaying ? 'Pause' : 'Play'}
        >
          {isThisQueuePlaying ? (
            <Pause size={24} className="text-black fill-black" />
          ) : (
            <Play size={24} className="text-black fill-black ml-0.5" />
          )}
        </button>

        <button
          onClick={onAddTrack}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-all"
        >
          <Plus size={18} />
          Add Track
        </button>

        {/* Filter / Search */}
        <div className="relative flex-1 min-w-[200px] max-w-xs ml-auto">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search in playlist..."
            className="w-full bg-spotify-highlight text-white text-sm rounded-full pl-9 pr-4 py-2 outline-none focus:ring-2 focus:ring-spotify-accent transition-all placeholder:text-neutral-500"
          />
        </div>
      </div>

      {/* Track list */}
      <div className="px-2 md:px-6 pb-8">
        {filteredTracks.length > 0 ? (
          <TrackTable
            tracks={filteredTracks}
            onToggleLike={onToggleLike}
            onDeleteTrack={onDeleteTrack}
            onReorder={onReorder}
            onPlayNext={onPlayNext}
            enableReorder={!!onReorder && !filter.trim()}
          />
        ) : filter.trim() ? (
          <div className="text-center py-16 text-neutral-500">
            <Search size={48} className="mx-auto mb-3 opacity-40" />
            <p className="text-lg font-medium">No tracks found</p>
            <p className="text-sm mt-1">Try a different search term</p>
          </div>
        ) : (
          <div className="text-center py-16 text-neutral-500">
            <Clock size={48} className="mx-auto mb-3 opacity-40" />
            <p className="text-lg font-medium">No tracks in this playlist yet</p>
            <p className="text-sm mt-1">Click "Add Track" to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
