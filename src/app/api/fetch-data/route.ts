import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/connector/connect";
// import { insight } from "@/app/jsonData/data";
import Insights from "@/models/data.model";

connectDB();

export async function GET(req: NextRequest, res: NextResponse) {
  try {
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
    // console.log(JSON.stringify(finalFilter, null, 2));

    const insights = await Insights.find(finalFilter);
    // console.log(insights.length);

    return NextResponse.json(
      { insights, length: insights.length },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);

    return NextResponse.json({ success: false }, { status: 500 });
  }
}
