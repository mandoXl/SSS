import { useState } from 'react';
import {
  Home,
  Search,
  Library,
  Heart,
  Plus,
  Music2,
  Trash2,
  X,
} from 'lucide-react';
import type { Playlist } from '../types';
import { Modal } from './Modal';
import { defaultCoverArt } from '../data/mockData';

interface SidebarProps {
  playlists: Playlist[];
  activeView: string;
  onNavigate: (view: string) => void;
  onCreatePlaylist: (name: string, description: string, coverUrl: string) => void;
  onDeletePlaylist: (id: string) => void;
  likedCount: number;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({
  playlists,
  activeView,
  onNavigate,
  onCreatePlaylist,
  onDeletePlaylist,
  likedCount,
  isMobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [coverIdx, setCoverIdx] = useState(0);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'library', label: 'Your Library', icon: Library },
  ];

  const handleCreate = () => {
    if (!name.trim()) return;
    const cover = coverUrl.trim() || defaultCoverArt[coverIdx % defaultCoverArt.length];
    onCreatePlaylist(name.trim(), description.trim(), cover);
    setName('');
    setDescription('');
    setCoverUrl('');
    setCoverIdx(0);
    setShowCreate(false);
  };

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`
          fixed md:relative z-40 md:z-auto
          w-64 h-full flex flex-col gap-2 bg-black md:bg-transparent
          transform transition-transform duration-300
          ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        {/* Top nav section */}
        <div className="bg-spotify-card rounded-lg p-2 flex flex-col gap-1">
          <div className="flex items-center justify-between px-3 py-2 md:hidden">
            <span className="font-bold text-white text-lg">Menu</span>
            <button onClick={onCloseMobile} className="text-neutral-400 hover:text-white">
              <X size={20} />
            </button>
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onCloseMobile();
                }}
                className={`flex items-center gap-4 px-3 py-2 rounded-md font-bold text-sm transition-colors ${
                  active ? 'text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Icon size={24} strokeWidth={active ? 2.5 : 2} />
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Library section */}
        <div className="bg-spotify-card rounded-lg flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <button
              onClick={() => {
                onNavigate('library');
                onCloseMobile();
              }}
              className="flex items-center gap-3 text-neutral-400 hover:text-white transition-colors font-bold text-sm"
            >
              <Library size={24} />
              Your Library
            </button>
            <button
              onClick={() => setShowCreate(true)}
              className="text-neutral-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
              title="Create playlist"
              aria-label="Create playlist"
            >
              <Plus size={20} />
            </button>
          </div>

          {/* Create playlist button */}
          <div className="px-2 pb-2">
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-3 w-full p-2 rounded-md hover:bg-white/5 transition-colors text-left"
            >
              <div className="w-12 h-12 rounded-md bg-gradient-to-br from-spotify-accent to-green-700 flex items-center justify-center">
                <Plus size={24} className="text-black" />
              </div>
              <div>
                <div className="text-white font-bold text-sm">Create Playlist</div>
                <div className="text-neutral-400 text-xs">Let's make something new</div>
              </div>
            </button>

            {/* Liked songs */}
            <button
              onClick={() => {
                onNavigate('liked');
                onCloseMobile();
              }}
              className={`flex items-center gap-3 w-full p-2 rounded-md transition-colors text-left mt-1 ${
                activeView === 'liked' ? 'bg-white/10' : 'hover:bg-white/5'
              }`}
            >
              <div className="w-12 h-12 rounded-md bg-gradient-to-br from-purple-700 via-pink-600 to-spotify-accent flex items-center justify-center">
                <Heart size={20} className="text-white fill-white" />
              </div>
              <div className="min-w-0">
                <div className={`font-bold text-sm truncate ${activeView === 'liked' ? 'text-spotify-accent' : 'text-white'}`}>
                  Liked Songs
                </div>
                <div className="text-neutral-400 text-xs flex items-center gap-1">
                  <Heart size={10} className="fill-spotify-accent text-spotify-accent" />
                  Playlist · {likedCount} song{likedCount !== 1 ? 's' : ''}
                </div>
              </div>
            </button>
          </div>

          {/* Playlists list */}
          <div className="flex-1 overflow-y-auto px-2 pb-2">
            {playlists.map((pl) => {
              const active = activeView === `playlist:${pl.id}`;
              return (
                <div
                  key={pl.id}
                  className={`group flex items-center gap-3 w-full p-2 rounded-md transition-colors cursor-pointer ${
                    active ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                  onClick={() => {
                    onNavigate(`playlist:${pl.id}`);
                    onCloseMobile();
                  }}
                >
                  <img
                    src={pl.coverUrl}
                    alt={pl.name}
                    className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className={`font-bold text-sm truncate ${active ? 'text-spotify-accent' : 'text-white'}`}>
                      {pl.name}
                    </div>
                    <div className="text-neutral-400 text-xs truncate">Playlist · You</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete playlist "${pl.name}"?`)) {
                        onDeletePlaylist(pl.id);
                      }
                    }}
                    className="text-neutral-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                    aria-label="Delete playlist"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
            {playlists.length === 0 && (
              <div className="text-neutral-500 text-sm text-center py-8 px-4">
                <Music2 size={32} className="mx-auto mb-2 opacity-50" />
                No playlists yet. Create one to get started!
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Create Playlist Modal */}
      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="Create Playlist"
      >
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <img
                src={coverUrl.trim() || defaultCoverArt[coverIdx % defaultCoverArt.length]}
                alt="Playlist cover"
                className="w-24 h-24 rounded-lg object-cover bg-spotify-elevated"
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <button
                onClick={() => setCoverIdx((prev) => prev + 1)}
                className="text-xs text-spotify-accent hover:text-spotify-accent-hover transition-colors text-left"
              >
                Shuffle cover art
              </button>
              <input
                type="text"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder="Or paste cover image URL..."
                className="bg-spotify-highlight text-white text-sm rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-spotify-accent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-neutral-300 mb-1.5 font-medium">Playlist Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Awesome Playlist"
              maxLength={50}
              className="w-full bg-spotify-highlight text-white rounded-md px-3 py-2.5 outline-none focus:ring-2 focus:ring-spotify-accent transition-all"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-300 mb-1.5 font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add an optional description..."
              maxLength={200}
              rows={3}
              className="w-full bg-spotify-highlight text-white rounded-md px-3 py-2.5 outline-none focus:ring-2 focus:ring-spotify-accent transition-all resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setShowCreate(false)}
              className="px-5 py-2.5 rounded-full font-bold text-sm text-neutral-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!name.trim()}
              className="px-6 py-2.5 rounded-full font-bold text-sm bg-spotify-accent text-black hover:bg-spotify-accent-hover hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
            >
              Create
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
