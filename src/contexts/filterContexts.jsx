import { createContext, useContext, useState } from "react";

const FilterContext = createContext();

function FilterProvider({ children }) {
  const [selectedFilters, setSelectedFilters] = useState({
    Languages: [],
    Genre: [],
    Format: [],
    Date: [],
    Categories: [],
    MoreFilters: [],
    Price: [],
  });

  return (
    <FilterContext.Provider value={{ selectedFilters, setSelectedFilters }}>
      {children}
    </FilterContext.Provider>
  );
}
export function useFilters() {
  return useContext(FilterContext);
}
export default FilterProvider;
