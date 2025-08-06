import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useGlobalStore } from "@/store/useGlobalStore";
import FilterComponent from "./elements/Filter";
import FilterWrapper from "./elements/FilterWrapper";
ChartJS.register(ArcElement, Tooltip, Legend);
type Insight = {
  pestle: string;
  relevance: number;
  likelihood: number;
  intensity: number;
  topic: string;
};
const TopicOverImpactPieChart = ({ data }: { data: Insight[] }) => {
  const { constants } = useGlobalStore();
  const impactMap: Record<string, number> = {};

  data.forEach(({ topic, intensity, relevance, likelihood }) => {
    const impact = (intensity || 0) + (relevance || 0) + (likelihood || 0);

    if (!topic) return; // Skip empty country

    if (impactMap[topic]) {
      impactMap[topic] += impact;
    } else {
      impactMap[topic] = impact;
    }
  });
  const labels = Object.keys(impactMap);
  const values = Object.values(impactMap);
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
        className="col-span-full p-4 text-xl font-semibold border-b border-gray-200 dark:border-gray-700"
        aria-label="Chart title"
      >
        Topic Analysis by Impact Score
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
        className="flex flex-wrap gap-4 h-screen w-full"
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
              label: "Pestle",
              field: "pestle",
              data: constants.pestle,
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
              multiSelect: false,
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
};

export default TopicOverImpactPieChart;
