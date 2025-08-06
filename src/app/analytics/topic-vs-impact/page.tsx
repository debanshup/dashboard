"use client";
import TopicOverImpactPieChart from "@/app/components/TopicOverImpactPieChart";
import { fetchConstants, fetchData } from "@/app/services/dataService";
import { useGlobalStore } from "@/store/useGlobalStore";
import React, { useEffect } from "react";

const TopicVsImpact = () => {
  const { filters, setData, constants, setFilters, data, setConstants } =
    useGlobalStore();

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
  // for first time
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
  return <TopicOverImpactPieChart data={data} />;
};

export default TopicVsImpact;
