import { useState, useRef, type DragEvent } from 'react';
import {
  Play,
  Clock,
  MoreHorizontal,
  Trash2,
  ListPlus,
  GripVertical,
} from 'lucide-react';
import type { Track } from '../types';
import { usePlayer } from '../context/PlayerContext';
import { LikeButton } from './LikeButton';
import { EqualizerBars } from './EqualizerBars';
import { formatTime, formatAddedDate } from '../lib/utils';

interface TrackTableProps {
  tracks: Track[];
  onToggleLike: (trackId: string) => void;
  onDeleteTrack?: (trackId: string) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  onPlayNext?: (track: Track) => void;
  showAddedAt?: boolean;
  showAlbum?: boolean;
  enableReorder?: boolean;
}

export function TrackTable({
  tracks,
  onToggleLike,
  onDeleteTrack,
  onReorder,
  onPlayNext,
  showAddedAt = true,
  showAlbum = true,
  enableReorder = false,
}: TrackTableProps) {
  const { currentTrack, isPlaying, playTrack, togglePlay } = usePlayer();
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragCounter = useRef(0);

  const handleRowClick = (track: Track) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      playTrack(track, tracks);
    }
  };

  const handleDelete = (track: Track) => {
    setOpenMenuId(null);
    if (confirm(`Delete "${track.title}" by ${track.artist}? This will remove it from all playlists.`)) {
      onDeleteTrack?.(track.id);
    }
  };

  const handlePlayNext = (track: Track) => {
    setOpenMenuId(null);
    onPlayNext?.(track);
  };

  // Drag and drop handlers
  const handleDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
    if (!enableReorder) return;
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, index: number) => {
    if (!enableReorder || dragIndex === null) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) setDragOverIndex(index);
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>, index: number) => {
    if (!enableReorder || dragIndex === null) return;
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    if (!enableReorder) return;
    dragCounter.current -= 1;
    if (dragCounter.current <= 0) {
      setDragOverIndex(null);
      dragCounter.current = 0;
    }
  };

  const handleDragEnterContainer = () => {
    dragCounter.current += 1;
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, index: number) => {
    if (!enableReorder || dragIndex === null) return;
    e.preventDefault();
    e.stopPropagation();
    if (dragIndex !== index) {
      onReorder?.(dragIndex, index);
    }
    setDragIndex(null);
    setDragOverIndex(null);
    dragCounter.current = 0;
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
    dragCounter.current = 0;
  };

  if (tracks.length === 0) {
    return (
      <div className="text-center py-16 text-neutral-500">
        <Clock size={48} className="mx-auto mb-3 opacity-40" />
        <p className="text-lg font-medium">No tracks in this playlist yet</p>
        <p className="text-sm mt-1">Add some tracks to get started</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Table header */}
      <div
        className={`grid gap-4 px-4 py-2 text-xs text-neutral-400 uppercase tracking-wider border-b border-white/10 mb-2 sticky top-0 bg-gradient-to-b from-black/80 to-spotify-base/80 backdrop-blur-sm z-10 ${
          enableReorder ? 'grid-cols-[20px_16px_1fr_auto] md:grid-cols-[20px_16px_4fr_3fr_2fr_56px]' : 'grid-cols-[16px_1fr_auto] md:grid-cols-[16px_4fr_3fr_2fr_56px]'
        }`}
      >
        {enableReorder && <div className="hidden md:block" />}
        <div className="text-center">#</div>
        <div>Title</div>
        {showAlbum && <div className="hidden md:block">Album</div>}
        {showAddedAt && <div className="hidden md:block">Date Added</div>}
        <div className="flex justify-end">
          <Clock size={14} />
        </div>
      </div>

      {/* Track rows */}
      {tracks.map((track, index) => {
        const isCurrent = currentTrack?.id === track.id;
        const isCurrentPlaying = isCurrent && isPlaying;
        const isHovered = hoveredRow === track.id;
        const isDragging = dragIndex === index;
        const isDragOver = dragOverIndex === index && dragIndex !== index;
        const menuOpen = openMenuId === track.id;

        return (
          <div
            key={track.id}
            draggable={enableReorder}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={(e) => handleDragOver(e, index)}
            onDragEnter={(e) => { handleDragEnter(e, index); handleDragEnterContainer(); }}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, index)}
            onDragEnd={handleDragEnd}
            onMouseEnter={() => setHoveredRow(track.id)}
            onMouseLeave={() => { setHoveredRow(null); if (menuOpen) setOpenMenuId(null); }}
            onDoubleClick={() => handleRowClick(track)}
            onClick={() => { if (!menuOpen) handleRowClick(track); }}
            className={`grid gap-4 px-4 py-2 rounded-md transition-all cursor-pointer group relative ${
              enableReorder ? 'grid-cols-[20px_16px_1fr_auto] md:grid-cols-[20px_16px_4fr_3fr_2fr_56px]' : 'grid-cols-[16px_1fr_auto] md:grid-cols-[16px_4fr_3fr_2fr_56px]'
            } ${
              isCurrent ? 'bg-white/10' : 'hover:bg-white/5'
            } ${isDragging ? 'opacity-40' : ''} ${isDragOver ? 'border-t-2 border-spotify-accent' : ''}`}
          >
            {/* Drag handle (desktop only) */}
            {enableReorder && (
              <div className="hidden md:flex items-center justify-center text-neutral-500">
                <GripVertical
                  size={16}
                  className={`transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                />
              </div>
            )}

            {/* Track number / play indicator */}
            <div className="flex items-center justify-center text-sm">
              {isCurrentPlaying ? (
                <div className="flex items-center justify-center w-4 h-4">
                  <EqualizerBars className="h-4" />
                </div>
              ) : isHovered ? (
                <Play size={14} className="text-white fill-white" />
              ) : (
                <span className={isCurrent ? 'text-spotify-accent' : 'text-neutral-400'}>
                  {index + 1}
                </span>
              )}
            </div>

            {/* Title + cover + artist */}
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={track.coverUrl}
                alt={track.title}
                className="w-10 h-10 rounded object-cover flex-shrink-0"
              />
              <div className="min-w-0">
                <div className={`text-sm font-medium truncate ${isCurrent ? 'text-spotify-accent' : 'text-white'}`}>
                  {track.title}
                </div>
                <div className="text-sm text-neutral-400 truncate hover:text-white hover:underline transition-colors">
                  {track.artist}
                </div>
              </div>
            </div>

            {/* Album */}
            {showAlbum && (
              <div className="hidden md:flex items-center text-sm text-neutral-400 truncate hover:text-white transition-colors">
                {track.album}
              </div>
            )}

            {/* Date added + like */}
            {showAddedAt && (
              <div className="hidden md:flex items-center gap-3 text-sm text-neutral-400">
                <span className="truncate">{formatAddedDate(track.createdAt)}</span>
                <LikeButton
                  liked={track.liked}
                  onToggle={() => onToggleLike(track.id)}
                />
              </div>
            )}

            {/* Duration + actions */}
            <div className="flex items-center justify-end gap-2 text-sm text-neutral-400">
              <span className="hidden md:inline">{formatTime(track.duration)}</span>
              <div className="md:hidden">
                <LikeButton liked={track.liked} onToggle={() => onToggleLike(track.id)} size={14} />
              </div>

              {/* More options menu */}
              {(onDeleteTrack || onPlayNext) && (
                <div className="relative">
                  <button
                    className="hidden md:flex text-neutral-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(menuOpen ? null : track.id);
                    }}
                    aria-label="More options"
                  >
                    <MoreHorizontal size={18} />
                  </button>

                  {menuOpen && (
                    <div
                      className="absolute right-0 bottom-full mb-2 w-44 bg-spotify-elevated rounded-md shadow-2xl border border-white/10 py-1 z-30"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {onPlayNext && (
                        <button
                          onClick={() => handlePlayNext(track)}
                          className="flex items-center gap-3 w-full px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors text-left"
                        >
                          <ListPlus size={16} className="text-neutral-400" />
                          Play Next
                        </button>
                      )}
                      {onDeleteTrack && (
                        <button
                          onClick={() => handleDelete(track)}
                          className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-400 hover:bg-white/10 transition-colors text-left"
                        >
                          <Trash2 size={16} />
                          Delete Track
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
