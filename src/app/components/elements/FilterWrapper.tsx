import { useGlobalStore } from "@/store/useGlobalStore";
import { useState } from "react";
import { IoMdCloseCircleOutline } from "react-icons/io";
const colors = [
  "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
  "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200",
  "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
  "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  "bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200",
];


const FilterWrapper = ({ children }: { children: React.ReactNode }) => {
  const [visible, setVisible] = useState(true);
  const [filterName, setFilterName] = useState("Custom filter name");
  const [editing, setEditing] = useState(false);
  const { data, filters, setData, constants, setFilters } = useGlobalStore();
  const allTags = Object.entries(filters)
    .flatMap(([key, val]) => (Array.isArray(val) ? val : val ? [val] : []))
    .filter((v) => v && v !== "");

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6"
      role="complementary"
      aria-label="Filter Controls"
    >
      {/* Heading */}
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Filter by
      </h2>

      {/* Child Filters (no width interference) */}
      {visible && (
        <div className="flex flex-wrap gap-4 mb-4 justify-start items-center">
          {children}
        </div>
      )}

      <div className="flex flex-col gap-4 mb-4">
        <p className="font-semibold text-gray-700 dark:text-gray-200">
          Applied Filters
        </p>

        {Object.entries(filters).map(([label, val], index) => {
          const values = Array.isArray(val) ? val : val ? [val] : [];
          if (values.length === 0) return null;

          const colorClass = colors[index % colors.length];

          return (
            <div key={label} className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-gray-800 dark:text-gray-100 capitalize">
                {label}:
              </span>
              {values.map((item, idx) => (
                <span
                  key={`${label}-${idx}`}
                  className={`text-sm px-3 py-1 rounded-full ${colorClass}`}
                >
                  {item}
                </span>
              ))}
            </div>
          );
        })}
      </div>

      {/* Discard Button */}
      <button
        className="flex items-center gap-1 text-sm text-red-600 dark:text-red-300 hover:underline"
        aria-label="Discard selected filters"
        onClick={() =>
          setFilters({
            topic: [],
            sector: [],
            region: [],
            pestle: [],
            source: [],
            country: [],
            end_year: [],
          })
        }
      >
        <IoMdCloseCircleOutline size={16} />
        Clear all filters
      </button>
    </div>
  );
};

export default FilterWrapper;
