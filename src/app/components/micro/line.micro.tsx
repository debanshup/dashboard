import React from 'react'
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
import { fetchData } from '@/app/services/dataService';

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

const MicroLine = ({data}:{data: Insight[]}) => {
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

  
 return (<Line data={chartData} options={chartOptions} />)
    

}

export default MicroLine