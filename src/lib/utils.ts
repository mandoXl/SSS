export function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function formatTotalDuration(seconds: number): string {
  const totalMins = Math.floor(seconds / 60);
  const hours = Math.floor(totalMins / 60);
  const mins = totalMins % 60;
  if (hours > 0) {
    return `${hours} hr ${mins} min`;
  }
  return `${mins} min ${Math.floor(seconds % 60)} sec`;
}

export function formatAddedDate(isoString: string): string {
  const d = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function getGradientFromId(id: string): string {
  const gradients = [
    'from-green-900 via-green-800 to-spotify-base',
    'from-blue-900 via-blue-800 to-spotify-base',
    'from-purple-900 via-purple-800 to-spotify-base',
    'from-orange-900 via-orange-800 to-spotify-base',
    'from-red-900 via-red-800 to-spotify-base',
    'from-teal-900 via-teal-800 to-spotify-base',
    'from-pink-900 via-pink-800 to-spotify-base',
    'from-indigo-900 via-indigo-800 to-spotify-base',
  ];
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i);
    hash |= 0;
  }
  return gradients[Math.abs(hash) % gradients.length];
}
