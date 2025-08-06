import React from 'react'
import { useGlobalStore } from "@/store/useGlobalStore";
import { useEffect } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from 'react-chartjs-2';
import { fetchData } from '@/app/services/dataService';

ChartJS.register(ArcElement, Tooltip, Legend);

type Insight = {
  pestle: string;
};

const MicroDoughnut = ({data}:{data: Insight[]}) => {
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
        label: "Entries by category",
        data: values,
        backgroundColor: labels.map(
          (_, i) => `hsl(${(i * 360) / labels.length}, 70%, 60%)`
        ),
      },
    ],
  };

  return (
    <Doughnut data={chartData}/>
  )
}

export default MicroDoughnut