import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { useGlobalStore } from "@/store/useGlobalStore";
import { useEffect } from "react";
import { fetchData } from "@/app/services/dataService";
ChartJS.register(ArcElement, Tooltip, Legend);


type Insight = {
  sector: string;
  intensity: number;
  relevance: number;
  likelihood: number;
  country: string;
};

const MicroPie = ({data}:{data: Insight[]}) => {
// //   const { data, filters, setData, constants, setFilters } = useGlobalStore();
//   // for first time
//   useEffect(() => {
//     setFilters({ ...filters, sector: constants.sector[0] });
//   }, [constants.sector]);
//   useEffect(() => {
//     // console.log("filters",filters);
//     if (!filters || !filters.sector) {
//       return;
//     }
//     fetchData(filters as Record<string, string | number>).then((item) => {
//       console.log(item);

//       setData(item);
//     });
//   }, [filters]);

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
  return <Pie data={chartData} />;
};

export default MicroPie;
