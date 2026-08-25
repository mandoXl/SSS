import { useState } from 'react';
import { Modal } from './Modal';
import { Upload, Music, FileAudio, ImageIcon, Check } from 'lucide-react';
import type { Playlist } from '../types';

const DEFAULT_PLACEHOLDER =
  'data:image/svg+xml,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="#282828"/><path d="M125 95 L125 205 L175 175 L175 125 Z M175 125 L200 110 L200 190 L175 175" fill="#535353" stroke="#727272" stroke-width="2"/><circle cx="150" cy="150" r="65" fill="none" stroke="#535353" stroke-width="3"/></svg>`
  );

interface AddTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTrack: (track: {
    title: string;
    artist: string;
    album: string;
    genre: string;
    duration: number;
    audioUrl: string;
    coverUrl: string;
    playlistIds: string[];
  }) => void;
  playlists: Playlist[];
  defaultPlaylistId?: string;
}

const GENRES = ['Electronic', 'Ambient', 'Lo-Fi', 'Chill', 'Hip-Hop', 'Pop', 'Rock', 'Jazz', 'Classical', 'R&B', 'Other'];

export function AddTrackModal({ isOpen, onClose, onAddTrack, playlists, defaultPlaylistId }: AddTrackModalProps) {
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [album, setAlbum] = useState('');
  const [genre, setGenre] = useState('Electronic');
  const [audioUrl, setAudioUrl] = useState('');
  const [audioFileName, setAudioFileName] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [coverFileName, setCoverFileName] = useState('');
  const [duration, setDuration] = useState(180);
  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>(
    defaultPlaylistId ? [defaultPlaylistId] : []
  );
  const [error, setError] = useState('');

  const reset = () => {
    setTitle('');
    setArtist('');
    setAlbum('');
    setGenre('Electronic');
    setAudioUrl('');
    setAudioFileName('');
    setCoverUrl('');
    setCoverFileName('');
    setDuration(180);
    setSelectedPlaylists(defaultPlaylistId ? [defaultPlaylistId] : []);
    setError('');
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSubmit = () => {
    if (!title.trim() || !artist.trim()) {
      setError('Title and artist are required');
      return;
    }
    if (!audioUrl.trim()) {
      setError('Audio source is required — paste a URL or upload a file');
      return;
    }
    onAddTrack({
      title: title.trim(),
      artist: artist.trim(),
      album: album.trim() || 'Unknown Album',
      genre: genre.trim(),
      duration: duration,
      audioUrl: audioUrl.trim(),
      coverUrl: coverUrl.trim() || DEFAULT_PLACEHOLDER,
      playlistIds: selectedPlaylists,
    });
    reset();
    onClose();
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    setAudioFileName(file.name);
    const audio = new Audio();
    audio.src = url;
    audio.addEventListener('loadedmetadata', () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(Math.floor(audio.duration));
      }
    }, { once: true });
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCoverUrl(url);
    setCoverFileName(file.name);
  };

  const togglePlaylist = (id: string) => {
    setSelectedPlaylists((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const hasAudioFile = audioUrl.startsWith('blob:');
  const hasCoverFile = coverUrl.startsWith('blob:');
  const previewCover = coverUrl.trim() || DEFAULT_PLACEHOLDER;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Track" maxWidth="max-w-xl">
      <div className="flex flex-col gap-4">
        {/* Cover preview + upload */}
        <div className="flex gap-4 items-start">
          <img
            src={previewCover}
            alt="Track cover"
            className="w-24 h-24 rounded-lg object-cover bg-spotify-elevated flex-shrink-0 border border-white/10"
          />
          <div className="flex flex-col gap-2 flex-1">
            <label className="cursor-pointer flex items-center gap-2 text-sm text-spotify-accent hover:text-spotify-accent-hover transition-colors font-medium">
              <ImageIcon size={16} />
              Upload cover image
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                className="hidden"
              />
            </label>
            {hasCoverFile && (
              <span className="text-xs text-green-400 flex items-center gap-1">
                <Check size={12} /> {coverFileName}
              </span>
            )}
            <input
              type="text"
              value={hasCoverFile ? '' : coverUrl}
              onChange={(e) => {
                setCoverUrl(e.target.value);
                setCoverFileName('');
              }}
              placeholder="Or paste cover image URL..."
              className="bg-spotify-highlight text-white text-sm rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-spotify-accent transition-all"
            />
            {!hasCoverFile && !coverUrl.trim() && (
              <span className="text-xs text-neutral-500">Default placeholder will be used</span>
            )}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-sm text-neutral-300 mb-1.5 font-medium">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Track title"
            maxLength={100}
            className="w-full bg-spotify-highlight text-white rounded-md px-3 py-2.5 outline-none focus:ring-2 focus:ring-spotify-accent transition-all"
            autoFocus
          />
        </div>

        {/* Artist */}
        <div>
          <label className="block text-sm text-neutral-300 mb-1.5 font-medium">Artist *</label>
          <input
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder="Artist name"
            maxLength={100}
            className="w-full bg-spotify-highlight text-white rounded-md px-3 py-2.5 outline-none focus:ring-2 focus:ring-spotify-accent transition-all"
          />
        </div>

        {/* Album + Genre */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm text-neutral-300 mb-1.5 font-medium">Album</label>
            <input
              type="text"
              value={album}
              onChange={(e) => setAlbum(e.target.value)}
              placeholder="Album name"
              maxLength={100}
              className="w-full bg-spotify-highlight text-white rounded-md px-3 py-2.5 outline-none focus:ring-2 focus:ring-spotify-accent transition-all"
            />
          </div>
          <div>
            <label className="block text-sm text-neutral-300 mb-1.5 font-medium">Genre</label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full bg-spotify-highlight text-white rounded-md px-3 py-2.5 outline-none focus:ring-2 focus:ring-spotify-accent transition-all cursor-pointer"
            >
              {GENRES.map((g) => (
                <option key={g} value={g} className="bg-spotify-highlight">{g}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Audio URL / Upload */}
        <div>
          <label className="block text-sm text-neutral-300 mb-1.5 font-medium">Audio Source *</label>
          <input
            type="text"
            value={hasAudioFile ? '' : audioUrl}
            onChange={(e) => {
              setAudioUrl(e.target.value);
              setAudioFileName('');
            }}
            placeholder="Paste audio URL (e.g. https://...mp3)"
            className="w-full bg-spotify-highlight text-white rounded-md px-3 py-2.5 outline-none focus:ring-2 focus:ring-spotify-accent transition-all mb-2"
          />
          <div className="flex items-center gap-3 flex-wrap">
            <label className="cursor-pointer flex items-center gap-1.5 text-xs text-spotify-accent hover:text-spotify-accent-hover transition-colors font-medium">
              <FileAudio size={14} />
              Upload audio file
              <input
                type="file"
                accept="audio/*"
                onChange={handleAudioUpload}
                className="hidden"
              />
            </label>
            {hasAudioFile && (
              <span className="text-xs text-green-400 flex items-center gap-1">
                <Check size={12} /> {audioFileName}
              </span>
            )}
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm text-neutral-300 mb-1.5 font-medium">
            Duration (seconds): {duration}s
          </label>
          <input
            type="range"
            min="30"
            max="600"
            step="1"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full accent-spotify-accent"
          />
        </div>

        {/* Add to playlists */}
        {playlists.length > 0 && (
          <div>
            <label className="block text-sm text-neutral-300 mb-1.5 font-medium">Add to Playlists</label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {playlists.map((pl) => (
                <button
                  key={pl.id}
                  onClick={() => togglePlaylist(pl.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedPlaylists.includes(pl.id)
                      ? 'bg-spotify-accent text-black'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {pl.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="text-red-400 text-sm font-medium">{error}</div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={handleClose}
            className="px-5 py-2.5 rounded-full font-bold text-sm text-neutral-300 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-full font-bold text-sm bg-spotify-accent text-black hover:bg-spotify-accent-hover hover:scale-105 transition-all"
          >
            Add Track
          </button>
        </div>
      </div>
    </Modal>
  );
}

export { DEFAULT_PLACEHOLDER };
