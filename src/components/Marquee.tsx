export default function Marquee({ items, tilt = -2 }: { items: string[]; tilt?: number }) {
  const row = [...items, ...items];
  return (
    <div className="relative z-10 -my-6 overflow-hidden py-6" aria-hidden>
      <div className="bg-blood py-4" style={{ transform: `rotate(${tilt}deg) scale(1.05)` }}>
        <div className="marquee-track flex w-max gap-10 whitespace-nowrap">
          {row.map((t, i) => (
            <span key={i} className="flex items-center gap-10 font-display text-3xl uppercase text-ink md:text-5xl">
              {t}
              <span className="text-bone">✦</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
