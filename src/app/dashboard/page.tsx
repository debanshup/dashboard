import { fetchConstants, fetchData } from "../services/dataService";
import DashboardClient from "./DashboardClient";
// ssr
export default async function Dashboard() {
  const constants = await fetchConstants({});
  // console.log(constants);
  const data = await fetchData({ sector: constants.sectors[0] });
  return <DashboardClient initialConstants={constants} initialData={data} />;
}
