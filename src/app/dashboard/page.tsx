"use client";
import { useGlobalStore } from "@/store/useGlobalStore";
import { useEffect } from "react";
import MicroBar from "../components/micro/bar.micro";
import MicroDoughnut from "../components/micro/doughnut.micro";
import MicroLine from "../components/micro/line.micro";
import MicroPie from "../components/micro/pie.micro";
import MicroRadar from "../components/micro/radar.micro";
import { fetchConstants, fetchData } from "../services/dataService";
import Sidebar from "../components/elements/Sidebar";
import FilterComponent from "../components/elements/Filter";
export default function Dashboard() {
  const { filters, constants, setConstants, setFilters, data, setData } =
    useGlobalStore();

  useEffect(() => {
    setFilters({ ...filters, sector: constants.sector[0] });
  }, [constants.sector]);
  useEffect(() => {
    // console.log("filters",filters);
    if (!filters || !filters.sector) {
      return;
    }
    fetchData(filters as Record<string, string | string[]>).then((item) => {
      console.log(item);

      setData(item);
    });
  }, [filters]);

  //  for getting vars
  useEffect(() => {
    fetchConstants(filters as Record<string, string | string[]>).then(
      (item) => {
        console.log(item);

        setConstants({
          ...constants,
          sector: item.sectors,
          country: item.countries,
          pestle: item.pestles,
          source: item.sources,
          region: item.regions,
          topics: item.topics,
          end_year: item.end_years,
        });
      }
    );
  }, []);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white dark:bg-gray-900 text-black dark:text-white">
      {/* Sidebar */}
      <aside className="w-full lg:w-1/5 bg-gray-200 dark:bg-gray-800 py-4 px-4">
        <Sidebar />
        <div className="relative flex mt-4">
          <FilterComponent
            filter={{
              label: "Sector",
              field: "sector",
              data: constants.sector,
              multiSelect: false,
            }}
          />
        </div>
      </aside>

      {/* Main Content */}
      <main className="w-full lg:w-4/5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-4">
        {/* Bar chart (2 cols) */}
        <div className="col-span-1 p-2 md:col-span-2 bg-white shadow rounded-lg dark:bg-gray-700 min-h-[200px]">
          <h2 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-100">
            Trends of Key Metrics
          </h2>
          <div className="flex items-center justify-center h-full">
            <MicroBar data={data} />
          </div>
        </div>

        {/* Line chart */}
        <div className="col-span-1 p-2 bg-white shadow rounded-lg dark:bg-gray-700 min-h-[200px]">
          <h2 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-100">
            Overall Impact by Year
          </h2>

          <div className="flex items-center justify-center h-full">
            <MicroLine data={data} />
          </div>
        </div>

        {/* Radar */}
        <div className="p-2 bg-white shadow rounded-lg dark:bg-gray-700 min-h-[200px]">
          <h2 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-100">
            Sector-wise Strength Comparison
          </h2>
          <div className="flex items-center justify-center h-full">
            <MicroRadar />
          </div>
        </div>

        {/* PESTLE */}
        <div className="p-2 bg-white shadow rounded-lg dark:bg-gray-700 min-h-[250px] flex flex-col">
          <h2 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-100">
            PESTLE Influence Breakdown
          </h2>
          <div className="flex-grow flex items-center justify-center">
            <MicroDoughnut data={data} />
          </div>
        </div>

        {/* Country */}
        <div className="p-2 bg-white shadow rounded-lg dark:bg-gray-700 min-h-[250px] flex flex-col">
          <h2 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-100">
            Impact Distribution by Country
          </h2>
          <div className="flex-grow flex items-center justify-center">
            <MicroPie data={data} />
          </div>
        </div>
      </main>
    </div>
  );
}
