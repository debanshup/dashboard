import { fetchData } from '@/app/services/dataService';
import { useGlobalStore } from '@/store/useGlobalStore';
import React, { useEffect } from 'react'
import { Bar } from 'react-chartjs-2';
import FilterWrapper from '../elements/FilterWrapper';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
type Insight = {
  end_year: string;
  // sector: string;
  intensity: number;
  relevance: number;
  likelihood: number;
};

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const MicroBar = ({data}:{data: Insight[]}) => {

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
    
        <Bar data={chartData} options={chartOptions} />
  )

}

export default MicroBar