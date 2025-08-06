// components/IntensityBySectorChart.tsx
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect } from "react";
import { fetchData } from "../services/dataService";
import { useGlobalStore } from "@/store/useGlobalStore";
import FilterComponent from "./elements/Filter";
import FilterWrapper from "./elements/FilterWrapper";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

type Insight = {
  end_year: string;
  // sector: string;
  intensity: number;
  relevance: number;
  likelihood: number;
};

export default function IntensityBySectorChart({ data }: { data: Insight[] }) {
  const { filters, constants, setData, setFilters } = useGlobalStore();

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
        // sector: [],
      };

    yearMap[year].intensity.push(item.intensity || 0);
    yearMap[year].relevance.push(item.relevance || 0);
    yearMap[year].likelihood.push(item.likelihood || 0);
    // yearMap[year].sector.push(item.sector);
  });
  console.log(yearMap);

  const labels = Object.keys(yearMap).sort();

  const avgIntensity = labels.map(
    (year) =>
      yearMap[year].intensity.reduce((a, b) => a + b, 0) /
      yearMap[year].intensity.length
  );
  const avgRelevance = labels.map(
    (year) =>
      yearMap[year].relevance.reduce((a, b) => a + b, 0) /
      yearMap[year].relevance.length
  );
  const avgLikelihood = labels.map(
    (year) =>
      yearMap[year].likelihood.reduce((a, b) => a + b, 0) /
      yearMap[year].likelihood.length
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: "Average Intensity",
        data: avgIntensity,
        backgroundColor: "rgba(75, 192, 192, 0.7)", // teal
      },
      {
        label: "Average Relevance",
        data: avgRelevance,
        backgroundColor: "rgba(255, 159, 64, 0.7)", // orange
      },
      {
        label: "Average Likelihood",
        data: avgLikelihood,
        backgroundColor: "rgba(153, 102, 255, 0.7)", // purple
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  };

  return (
    <div
      className="grid min-h-screen grid-cols-1 md:grid-cols-[2fr_1fr] grid-rows-[auto_1fr] bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans"
      role="region"
      aria-label="Dashboard Section"
    >
      <header
        className="col-span-full sticky top-0 z-20 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 shadow-sm"
        role="banner"
        aria-label="Dashboard Header"
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Average Intensity, Relevance, and Likelihood Over Time
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          A time-series view of key impact metrics
        </p>
      </header>

      {/* Chart Section */}
      <section
        className="p-4 md:p-6 lg:p-8 flex justify-center items-center bg-white dark:bg-gray-900"
        role="main"
        aria-label="Bar Chart"
      >
        {/* <h2 className="text-lg font-semibold mb-4">Sector Overview</h2> */}
        <Bar data={chartData} options={chartOptions} />
      </section>

      {/* Filter Section */}
      <aside
        className="p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-gray-800 overflow-y-auto border-l dark:border-gray-700"
        role="complementary"
        aria-label="Filter Controls"
      >
        <div className="flex flex-wrap gap-4 h-screen w-full">
          <FilterWrapper>
            {/* Example filter inside */}
            <FilterComponent
              filter={{
                label: "sectors",
                field: "sector",
                data: constants.sector,
                multiSelect: false,
              }}
            />
            <FilterComponent
              filter={{
                label: "pestles",
                field: "pestle",
                data: constants.pestle,
                multiSelect: true,
              }}
            />
            <FilterComponent
              filter={{
                label: "regions",
                field: "region",
                data: constants.region,
                multiSelect: true,
              }}
            />
            <FilterComponent
              filter={{
                label: "countries",
                field: "country",
                data: constants.country,
                multiSelect: true,
              }}
            />
            <FilterComponent
              filter={{
                label: "sources",
                field: "source",
                data: constants.source,
                multiSelect: true,
              }}
            />
          </FilterWrapper>
        </div>
      </aside>
    </div>
  );
}
