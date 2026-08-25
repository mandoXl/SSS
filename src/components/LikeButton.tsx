import { Heart } from 'lucide-react';

interface LikeButtonProps {
  liked: boolean;
  onToggle: () => void;
  size?: number;
}

export function LikeButton({ liked, onToggle, size = 16 }: LikeButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className="transition-transform hover:scale-110 active:scale-95"
      aria-label={liked ? 'Unlike' : 'Like'}
    >
      <Heart
        size={size}
        className={liked ? 'fill-spotify-accent text-spotify-accent' : 'text-neutral-400 hover:text-white'}
        fill={liked ? 'currentColor' : 'none'}
      />
    </button>
  );
}
