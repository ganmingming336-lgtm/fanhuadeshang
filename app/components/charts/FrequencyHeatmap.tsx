"use client";

import { useMemo } from "react";

export type FrequencyHeatmapProps = {
  frequency: Record<number, number>;
  maxNumber?: number;
  columns?: number;
};

const INTENSITY_STYLES = [
  {
    label: "0",
    cell: "bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300",
  },
  {
    label: "Low",
    cell: "bg-blue-200 dark:bg-blue-900/60 text-zinc-900 dark:text-zinc-100",
  },
  {
    label: "Med",
    cell: "bg-blue-400 dark:bg-blue-700/70 text-zinc-900 dark:text-zinc-100",
  },
  {
    label: "High",
    cell: "bg-orange-400 dark:bg-orange-600/80 text-zinc-900 dark:text-zinc-900",
  },
  {
    label: "Hot",
    cell: "bg-red-500 dark:bg-red-600/90 text-white",
  },
] as const;

function intensityIndex(count: number, max: number) {
  if (count <= 0 || max <= 0) return 0;
  const t = Math.min(1, Math.max(0, count / max));
  const idx = Math.ceil(t * (INTENSITY_STYLES.length - 1));
  return Math.min(INTENSITY_STYLES.length - 1, Math.max(1, idx));
}

export function FrequencyHeatmap({
  frequency,
  maxNumber = 49,
  columns = 7,
}: FrequencyHeatmapProps) {
  const values = useMemo(
    () => Array.from({ length: maxNumber }, (_, i) => frequency[i + 1] ?? 0),
    [frequency, maxNumber],
  );
  const maxValue = Math.max(0, ...values);

  if (maxValue === 0) {
    return (
      <div className="text-sm text-zinc-500 dark:text-zinc-400">
        No frequency data available.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <div className="min-w-[360px]">
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
            aria-label="Frequency heatmap (numbers 1 to 49)"
            role="grid"
          >
            {values.map((count, index) => {
              const num = index + 1;
              const idx = intensityIndex(count, maxValue);
              const style = INTENSITY_STYLES[idx];

              return (
                <div
                  key={num}
                  role="gridcell"
                  title={`#${num}: ${count}`}
                  aria-label={`Number ${num}, frequency ${count}`}
                  className={
                    "aspect-square rounded-md flex items-center justify-center text-xs font-semibold select-none " +
                    style.cell
                  }
                >
                  {num}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-zinc-600 dark:text-zinc-400">
        <span className="font-medium">Intensity:</span>
        <div className="flex items-center gap-2">
          {INTENSITY_STYLES.map((s) => (
            <div key={s.label} className="flex items-center gap-1">
              <span className={"inline-block h-3 w-3 rounded-sm " + s.cell} />
              <span>{s.label}</span>
            </div>
          ))}
        </div>
        <span className="text-zinc-500 dark:text-zinc-500">(relative to the most frequent number)</span>
      </div>
    </div>
  );
}
