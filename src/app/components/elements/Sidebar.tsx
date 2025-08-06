import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaTachometerAlt, FaChevronDown, FaChevronUp } from "react-icons/fa";
import {
  IoBarChartSharp,
  IoChatbubblesOutline,
  IoGlobeOutline,
  IoPieChartSharp,
  IoTrendingUpSharp,
} from "react-icons/io5";
import { MdOutlineAnalytics } from "react-icons/md";

export default function Sidebar() {
  const [anaOpen, setAnaOpen] = useState(false);
  const router = useRouter();
  return (
    <>
      {/* Dashboard */}
      <a
        href="#"
        className="flex items-center gap-2 py-2 px-3 rounded-md text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
      >
        <FaTachometerAlt />
        <span>Dashboard</span>
      </a>

      {/* Analytics */}
      <div className="mt-4">
        <div
          onClick={() => setAnaOpen(!anaOpen)}
          className="flex justify-between items-center py-2 px-3 rounded-md text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-700 cursor-pointer transition"
        >
          <div className="flex items-center gap-2">
            <MdOutlineAnalytics />
            <span>Analytics</span>
          </div>
          <span>
            {anaOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
          </span>
        </div>

        {anaOpen && (
          <div className="ml-4 mt-2 space-y-1 text-sm">
            {[
              {
                icon: <IoBarChartSharp />,
                label: "Average Metrics vs Time",
                r: "avg-metrics-vs-time",
              },
              {
                icon: <IoTrendingUpSharp />,
                label: "Average Impact vs Time",
                r: "avg-impact-vs-time",
              },
              {
                icon: <IoGlobeOutline />,
                label: "Country vs Impact",
                r: "country-vs-impact",
              },
              {
                icon: <IoPieChartSharp />,
                label: "PESTLE vs Impact",
                r: "pestle-vs-impact",
              },
              {
                icon: <IoChatbubblesOutline />,
                label: "Topics vs Impact",
                r: "topic-vs-impact",
              },
            ].map((item, idx) => (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`/analytics/${item.r}`);
                }}
                key={idx}
                className="flex items-center gap-2 py-2 px-3 rounded-md text-gray-800 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-700 transition"
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
