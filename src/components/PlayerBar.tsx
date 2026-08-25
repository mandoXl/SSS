import { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  Volume1,
  VolumeX,
  ListMusic,
  Heart,
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';
import { LikeButton } from './LikeButton';
import { formatTime } from '../lib/utils';

interface PlayerBarProps {
  onToggleLike: (trackId: string) => void;
  onShowQueue: () => void;
}

export function PlayerBar({ onToggleLike, onShowQueue }: PlayerBarProps) {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isShuffled,
    repeatMode,
    togglePlay,
    next,
    previous,
    seek,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
  } = usePlayer();

  const [isSeeking, setIsSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);
  const seekRef = useRef<HTMLInputElement>(null);

  const displayTime = isSeeking ? seekValue : currentTime;
  const progressPercent = duration > 0 ? (displayTime / duration) * 100 : 0;
  const volumePercent = (isMuted ? 0 : volume) * 100;

  const handleSeekStart = () => {
    setIsSeeking(true);
    setSeekValue(currentTime);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSeekValue(Number(e.target.value));
  };

  const handleSeekEnd = (e: React.SyntheticEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const value = Number(target.value);
    seek(value);
    setIsSeeking(false);
  };

  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  const RepeatIcon = repeatMode === 'one' ? Repeat1 : Repeat;

  return (
    <footer className="h-20 md:h-[88px] bg-black border-t border-white/5 px-2 md:px-4 flex items-center justify-between gap-2 z-20">
      {/* Left: track info */}
      <div className="flex items-center gap-3 w-[30%] min-w-0">
        {currentTrack ? (
          <>
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              className="w-12 h-12 md:w-14 md:h-14 rounded object-cover flex-shrink-0"
            />
            <div className="min-w-0 hidden sm:block">
              <div className="text-sm font-medium text-white truncate hover:underline cursor-pointer">
                {currentTrack.title}
              </div>
              <div className="text-xs text-neutral-400 truncate hover:text-white hover:underline cursor-pointer">
                {currentTrack.artist}
              </div>
            </div>
            <div className="hidden sm:flex ml-2">
              <LikeButton
                liked={currentTrack.liked}
                onToggle={() => onToggleLike(currentTrack.id)}
              />
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3 text-neutral-500">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded bg-spotify-elevated flex items-center justify-center flex-shrink-0">
              <Heart size={20} className="opacity-30" />
            </div>
            <div className="hidden sm:block">
              <div className="text-sm text-neutral-500">No track playing</div>
              <div className="text-xs text-neutral-600">Select a song to start</div>
            </div>
          </div>
        )}
      </div>

      {/* Center: playback controls */}
      <div className="flex flex-col items-center gap-1 flex-1 max-w-[600px]">
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={toggleShuffle}
            className={`transition-colors hidden sm:block ${isShuffled ? 'text-spotify-accent' : 'text-neutral-400 hover:text-white'}`}
            title="Shuffle"
            aria-label="Shuffle"
          >
            <Shuffle size={18} />
          </button>

          <button
            onClick={previous}
            className="text-neutral-300 hover:text-white transition-colors disabled:opacity-30"
            disabled={!currentTrack}
            aria-label="Previous"
          >
            <SkipBack size={20} className="fill-current" />
          </button>

          <button
            onClick={togglePlay}
            disabled={!currentTrack}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-all disabled:opacity-30 disabled:hover:scale-100"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause size={18} className="text-black fill-black" />
            ) : (
              <Play size={18} className="text-black fill-black ml-0.5" />
            )}
          </button>

          <button
            onClick={next}
            className="text-neutral-300 hover:text-white transition-colors disabled:opacity-30"
            disabled={!currentTrack}
            aria-label="Next"
          >
            <SkipForward size={20} className="fill-current" />
          </button>

          <button
            onClick={cycleRepeat}
            className={`transition-colors hidden sm:block ${repeatMode !== 'off' ? 'text-spotify-accent' : 'text-neutral-400 hover:text-white'}`}
            title={`Repeat: ${repeatMode}`}
            aria-label="Repeat"
          >
            <RepeatIcon size={18} />
          </button>
        </div>

        {/* Seek bar */}
        <div className="flex items-center gap-2 w-full px-2">
          <span className="text-[11px] text-neutral-400 tabular-nums w-9 text-right hidden sm:inline">
            {formatTime(displayTime)}
          </span>
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 right-0 flex items-center pointer-events-none">
              <div className="h-1 w-full rounded-full bg-white/20" />
            </div>
            <div
              className="absolute inset-y-0 left-0 flex items-center pointer-events-none"
              style={{ width: `${progressPercent}%` }}
            >
              <div className={`h-1 w-full rounded-full ${isSeeking ? 'bg-spotify-accent' : 'bg-white group-hover:bg-spotify-accent'} transition-colors`} />
            </div>
            <input
              ref={seekRef}
              type="range"
              min="0"
              max={duration || 0}
              step="0.1"
              value={displayTime}
              onMouseDown={handleSeekStart}
              onChange={handleSeekChange}
              onMouseUp={handleSeekEnd}
              onTouchStart={handleSeekStart}
              onTouchEnd={(e) => handleSeekEnd(e)}
              disabled={!currentTrack}
              className="relative w-full h-4 opacity-0 cursor-pointer disabled:cursor-default"
            />
          </div>
          <span className="text-[11px] text-neutral-400 tabular-nums w-9 hidden sm:inline">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Right: volume + queue */}
      <div className="flex items-center justify-end gap-2 w-[30%] min-w-0">
        <button
          onClick={onShowQueue}
          className="text-neutral-400 hover:text-white transition-colors hidden md:block"
          aria-label="Queue"
          title="Queue"
        >
          <ListMusic size={20} />
        </button>

        <div className="flex items-center gap-1 group">
          <button
            onClick={toggleMute}
            className="text-neutral-400 hover:text-white transition-colors flex-shrink-0"
            aria-label="Mute"
          >
            <VolumeIcon size={20} />
          </button>
          <div className="relative w-24 hidden sm:block">
            <div className="absolute inset-y-0 left-0 right-0 flex items-center pointer-events-none">
              <div className="h-1 w-full rounded-full bg-white/20" />
            </div>
            <div
              className="absolute inset-y-0 left-0 flex items-center pointer-events-none"
              style={{ width: `${volumePercent}%` }}
            >
              <div className="h-1 w-full rounded-full bg-white group-hover:bg-spotify-accent transition-colors" />
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="relative w-full h-4 opacity-0 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
