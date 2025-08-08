// store/useGlobalStore.ts
import { create } from "zustand";

export type Filters = {
  topic: string | string[];
  sector: string | string[];
  region: string | string[];
  pestle: string | string[];
  source: string | string[];
  country: string | string[];
  end_year: string | string[];
};

export type Constants = {
  end_years: string[];
  topics: string[];
  sectors: string[];
  regions: string[];
  pestles: string[];
  sources: string[];
  countries: string[];
};

type GlobalStore = {
  data: [];
  filters: Filters;
  constants: Constants;
  setConstants: (data: Partial<Constants>) => void;
  setData: (data: []) => void;
  setFilters: (filters: Partial<Filters>) => void;
  resetFilters: () => void;
};

export const useGlobalStore = create<GlobalStore>((set) => ({
  data: [],
  constants: {
    end_years: [],
    topics: [],
    sectors: [],
    regions: [],
    pestles: [],
    sources: [],
    countries: [],
  },
  filters: {
    sector: "",
    country: "",
    topic: "",
    region: "",
    pestle: "",
    source: "",
    end_year: ""
  },
  setData: (data) => set({ data }),
  setConstants: (data) =>
    set((state) => ({
      constants: { ...state.constants, ...data },
    })),
  setFilters: (updates) =>
    set((state) => ({ filters: { ...state.filters, ...updates } })),

  resetFilters: () =>
    set({
      filters: {
        sector: "",
        country: "",
        topic: "",
        region: "",
        pestle: "",
        source: "",
        end_year: ""
      },
    }),
}));
