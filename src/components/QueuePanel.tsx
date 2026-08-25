import { Play, Pause, X, ListMusic } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { formatTime } from '../lib/utils';

interface QueuePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function QueuePanel({ isOpen, onClose }: QueuePanelProps) {
  const { queue, queueIndex, isPlaying, playTrack, togglePlay, currentTrack } = usePlayer();

  const upcoming = queue.slice(queueIndex + 1);
  const current = queue[queueIndex];

  const handleTrackClick = (trackId: string, idx: number) => {
    const track = queue[idx];
    if (!track) return;
    if (currentTrack?.id === trackId) {
      togglePlay();
    } else {
      playTrack(track, queue);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 bottom-20 w-full sm:w-96 bg-spotify-elevated z-40 shadow-2xl flex flex-col animate-slide-up">
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <h3 className="font-bold text-white text-lg flex items-center gap-2">
          <ListMusic size={20} />
          Queue
        </h3>
        <button
          onClick={onClose}
          className="text-neutral-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-all"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {queue.length === 0 ? (
          <div className="text-center py-12 text-neutral-500">
            <ListMusic size={40} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">Queue is empty</p>
          </div>
        ) : (
          <>
            {/* Now playing */}
            {current && (
              <div className="mb-6">
                <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-bold mb-2">Now Playing</h4>
                <div
                  onClick={() => handleTrackClick(current.id, queueIndex)}
                  className="flex items-center gap-3 p-2 rounded-md hover:bg-white/5 cursor-pointer group"
                >
                  <img src={current.coverUrl} alt={current.title} className="w-10 h-10 rounded object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-spotify-accent truncate">{current.title}</div>
                    <div className="text-xs text-neutral-400 truncate">{current.artist}</div>
                  </div>
                  <button className="text-spotify-accent">
                    {isPlaying ? <Pause size={16} className="fill-current" /> : <Play size={16} className="fill-current" />}
                  </button>
                </div>
              </div>
            )}

            {/* Upcoming */}
            {upcoming.length > 0 && (
              <div>
                <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-bold mb-2">
                  Next Up ({upcoming.length})
                </h4>
                {upcoming.map((track, i) => {
                  const actualIdx = queueIndex + 1 + i;
                  return (
                    <div
                      key={`${track.id}-${i}`}
                      onClick={() => handleTrackClick(track.id, actualIdx)}
                      className="flex items-center gap-3 p-2 rounded-md hover:bg-white/5 cursor-pointer group"
                    >
                      <img src={track.coverUrl} alt={track.title} className="w-10 h-10 rounded object-cover" />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-white truncate group-hover:text-white">{track.title}</div>
                        <div className="text-xs text-neutral-400 truncate">{track.artist}</div>
                      </div>
                      <span className="text-xs text-neutral-400">{formatTime(track.duration)}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
