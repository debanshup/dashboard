import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/connector/connect";
// import { insight } from "@/app/jsonData/data";
import Insights from "@/models/data.model";
import { Helper } from "@/helper/Helper";
import mongoose from "mongoose";

connectDB();

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    // console.log("constants", req.nextUrl.searchParams);

    const params = req.nextUrl.searchParams;
    const rawParams: Record<string, string | string[]> = {};

    params.forEach((_, key) => {
      const cleanKey = key.replace(/\[\]$/, ""); // **removes trailing []**
      const values = params.getAll(key);
      rawParams[cleanKey] = values.length > 1 ? values : values[0];
    });

    // console.log();

    const filterConditions: Record<string, unknown>[] = [];
    for (const [key, value] of Object.entries(rawParams)) {
      if (!value || (Array.isArray(value) && value.length === 0)) continue;

      if (Array.isArray(value)) {
        filterConditions.push({
          [key]: { $in: value.filter((v) => v.trim() !== "") },
        });
      } else if (typeof value === "string" && value.trim() !== "") {
        filterConditions.push({ [key]: value });
      }
    }

    const finalFilter =
      filterConditions.length > 0 ? { $and: filterConditions } : {};


      // console.log(finalFilter);
      
    const [sectors, topics, regions, pestles, sources, countries, endYears] =
      await Promise.allSettled([
        Insights.find({ sector: { $nin: [null, ""] } }, finalFilter).distinct(
          "sector"
        ),
        Insights.find({ topic: { $nin: [null, ""] } }, finalFilter).distinct(
          "topic"
        ),
        Insights.find({ region: { $nin: [null, ""] } }, finalFilter).distinct(
          "region"
        ),
        Insights.find({ pestle: { $nin: [null, ""] } }, finalFilter).distinct(
          "pestle"
        ),
        Insights.find({ source: { $nin: [null, ""] } }, finalFilter).distinct(
          "source"
        ),
        Insights.find({ country: { $nin: [null, ""] } }, finalFilter).distinct(
          "country"
        ),
        Insights.find({ end_year: { $nin: [null, ""] } }, finalFilter).distinct(
          "end_year"
        ),
      ]);

    // console.log(sectors);
    const [
      sortedSectors,
      sortedTopics,
      sortedRegions,
      sortedPestles,
      sortedSources,
      sortedCountries,
      sortedEndYears,
    ] = [
      Helper.getSorted(sectors),
      Helper.getSorted(topics),
      Helper.getSorted(regions),
      Helper.getSorted(pestles),
      Helper.getSorted(sources),
      Helper.getSorted(countries),
      Helper.getSorted(endYears),
    ];

    // console.log(sortedCountries, sortedSectors, sortedPestles);
    

    return NextResponse.json(
      {
        sectors: sortedSectors,
        topics: sortedTopics,
        regions: sortedRegions,
        pestles: sortedPestles,
        sources: sortedSources,
        countries: sortedCountries,
        end_years: sortedEndYears,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
