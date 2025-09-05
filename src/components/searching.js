import {rules, createComparison} from "../lib/compare.js";


export function initSearching(searchField) {
  const compare = createComparison(
    ["skipEmptyTargetValues"],
    rules.searchMultipleFields(
      searchField,
      ["date", "customer", "seller"],
      false
    )
  );

  return (data, state) => {
    const q = state?.[searchField];
    if (!q) return data;
    return data.filter((row) => compare(row, state));
  };
}