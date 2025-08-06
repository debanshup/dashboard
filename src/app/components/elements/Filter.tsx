import { useGlobalStore } from "@/store/useGlobalStore";
import { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
interface FilterItem {
  label: string;
  field: keyof Filters;
  data: string[];
  multiSelect?: boolean;
}

interface Filters {
  sector: string | string[];
  country: string | string[];
  topic: string | string[];
  region: string | string[];
  pestle: string | string[];
  source: string | string[];
  end_year: string | string[];
}

interface Props {
  filter: FilterItem;
}

export default function Filter({ filter }: Props) {
  const [open, setOpen] = useState(false);

  const { filters, setFilters } = useGlobalStore();

  const [searchQuery, setSearchQuery] = useState("");

  const { data, label, field, multiSelect } = filter;

  const filterData = data.filter((item) =>
    item.toLowerCase().includes(searchQuery.toLowerCase())
  );

  function clearSearchQuery() {
    setSearchQuery("");
  }

  const ref = useRef<HTMLDivElement | null>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={ref}
      className="flex flex-col justify-center items-center h-full"
      role="search"
      aria-label={`Search filter for ${label}`}
    >
      <div className="w-full sm:w-[80%] md:w-[60%] lg:w-[50%] min-w-fit relative">
        {/* Input box */}
        <div
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 border-2 rounded-md shadow-xl p-2 bg-white dark:bg-gray-800 dark:border-gray-600 cursor-text"
        >
          <input
            type="text"
            value={searchQuery || filters[field] || ""}
            placeholder={label}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setOpen(true);
            }}
            className="w-full text-sm outline-none border-none bg-white dark:bg-gray-800 dark:text-white"
            aria-label={`Search input for ${label}`}
          />
          {searchQuery.length > 0 ? (
            <IoIosCloseCircle
              size={20}
              className="text-gray-400 dark:text-gray-300 cursor-pointer"
              onClick={clearSearchQuery}
              role="button"
              aria-label="Clear search input"
            />
          ) : open ? (
            <FaChevronUp
              className="text-gray-400 dark:text-gray-300"
              size={16}
            />
          ) : (
            <FaChevronDown
              className="text-gray-400 dark:text-gray-300"
              size={16}
            />
          )}
        </div>

        {/* Dropdown options */}
        {open && (
          <div
            className="absolute top-full mt-1 z-50 max-h-56 w-full overflow-auto flex flex-col p-2 bg-white dark:bg-gray-700 shadow-xl rounded-md"
            role="listbox"
          >
            {filterData.length ? (
              filterData.map((item) => (
                <label
                  key={item}
                  className="flex items-center gap-2 p-2 hover:bg-amber-100 dark:hover:bg-gray-600 text-black dark:text-white cursor-pointer rounded"
                >
                  {multiSelect ? (
                    <input
                      type="checkbox"
                      value={item}
                      checked={
                        Array.isArray(filters[field]) &&
                        filters[field].includes(item)
                      }
                      onChange={(e) => {
                        const current = Array.isArray(filters[field])
                          ? filters[field]
                          : [];
                        const updated = e.target.checked
                          ? [...current, item]
                          : current.filter((val) => val !== item);
                        setFilters({ ...filters, [field]: updated });
                      }}
                    />
                  ) : (
                    <input
                      type="radio"
                      name={label}
                      value={item}
                      checked={filters[field] === item}
                      onChange={(e) => {
                        setFilters({ ...filters, [field]: e.target.value });
                      }}
                    />
                  )}
                  {item}
                </label>
              ))
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400 text-center p-2">
                No data available
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
