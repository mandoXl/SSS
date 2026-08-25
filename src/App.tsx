import { useState, useEffect, useCallback, useMemo } from 'react';
import { Menu, ChevronLeft, ChevronRight } from 'lucide-react';
import { PlayerProvider, usePlayer } from './context/PlayerContext';
import { Sidebar } from './components/Sidebar';
import { PlaylistView } from './components/PlaylistView';
import { HomeView } from './components/HomeView';
import { SearchView } from './components/SearchView';
import { PlayerBar } from './components/PlayerBar';
import { QueuePanel } from './components/QueuePanel';
import { AddTrackModal } from './components/AddTrackModal';
import { dataStore } from './lib/dataStore';
import type { Track, Playlist } from './types';

function AppContent() {
  const { audioRef, playNext } = usePlayer();

  const [tracks, setTracks] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [activeView, setActiveView] = useState('home');
  const [showAddTrack, setShowAddTrack] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const refreshData = useCallback(() => {
    setTracks(dataStore.getAllTracks());
    setPlaylists(dataStore.getAllPlaylists());
  }, []);

  useEffect(() => {
    dataStore.init();
    refreshData();
    setLoaded(true);
  }, [refreshData]);

  const handleToggleLike = useCallback((trackId: string) => {
    dataStore.toggleLike(trackId);
    refreshData();
  }, [refreshData]);

  const handleCreatePlaylist = useCallback((name: string, description: string, coverUrl: string) => {
    const newPl = dataStore.createPlaylist(name, description, coverUrl);
    refreshData();
    setActiveView(`playlist:${newPl.id}`);
  }, [refreshData]);

  const handleDeletePlaylist = useCallback((id: string) => {
    dataStore.deletePlaylist(id);
    refreshData();
    if (activeView === `playlist:${id}`) {
      setActiveView('home');
    }
  }, [refreshData, activeView]);

  const handleAddTrack = useCallback((trackData: {
    title: string;
    artist: string;
    album: string;
    genre: string;
    duration: number;
    audioUrl: string;
    coverUrl: string;
    playlistIds: string[];
  }) => {
    const newTrack = dataStore.addTrack({
      title: trackData.title,
      artist: trackData.artist,
      album: trackData.album,
      genre: trackData.genre,
      duration: trackData.duration,
      audioUrl: trackData.audioUrl,
      coverUrl: trackData.coverUrl,
    });
    if (trackData.playlistIds.length > 0) {
      dataStore.addTrackToPlaylists(newTrack.id, trackData.playlistIds);
    }
    refreshData();
  }, [refreshData]);

  const handleDeleteTrack = useCallback((trackId: string) => {
    dataStore.deleteTrack(trackId);
    refreshData();
  }, [refreshData]);

  const handleReorder = useCallback((fromIndex: number, toIndex: number) => {
    if (!activeView.startsWith('playlist:')) return;
    const plId = activeView.replace('playlist:', '');
    const currentTracks = dataStore.getTracksForPlaylist(plId);
    const reordered = [...currentTracks];
    const [moved] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, moved);
    dataStore.reorderPlaylistTracks(plId, reordered.map((t) => t.id));
    refreshData();
  }, [activeView, refreshData]);

  const likedTracks = useMemo(() => tracks.filter((t) => t.liked), [tracks]);
  const likedCount = likedTracks.length;

  // Get tracks for active playlist view
  const activePlaylistTracks = useMemo(() => {
    if (activeView.startsWith('playlist:')) {
      const plId = activeView.replace('playlist:', '');
      return dataStore.getTracksForPlaylist(plId);
    }
    if (activeView === 'liked') {
      return likedTracks;
    }
    return [];
  }, [activeView, tracks, likedTracks]);

  const activePlaylist = useMemo((): Playlist | null => {
    if (activeView.startsWith('playlist:')) {
      const plId = activeView.replace('playlist:', '');
      return dataStore.getPlaylistById(plId) ?? null;
    }
    return null;
  }, [activeView, playlists]);

  const renderMainContent = () => {
    if (activeView === 'home') {
      return (
        <HomeView
          playlists={playlists}
          likedCount={likedCount}
          allTracks={tracks}
          onNavigate={setActiveView}
        />
      );
    }
    if (activeView === 'search') {
      return (
        <SearchView
          allTracks={tracks}
          allPlaylists={playlists}
          onToggleLike={handleToggleLike}
          onNavigate={setActiveView}
          onDeleteTrack={handleDeleteTrack}
          onPlayNext={playNext}
        />
      );
    }
    if (activeView === 'liked') {
      return (
        <PlaylistView
          playlist={null}
          tracks={likedTracks}
          onToggleLike={handleToggleLike}
          onAddTrack={() => setShowAddTrack(true)}
          onDeleteTrack={handleDeleteTrack}
          onPlayNext={playNext}
          variant="liked"
        />
      );
    }
    if (activeView === 'library') {
      return (
        <HomeView
          playlists={playlists}
          likedCount={likedCount}
          allTracks={tracks}
          onNavigate={setActiveView}
        />
      );
    }
    if (activeView.startsWith('playlist:')) {
      return (
        <PlaylistView
          playlist={activePlaylist}
          tracks={activePlaylistTracks}
          onToggleLike={handleToggleLike}
          onAddTrack={() => setShowAddTrack(true)}
          onDeleteTrack={handleDeleteTrack}
          onReorder={handleReorder}
          onPlayNext={playNext}
        />
      );
    }
    return (
      <HomeView
        playlists={playlists}
        likedCount={likedCount}
        allTracks={tracks}
        onNavigate={setActiveView}
      />
    );
  };

  // Determine gradient for top bar based on view
  const topBarGradient = useMemo(() => {
    if (activeView.startsWith('playlist:') && activePlaylist) {
      return 'from-green-900/40';
    }
    if (activeView === 'liked') {
      return 'from-purple-900/40';
    }
    if (activeView === 'home') {
      return 'from-neutral-700/40';
    }
    if (activeView === 'search') {
      return 'from-neutral-700/40';
    }
    return 'from-neutral-800/40';
  }, [activeView, activePlaylist]);

  if (!loaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-spotify-base text-white">
        <div className="text-lg font-bold">Loading Spotifly...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-black overflow-hidden">
      {/* Top-level layout: sidebar + main */}
      <div className="flex flex-1 overflow-hidden p-0 md:p-2 gap-0 md:gap-2">
        <Sidebar
          playlists={playlists}
          activeView={activeView}
          onNavigate={setActiveView}
          onCreatePlaylist={handleCreatePlaylist}
          onDeletePlaylist={handleDeletePlaylist}
          likedCount={likedCount}
          isMobileOpen={sidebarOpen}
          onCloseMobile={() => setSidebarOpen(false)}
        />

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto bg-spotify-base md:rounded-lg relative">
          {/* Top bar */}
          <div className={`sticky top-0 z-20 bg-gradient-to-b ${topBarGradient} to-transparent backdrop-blur-md px-4 md:px-8 py-3 flex items-center gap-4`}>
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-white bg-black/40 rounded-full p-2 hover:bg-black/60 transition-colors"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center gap-2">
              <button className="bg-black/40 rounded-full p-1.5 text-white hover:bg-black/60 transition-colors disabled:opacity-40" disabled>
                <ChevronLeft size={20} />
              </button>
              <button className="bg-black/40 rounded-full p-1.5 text-white hover:bg-black/60 transition-colors disabled:opacity-40" disabled>
                <ChevronRight size={20} />
              </button>
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddTrack(true)}
                className="bg-white text-black font-bold text-sm px-4 py-2 rounded-full hover:scale-105 transition-transform"
              >
                Add Track
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="animate-fade-in">
            {renderMainContent()}
          </div>
        </main>
      </div>

      {/* Bottom player bar */}
      <PlayerBar
        onToggleLike={handleToggleLike}
        onShowQueue={() => setShowQueue(true)}
      />

      {/* Queue panel */}
      <QueuePanel
        isOpen={showQueue}
        onClose={() => setShowQueue(false)}
      />

      {/* Add Track Modal */}
      <AddTrackModal
        isOpen={showAddTrack}
        onClose={() => setShowAddTrack(false)}
        onAddTrack={handleAddTrack}
        playlists={playlists}
        defaultPlaylistId={
          activeView.startsWith('playlist:') ? activeView.replace('playlist:', '') : undefined
        }
      />

      {/* Hidden audio element */}
      <audio ref={audioRef} preload="metadata" crossOrigin="anonymous" />
    </div>
  );
}

export default function App() {
  return (
    <PlayerProvider>
      <AppContent />
    </PlayerProvider>
  );
}
