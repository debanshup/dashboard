// store/useGlobalStore.ts
import { create } from "zustand";

type Filters = {
  topic: string | string[];
  sector: string | string[];
  region: string | string[];
  pestle: string | string[];
  source: string | string[];
  country: string | string[];
  end_year: string | string[];
};

type Constants = {
  end_year: string[];
  topics: string[];
  sector: string[];
  region: string[];
  pestle: string[];
  source: string[];
  country: string[];
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
    end_year: [],
    topics: [],
    sector: [],
    region: [],
    pestle: [],
    source: [],
    country: [],
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
