"use client";

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
  type ChartOptions,
  type TooltipItem,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export type FrequencyBarChartProps = {
  frequency: Record<number, number>;
  maxNumber?: number;
};

function getHotColdColor(count: number, max: number) {
  if (count <= 0 || max <= 0) {
    return {
      background: "rgba(161, 161, 170, 0.25)",
      border: "rgba(161, 161, 170, 0.6)",
    };
  }

  const t = Math.min(1, Math.max(0, count / max));
  const hue = 210 - 210 * t;
  const background = `hsla(${hue}, 85%, 55%, 0.75)`;
  const border = `hsla(${hue}, 85%, 45%, 1)`;
  return { background, border };
}

export function FrequencyBarChart({
  frequency,
  maxNumber = 49,
}: FrequencyBarChartProps) {
  const labels = Array.from({ length: maxNumber }, (_, i) => String(i + 1));
  const dataPoints = labels.map((label) => frequency[Number(label)] ?? 0);
  const maxValue = Math.max(0, ...dataPoints);

  if (maxValue === 0) {
    return (
      <div className="text-sm text-zinc-500 dark:text-zinc-400">
        No frequency data available.
      </div>
    );
  }

  const colors = dataPoints.map((count) => getHotColdColor(count, maxValue));

  const data = {
    labels,
    datasets: [
      {
        label: "Frequency",
        data: dataPoints,
        backgroundColor: colors.map((c) => c.background),
        borderColor: colors.map((c) => c.border),
        borderWidth: 1,
        borderRadius: 4,
        barPercentage: 1.0,
        categoryPercentage: 1.0,
      },
    ],
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          title(items: TooltipItem<"bar">[]) {
            const item = items[0];
            return item ? `Number ${item.label}` : "";
          },
          label(item: TooltipItem<"bar">) {
            return `Frequency: ${item.parsed.y}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          maxRotation: 0,
          autoSkip: false,
          callback: (_value, index) => {
            const num = index + 1;
            if (num === 1 || num === maxNumber || num % 5 === 0) return String(num);
            return "";
          },
        },
      },
      y: {
        beginAtZero: true,
        ticks: { precision: 0 },
      },
    },
  };

  return (
    <div className="h-72">
      <Bar data={data} options={options} />
    </div>
  );
}
