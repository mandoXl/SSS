interface EqualizerBarsProps {
  className?: string;
  color?: string;
}

export function EqualizerBars({ className = '', color = 'bg-spotify-accent' }: EqualizerBarsProps) {
  return (
    <div className={`flex items-end gap-[2px] h-4 ${className}`}>
      <div className={`w-[3px] wave-bar ${color}`} style={{ animationDelay: '0ms' }} />
      <div className={`w-[3px] wave-bar ${color}`} style={{ animationDelay: '200ms' }} />
      <div className={`w-[3px] wave-bar ${color}`} style={{ animationDelay: '400ms' }} />
    </div>
  );
}
