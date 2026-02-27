interface KWDisplayProps {
  weekNumber: number;
  year: number;
}

export default function KWDisplay({ weekNumber, year }: KWDisplayProps) {
  return (
    <div className="relative flex flex-col items-center select-none">
      {/* Ambient glow behind the number */}
      <div
        aria-hidden
        className="absolute w-80 h-80 md:w-[28rem] md:h-[28rem] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"
      />
      {/* Main KW number */}
      <div className="relative text-[9rem] md:text-[15rem] font-bold tracking-tight leading-none text-text-primary">
        {weekNumber}
      </div>
      {/* KW · Year subtitle */}
      <div className="mt-2 flex items-center gap-3 text-base md:text-lg">
        <span className="text-accent font-semibold">KW {weekNumber}</span>
        <span className="text-border font-thin text-2xl leading-none">·</span>
        <span className="text-text-secondary">{year}</span>
      </div>
    </div>
  );
}
