import axios from "axios";

const baseURL =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
    : "";


export async function fetchData(
  filters: Record<string, string | string[]> | null
) {
  try {
    const res = await axios.get(`${baseURL}/api/fetch-data`, { params: filters });
    return res.data.insights;
  } catch (error) {
    console.log((error as Error).message);
    return [];
  }
}

export async function fetchConstants(
  filters: Record<string, string | string[]>
) {
  try {
    const res = await axios.get(`${baseURL}/api/fetch-all-constants`, {
      params: filters,
    });
    return res.data;
  } catch (error) {
    console.log((error as Error).message);
    return { sector: [] };
  }
}

export async function name() {
  try {
  } catch (error) {}
}
