import { Play, Clock } from 'lucide-react';
import type { Playlist, Track } from '../types';
import { usePlayer } from '../context/PlayerContext';
import { getGradientFromId, formatTime } from '../lib/utils';

interface HomeViewProps {
  playlists: Playlist[];
  likedCount: number;
  allTracks: Track[];
  onNavigate: (view: string) => void;
}

export function HomeView({ playlists, likedCount, allTracks, onNavigate }: HomeViewProps) {
  const { playQueue, playTrack } = usePlayer();

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  const topItems = [
    { id: 'liked', name: 'Liked Songs', coverUrl: '', gradient: 'from-purple-700 via-pink-600 to-spotify-accent', isLiked: true },
    ...playlists.slice(0, 5).map((pl) => ({
      id: `playlist:${pl.id}`,
      name: pl.name,
      coverUrl: pl.coverUrl,
      gradient: getGradientFromId(pl.id),
      isLiked: false,
      playlistId: pl.id,
    })),
  ];

  const handleQuickPlay = (playlistId: string | undefined, isLiked: boolean) => {
    if (isLiked) {
      const liked = allTracks.filter((t) => t.liked);
      if (liked.length > 0) playQueue(liked, 0);
      return;
    }
    if (!playlistId) return;
    onNavigate(`playlist:${playlistId}`);
  };

  // Recently added tracks (sorted by createdAt desc)
  const recentTracks = [...allTracks]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  return (
    <div className="px-4 md:px-8 py-6">
      <h1 className="text-2xl md:text-3xl font-extrabold text-white mb-6">{greeting}</h1>

      {/* Quick access grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        {topItems.map((item) => {
          const pl = playlists.find((p) => p.id === (item as { playlistId?: string }).playlistId);
          return (
            <div
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="group bg-white/5 hover:bg-white/15 rounded-md overflow-hidden flex items-center cursor-pointer transition-all h-16"
            >
              <div
                className={`w-16 h-16 flex-shrink-0 bg-gradient-to-br ${item.gradient} flex items-center justify-center`}
              >
                {item.coverUrl ? (
                  <img src={item.coverUrl} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl">💚</span>
                )}
              </div>
              <span className="text-white font-bold text-sm px-4 truncate flex-1">{item.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleQuickPlay(pl?.id, item.isLiked);
                }}
                className="mr-4 w-10 h-10 rounded-full bg-spotify-accent flex items-center justify-center opacity-0 group-hover:opacity-100 hover:scale-105 transition-all shadow-lg"
              >
                <Play size={16} className="text-black fill-black ml-0.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Recently Added Tracks */}
      {recentTracks.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl md:text-2xl font-bold text-white">Recently Added</h2>
            <button
              onClick={() => onNavigate('search')}
              className="text-xs font-bold text-neutral-400 hover:text-white transition-colors uppercase tracking-wider"
            >
              Show all
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentTracks.map((track) => (
              <div
                key={track.id}
                onClick={() => playTrack(track, recentTracks)}
                className="group bg-white/5 hover:bg-white/15 rounded-md p-2 flex items-center gap-3 cursor-pointer transition-all h-16"
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded transition-opacity">
                    <Play size={16} className="text-white fill-white" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-bold text-white truncate">{track.title}</div>
                  <div className="text-xs text-neutral-400 truncate">{track.artist}</div>
                </div>
                <span className="text-xs text-neutral-500 flex items-center gap-1 mr-2 flex-shrink-0">
                  <Clock size={12} />
                  {formatTime(track.duration)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Your Playlists */}
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Your Playlists</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {playlists.map((pl) => (
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
            <div className="text-neutral-400 text-xs truncate mt-1">
              {pl.description || 'Playlist'}
            </div>
          </div>
        ))}
      </div>

      {playlists.length === 0 && (
        <div className="text-center py-16 text-neutral-500">
          <p className="text-lg font-medium">No playlists yet</p>
          <p className="text-sm mt-1">Create a playlist from the sidebar to get started</p>
        </div>
      )}
    </div>
  );
}
