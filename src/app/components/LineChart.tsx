// components/RelevanceOverTimeChart.tsx
import { Chart, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useGlobalStore } from "@/store/useGlobalStore";
import { useEffect } from "react";
import { fetchData } from "../services/dataService";
import FilterComponent from "./elements/Filter";
import FilterWrapper from "./elements/FilterWrapper";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

type Insight = {
  published: string;
  end_year: string;
  relevance: number;
  likelihood: number;
  intensity: number;
};

export default function ImpactOverTimeLineChart({ data }: { data: Insight[] }) {
  const { constants } = useGlobalStore();

  const yearMap: Record<
    string,
    {
      intensity: number[];
      relevance: number[];
      likelihood: number[];
    }
  > = {};

  data.forEach((item: Insight) => {
    if (!item.end_year) return;
    const year = item.end_year;
    if (!yearMap[year])
      yearMap[year] = {
        intensity: [],
        relevance: [],
        likelihood: [],
      };
    yearMap[year].intensity.push(item.intensity || 0);
    yearMap[year].relevance.push(item.relevance || 0);
    yearMap[year].likelihood.push(item.likelihood || 0);
  });

  const labels = Object.keys(yearMap).sort();

  const avgImpactData = labels.map((year) => {
    const { intensity, relevance, likelihood } = yearMap[year];
    const total = intensity.map((v, i) => v + relevance[i] + likelihood[i]);
    const avg = total.reduce((a, b) => a + b, 0) / total.length;
    return avg;
  });

  const chartData = {
    labels,
    datasets: [
      {
        label: "Average Impact",
        data: avgImpactData,
        borderColor: "rgba(255, 159, 64, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
    },
  };

  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[2fr_1fr] grid-rows-[auto_1fr] bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans">
      {/* Title/Header */}
    <header
  className="col-span-full sticky top-0 z-20 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 shadow-sm"
  role="banner"
  aria-label="Dashboard Header"
>
  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Impact Trend Over the Years</h1>
  <p className="text-sm text-gray-500 dark:text-gray-400">Visualizing impact distribution by end year</p>
</header>

      {/* Main content (Line chart) */}
      <main
        className="p-4 md:p-6 lg:p-8 bg-white dark:bg-gray-900"
        role="main"
        aria-label="Main Chart Section"
      >
        <div className="w-full max-w-5xl mx-auto my-auto">
          <Line data={chartData} options={chartOptions} />
        </div>
      </main>

      {/* Aside (FilterWrapper) */}
      <aside
        className="p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-gray-800 overflow-y-auto border-l dark:border-gray-700"
        role="complementary"
        aria-label="Filter Controls"
      >
        <FilterWrapper>
          <FilterComponent
            filter={{
              label: "Sector",
              field: "sector",
              data: constants.sector,
              multiSelect: false,
            }}
          />
          <FilterComponent
            filter={{
              label: "Pestle",
              field: "pestle",
              data: constants.pestle,
              multiSelect: true,
            }}
          />
          <FilterComponent
            filter={{
              label: "Source",
              field: "source",
              data: constants.source,
              multiSelect: true,
            }}
          />
          <FilterComponent
            filter={{
              label: "Topic",
              field: "topic",
              data: constants.topics,
              multiSelect: true,
            }}
          />
        </FilterWrapper>
      </aside>
    </div>
  );
}
