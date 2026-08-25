import type { Track, Playlist } from '../types';

// Royalty-free audio from SoundHelix (stable, CORS-enabled, for testing)
const AUDIO = [
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
];

// Cover art from Pexels (real, stable URLs)
const COVERS = {
  gaming: 'https://images.pexels.com/photos/16070479/pexels-photo-16070479.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  focus: 'https://images.pexels.com/photos/20140155/pexels-photo-20140155.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  chill: 'https://images.pexels.com/photos/38281349/pexels-photo-38281349.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  workout: 'https://images.pexels.com/photos/9302172/pexels-photo-9302172.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  art1: 'https://images.pexels.com/photos/8699994/pexels-photo-8699994.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  art2: 'https://images.pexels.com/photos/8659276/pexels-photo-8659276.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  art3: 'https://images.pexels.com/photos/13312404/pexels-photo-13312404.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  art4: 'https://images.pexels.com/photos/8649248/pexels-photo-8649248.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  art5: 'https://images.pexels.com/photos/13312406/pexels-photo-13312406.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  art6: 'https://images.pexels.com/photos/13312405/pexels-photo-13312405.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  art7: 'https://images.pexels.com/photos/12796006/pexels-photo-12796006.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  art8: 'https://images.pexels.com/photos/13312400/pexels-photo-13312400.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  art9: 'https://images.pexels.com/photos/8882645/pexels-photo-8882645.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  art10: 'https://images.pexels.com/photos/8681959/pexels-photo-8681959.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  art11: 'https://images.pexels.com/photos/13327044/pexels-photo-13327044.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  art12: 'https://images.pexels.com/photos/12796005/pexels-photo-12796005.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
};

const coverKeys = Object.values(COVERS);

function daysAgo(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

interface MockTrack {
  title: string;
  artist: string;
  album: string;
  genre: string;
  duration: number;
  cover: string;
}

const mockTracks: MockTrack[] = [
  // Gaming playlist tracks
  { title: 'Neon Rush', artist: 'CyberPulse', album: 'Pixel Dreams', genre: 'Electronic', duration: 221, cover: COVERS.art1 },
  { title: 'Boss Fight', artist: '8-Bit Warrior', album: 'Arcade Fire', genre: 'Electronic', duration: 193, cover: COVERS.art2 },
  { title: 'Speed Run', artist: 'Glitch Mob', album: 'Fast Lane', genre: 'Electronic', duration: 245, cover: COVERS.art3 },
  { title: 'Level Up', artist: 'Synth Squad', album: 'Next Stage', genre: 'Electronic', duration: 187, cover: COVERS.art4 },
  { title: 'Final Boss', artist: 'CyberPulse', album: 'Pixel Dreams', genre: 'Electronic', duration: 263, cover: COVERS.gaming },

  // Focus playlist tracks
  { title: 'Deep Work', artist: 'Ambient Flow', album: 'Concentration', genre: 'Ambient', duration: 312, cover: COVERS.art5 },
  { title: 'Clear Mind', artist: 'Theta Waves', album: 'Concentration', genre: 'Ambient', duration: 287, cover: COVERS.art6 },
  { title: 'Study Session', artist: 'Lo-Fi Beats', album: 'Late Night', genre: 'Lo-Fi', duration: 198, cover: COVERS.art7 },
  { title: 'Productivity', artist: 'Ambient Flow', album: 'Concentration', genre: 'Ambient', duration: 254, cover: COVERS.focus },
  { title: 'In The Zone', artist: 'Theta Waves', album: 'Flow State', genre: 'Ambient', duration: 301, cover: COVERS.art8 },

  // Chill Beats playlist tracks
  { title: 'Sunset Drive', artist: 'Velvet Coast', album: 'Golden Hour', genre: 'Chill', duration: 234, cover: COVERS.art9 },
  { title: 'Ocean Breeze', artist: 'Tropical House', album: 'Golden Hour', genre: 'Chill', duration: 276, cover: COVERS.art10 },
  { title: 'Lazy Sunday', artist: 'Lo-Fi Beats', album: 'Late Night', genre: 'Lo-Fi', duration: 189, cover: COVERS.art11 },
  { title: 'Mellow Mood', artist: 'Velvet Coast', album: 'Drift', genre: 'Chill', duration: 212, cover: COVERS.chill },
  { title: 'Evening Glow', artist: 'Tropical House', album: 'Drift', genre: 'Chill', duration: 245, cover: COVERS.art12 },

  // Workout playlist tracks
  { title: 'Pump It Up', artist: 'Power Drive', album: 'Beast Mode', genre: 'Hip-Hop', duration: 178, cover: COVERS.art1 },
  { title: 'No Limits', artist: 'Iron Will', album: 'Beast Mode', genre: 'Hip-Hop', duration: 203, cover: COVERS.art2 },
  { title: 'Cardio King', artist: 'Power Drive', album: 'Sweat Session', genre: 'Electronic', duration: 165, cover: COVERS.art3 },
  { title: 'Fight For It', artist: 'Iron Will', album: 'Sweat Session', genre: 'Hip-Hop', duration: 221, cover: COVERS.workout },
  { title: 'Last Rep', artist: 'Power Drive', album: 'Beast Mode', genre: 'Hip-Hop', duration: 196, cover: COVERS.art4 },
];

const playlistCoverMap: Record<string, string> = {
  pl_gaming: COVERS.gaming,
  pl_focus: COVERS.focus,
  pl_chill: COVERS.chill,
  pl_workout: COVERS.workout,
};

const playlistTrackMap: Record<string, number[]> = {
  pl_gaming: [0, 1, 2, 3, 4],
  pl_focus: [5, 6, 7, 8, 9],
  pl_chill: [10, 11, 12, 13, 14],
  pl_workout: [15, 16, 17, 18, 19],
};

export const mockPlaylists: Playlist[] = [
  { id: 'pl_gaming', name: 'Gaming', description: 'High-energy beats for your gaming sessions', coverUrl: COVERS.gaming, createdAt: daysAgo(30) },
  { id: 'pl_focus', name: 'Focus', description: 'Concentration music to help you get in the zone', coverUrl: COVERS.focus, createdAt: daysAgo(25) },
  { id: 'pl_chill', name: 'Chill Beats', description: 'Lay back and relax with these mellow tracks', coverUrl: COVERS.chill, createdAt: daysAgo(20) },
  { id: 'pl_workout', name: 'Workout', description: 'Pump up your workout with these power tracks', coverUrl: COVERS.workout, createdAt: daysAgo(15) },
];

export const mockTracksFull: Track[] = mockTracks.map((t, i) => ({
  id: `tr_${i}`,
  title: t.title,
  artist: t.artist,
  album: t.album,
  genre: t.genre,
  duration: t.duration,
  audioUrl: AUDIO[i % AUDIO.length],
  coverUrl: t.cover,
  liked: i === 0 || i === 5 || i === 10 || i === 12,
  createdAt: daysAgo(20 - (i % 15)),
}));

export const mockPlaylistTracks: { playlistId: string; trackId: string; position: number; addedAt: string }[] = [];
Object.entries(playlistTrackMap).forEach(([playlistId, trackIndices]) => {
  trackIndices.forEach((trackIdx, position) => {
    mockPlaylistTracks.push({
      playlistId,
      trackId: `tr_${trackIdx}`,
      position,
      addedAt: daysAgo(20 - position),
    });
  });
});

export const defaultCoverArt = coverKeys;
