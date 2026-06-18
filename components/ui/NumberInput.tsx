'use client';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
}

export function NumberInput({ label, value, onChange, prefix, suffix, min = 0, max, step = 1, hint }: NumberInputProps) {
  return (
    <div className="space-y-1.5 group">
      <label className="text-xs font-medium text-slate-400 tracking-wide">{label}</label>
      <div className="input-premium flex items-center bg-slate-900 border border-slate-700/70 rounded-xl overflow-hidden focus-within:border-amber-500/60 transition-all duration-200">
        {prefix && (
          <span className="px-3 py-2.5 text-sm text-slate-500 bg-slate-800/50 border-r border-slate-700/70 select-none font-medium min-w-[36px] text-center">
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={e => onChange(Number(e.target.value))}
          className="flex-1 bg-transparent px-3 py-2.5 text-sm text-white outline-none min-w-0 font-medium tabular-nums"
        />
        {suffix && (
          <span className="px-3 py-2.5 text-xs text-slate-500 border-l border-slate-700/70 select-none bg-slate-800/50 whitespace-nowrap">
            {suffix}
          </span>
        )}
      </div>
      {hint && <p className="text-[11px] text-slate-600 leading-relaxed">{hint}</p>}
    </div>
  );
}
