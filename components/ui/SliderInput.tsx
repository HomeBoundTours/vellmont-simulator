'use client';

interface SliderInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  format?: (v: number) => string;
  hint?: string;
}

export function SliderInput({ label, value, min, max, step = 1, onChange, format, hint }: SliderInputProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="space-y-2.5">
      <div className="flex justify-between items-baseline">
        <label className="text-xs font-medium text-slate-400 tracking-wide">{label}</label>
        <span className="text-sm font-bold text-amber-400 tabular-nums">{format ? format(value) : value}</span>
      </div>
      <div className="relative h-1.5 rounded-full bg-slate-800">
        <div
          className="absolute h-full rounded-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-75"
          style={{ width: `${pct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-1.5 z-10"
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-amber-400 shadow-lg shadow-amber-500/30 border-2 border-white/10 pointer-events-none transition-all duration-75"
          style={{ left: `calc(${pct}% - 7px)` }}
        />
      </div>
      {hint && <p className="text-[11px] text-slate-600 leading-relaxed">{hint}</p>}
    </div>
  );
}
