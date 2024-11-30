import React, { useState } from "react"; //  A library for building user interfaces.
// styles: Imports CSS module styles specific to the
//sidebar component, allowing for scoped styling
import styles from "./sidebar.module.css";

// Interface: In TypeScript, an interface is used to define the shape of an object
// SidebarProps :  It defines the properties that the Sidebar component expects to receive as props.
//The SidebarProps interface specifies that the Sidebar component requires a function onFilterChange as
//a prop, which takes SelectedFilters as an argument and returns nothing.
interface SidebarProps {
  // onFilterChange: This is a property of the SidebarProps interface.
  //It is a function that takes one argument, filters, and returns nothing (void).
  onFilterChange: (filters: SelectedFilters) => void;
}

// SelectedFilters : Defines the structure of the filters, specifying the types of each filter property.
interface SelectedFilters {
  category: string;
  priceRange: string;
  rarity: string;
  status: string;
  onSale: boolean;
  chains: string;
}
// Sidebar Component: A functional component that takes SidebarProps as its props.
const Sidebar: React.FC<SidebarProps> = ({ onFilterChange }) => {
  // selectedFilters: State to store the currently selected filter values.
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    category: "",
    priceRange: "",
    rarity: "",
    status: "",
    onSale: false,
    chains: "",
  });
  // openFilters: State to track which filter sections are expanded or collapsed.
  const [openFilters, setOpenFilters] = useState<Record<string, boolean>>({});

  //handleFilterChange: Updates the selectedFilters state when a filter option is selected or deselected. 
  //It also calls onFilterChange to notify the parent component of the change.
  const handleFilterChange = (
    key: keyof SelectedFilters,
    value: string | boolean
  ) => {
    const newFilters = {
      ...selectedFilters,
      [key]: selectedFilters[key] === value ? "" : value,
    };
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  // toggleFilter: Toggles the visibility of filter options,
  // allowing sections to be expanded or collapsed
  const toggleFilter = (filter: string) => {
    setOpenFilters((prevState) => ({
      ...prevState,
      [filter]: !prevState[filter],
    }));
  };

  return (
    <div className={styles.sidebar}>
      {/* Filter sections and title */}
      <div className={styles.filtersHeader}>
        <span className={styles.filterIcon}>☰</span>
        <h2>Filters</h2>
      </div>
      {["category", "rarity", "status", "onSale", "chains"].map((filter) => (
        <div key={filter} className={styles.filterItem}>
          <div
            className={styles.filterTitle}
            onClick={() => toggleFilter(filter)}
          >
            <span>{filter.charAt(0).toUpperCase() + filter.slice(1)}</span>
            <span className={styles.chevron}>
              {openFilters[filter] ? "▲" : "▼"}
            </span>
          </div>
          {/* Filter Options */}
          <div
            className={`${styles.filterOptions} ${
              openFilters[filter] ? styles.show : ""
            }`}
          >
            {filter === "category" && (
              <>
                {["Shoes", "Dresses", "Coats", "Shirts", "Pants"].map(
                  (category) => (
                    <div
                      className={styles.filterOption}
                      key={category}
                      onClick={() => handleFilterChange("category", category)}
                    >
                      {category}
                    </div>
                  )
                )}
              </>
            )}
            {filter === "rarity" && (
              <>
                {["Secret Rare", "Uncommon Rare", "Ultra Rare"].map(
                  (rarity) => (
                    <div
                      className={styles.filterOption}
                      key={rarity}
                      onClick={() => handleFilterChange("rarity", rarity)}
                    >
                      {rarity}
                    </div>
                  )
                )}
              </>
            )}
            {filter === "status" && (
              <>
                {["New", "Available", "Not Available"].map((status) => (
                  <div
                    className={styles.filterOption}
                    key={status}
                    onClick={() => handleFilterChange("status", status)}
                  >
                    {status}
                  </div>
                ))}
              </>
            )}
            {filter === "onSale" && (
              <label className={styles.onSaleLabel}>
                <input
                  type="checkbox"
                  checked={selectedFilters.onSale}
                  onChange={(e) =>
                    handleFilterChange("onSale", e.target.checked)
                  }
                />
                Product on Sale
              </label>
            )}
            {filter === "chains" && (
              <input
                type="text"
                placeholder="Chain Reference"
                value={selectedFilters.chains}
                onChange={(e) => handleFilterChange("chains", e.target.value)}
                className={styles.chainInput}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
