import axios from "axios";

export async function fetchData(
  filters: Record<string, string | string[]> | null
) {
  try {
    const res = await axios.get("/api/fetch-data", { params: filters });
    return res.data.insights;
  } catch (error) {
    console.log((error as Error).message);
  }
}

export async function fetchConstants(
  filters: Record<string, string | string[]>
) {
  try {
    const res = await axios.get("/api/fetch-all-constants", { params: filters });
    return res.data;
  } catch (error) {
    console.log((error as Error).message);
  }
}

export async function name() {
  try {
  } catch (error) {}
}
