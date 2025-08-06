import React, { useState } from 'react'
import { Radar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { data } from "jquery";
import { useEffect } from "react";
import { useGlobalStore } from "@/store/useGlobalStore";
import { fetchData } from '@/app/services/dataService';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);
type Insight = {
  sector: string;
  intensity: number;
  relevance: number;
  likelihood: number;
};
const MicroRadar = () => {
//    const { data, filters, constants, setData, setFilters } = useGlobalStore();
 
 const [data, setData] = useState<Insight[]>([]);
 
   useEffect(() => {
     fetchData({}).then((item) => {
       console.log(item);
 
       setData(item);
     });
   }, []);
 
   const sectorMap: Record<
     string,
     { intensity: number[]; relevance: number[]; likelihood: number[] }
   > = {};
 
   data.forEach((item: Insight) => {
     if (!item.sector) return;
 
     if (!sectorMap[item.sector]) {
       sectorMap[item.sector] = { intensity: [], relevance: [], likelihood: [] };
     }
 
     sectorMap[item.sector].intensity.push(item.intensity || 0);
     sectorMap[item.sector].relevance.push(item.relevance || 0);
     sectorMap[item.sector].likelihood.push(item.likelihood || 0);
   });
 
   const labels = Object.keys(sectorMap);
 
   const avgIntensity = labels.map(
     (sector) =>
       sectorMap[sector].intensity.reduce((a, b) => a + b, 0) /
       sectorMap[sector].intensity.length
   );
   const avgRelevance = labels.map(
     (sector) =>
       sectorMap[sector].relevance.reduce((a, b) => a + b, 0) /
       sectorMap[sector].relevance.length
   );
   const avgLikelihood = labels.map(
     (sector) =>
       sectorMap[sector].likelihood.reduce((a, b) => a + b, 0) /
       sectorMap[sector].likelihood.length
   );
 
   const chartData = {
     labels,
     datasets: [
       {
         label: "Intensity",
         data: avgIntensity,
         backgroundColor: "rgba(255, 99, 132, 0.5)", // red
         borderColor: "rgba(255, 99, 132, 1)",
         borderWidth: 2,
       },
       {
         label: "Relevance",
         data: avgRelevance,
         backgroundColor: "rgba(54, 162, 235, 0.5)", // blue
         borderColor: "rgba(54, 162, 235, 1)",
         borderWidth: 2,
       },
       {
         label: "Likelihood",
         data: avgLikelihood,
         backgroundColor: "rgba(255, 206, 86, 0.5)", // yellow
         borderColor: "rgba(255, 206, 86, 1)",
         borderWidth: 2,
       },
     ],
   };
 
   return (
     <Radar
       data={chartData}
       height={500}
       width={500}
       options={{
         responsive: true,
         animation: {
           easing: "linear",
         },
         plugins: {
           legend: {
             position: "top",
             labels: {
               color: "#f4f4f9",
               font: {
                 size: 10,
                 weight: "normal",
               },
             },
           },
           tooltip: {
             enabled: true,
             backgroundColor: "#fff",
             titleColor: "#000",
             bodyColor: "#000",
             borderColor: "#ccc",
             borderWidth: 1,
           },
         },
         scales: {
           r: {
             angleLines: { display: true },
             ticks: {
               display: false,
               color: "#555",
               backdropColor: "transparent",
               count: 4,
             },
             grid: {
               color: "#ccc",
               circular: true,
             },
           },
         },
       }}
     />
    )
}

export default MicroRadar