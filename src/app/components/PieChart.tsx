// components/PestlePieChart.tsx
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useGlobalStore } from "@/store/useGlobalStore";
import FilterWrapper from "./elements/FilterWrapper";
import FilterComponent from "./elements/Filter";

ChartJS.register(ArcElement, Tooltip, Legend);

type Insight = {
  pestle: string;
};

export default function PestlePieChart({ data }: { data: Insight[] }) {
  const { constants } = useGlobalStore();
  // for first time

  const countMap: Record<string, number> = {};

  data.forEach((item: Insight) => {
    const key = item.pestle || "Unknown";
    countMap[key] = (countMap[key] || 0) + 1;
  });

  const labels = Object.keys(countMap);
  const values = Object.values(countMap);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Impact score",
        data: values,
        backgroundColor: labels.map(
          (_, i) => `hsl(${(i * 360) / labels.length}, 70%, 60%)`
        ),
      },
    ],
  };

  return (
    <div
      className="grid min-h-screen grid-cols-1 md:grid-cols-[1fr_300px] grid-rows-[auto_1fr_auto]
             bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-100 font-sans"
      aria-label="Dashboard layout"
    >
      {/* Header */}
      <header
        className="col-span-full p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm"
        aria-label="PESTLE Impact Chart Header"
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          PESTLE-wise Impact Distribution
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Visualizing impact scores categorized by PESTLE factors
        </p>
      </header>

      {/* Content area */}
      <main
        className="flex justify-center items-center p-4 h-[calc(100vh-8rem)]"
        role="main"
        aria-label="Main chart area"
      >
        <div className="w-full max-w-md md:max-w-lg lg:max-w-xl aspect-square">
          <Pie data={chartData} />
        </div>
      </main>

      {/* Sidebar / Filters */}
      <aside
        className="flex-wrap gap-4 h-screen w-full"
        role="complementary"
        aria-label="Filter panel"
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
              label: "Topic",
              field: "topic",
              data: constants.topics,
              multiSelect: true,
            }}
          />
          <FilterComponent
            filter={{
              label: "End year",
              field: "end_year",
              data: constants.end_year,
              multiSelect: true,
            }}
          />
          <FilterComponent
            filter={{
              label: "Region",
              field: "region",
              data: constants.region,
              multiSelect: true,
            }}
          />
          <FilterComponent
            filter={{
              label: "Country",
              field: "country",
              data: constants.country,
              multiSelect: true,
            }}
          />
        </FilterWrapper>
      </aside>
    </div>
  );
}
