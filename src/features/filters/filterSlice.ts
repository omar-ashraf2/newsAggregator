import { SortOrder } from "@/types/SortOrder";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
  searchTerm: string;
  fromDate: string;
  toDate: string;
  category: string;
  source: string;
  page: number;
  sortOrder: SortOrder;
}

const initialState: FilterState = {
  searchTerm: "",
  fromDate: "",
  toDate: "",
  category: "all",
  source: "all",
  page: 1,
  sortOrder: "newest",
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSearchTerm(state, action: PayloadAction<string>) {
      if (state.searchTerm !== action.payload) {
        state.searchTerm = action.payload;
        state.page = 1;
      }
    },
    setDateRange(state, action: PayloadAction<{ from: string; to: string }>) {
      state.fromDate = action.payload.from;
      state.toDate = action.payload.to;
      state.page = 1;
    },
    setFilterCategory(state, action: PayloadAction<string>) {
      state.category = action.payload;
      state.page = 1;
    },
    setFilterSource(state, action: PayloadAction<string>) {
      state.source = action.payload;
      state.page = 1;
    },
    setPage(state, action: PayloadAction<number>) {
      state.page = action.payload;
    },
    setSortOrder(state, action: PayloadAction<SortOrder>) {
      state.sortOrder = action.payload;
      state.page = 1;
    },
  },
});

export const {
  setSearchTerm,
  setDateRange,
  setFilterCategory,
  setFilterSource,
  setPage,
  setSortOrder,
} = filterSlice.actions;

export default filterSlice.reducer;
