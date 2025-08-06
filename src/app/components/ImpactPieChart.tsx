import React from "react";
import { Doughnut, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useGlobalStore } from "@/store/useGlobalStore";
import { useEffect } from "react";
import { fetchData } from "../services/dataService";
import FilterComponent from "./elements/Filter";
import FilterWrapper from "./elements/FilterWrapper";
type Insight = {
  end_year: string;
  // sector: string;
  intensity: number;
  relevance: number;
  likelihood: number;
  country: string;
};
ChartJS.register(ArcElement, Tooltip, Legend);
const ImpactOverCountryPieChart = ({ data }: { data: Insight[] }) => {
  const { constants } = useGlobalStore();

  const impactMap: Record<string, number> = {};

  data.forEach(({ country, intensity, relevance, likelihood }) => {
    const impact = (intensity || 0) + (relevance || 0) + (likelihood || 0);

    if (!country) return; // Skip empty country

    if (impactMap[country]) {
      impactMap[country] += impact;
    } else {
      impactMap[country] = impact;
    }
  });

  console.log(impactMap);

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
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[2fr_1fr] grid-rows-[auto_1fr] bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 font-sans">
      {/* Header */}
      <header
        className="col-span-full sticky top-0 z-20 bg-white dark:bg-gray-800 p-4 border-b border-gray-200 dark:border-gray-700 shadow-sm"
        role="banner"
        aria-label="Doughnut Chart Header"
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Country-wise Impact Analysis
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Breakdown of impact distribution across countries
        </p>
      </header>

      {/* Doughnut Chart */}
      <main
        className="p-4 md:p-6 lg:p-8 flex justify-center items-center bg-white dark:bg-gray-900"
        role="main"
        aria-label="Doughnut Chart Section"
      >
        <div className="w-full max-w-3xl mx-auto">
          <Doughnut data={chartData} />
        </div>
      </main>

      {/* Filters */}
      <aside
        className="p-4 md:p-6 lg:p-8 bg-gray-50 dark:bg-gray-800 overflow-y-auto border-l dark:border-gray-700"
        role="complementary"
        aria-label="Filter Section"
      >
        <div className="flex flex-wrap gap-4 w-full">
          <FilterWrapper>
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
                label: "End year",
                field: "end_year",
                data: constants.end_year,
                multiSelect: true,
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
          {/* Add more filters if needed */}
        </div>
      </aside>
    </div>
  );
};

export default ImpactOverCountryPieChart;
