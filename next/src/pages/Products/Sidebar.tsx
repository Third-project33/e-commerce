import React, { useState } from "react"
import styles from './sidebar.module.css'; 

interface SidebarProps {
  onFilterChange: (filters: SelectedFilters) => void;
}

interface SelectedFilters {
  category: string;
  priceRange: string;
  rarity: string;
  status: string;
  onSale: boolean;
  chains: string;
}

const Sidebar: React.FC<SidebarProps> = ({ onFilterChange }) => {
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
    category: '',
    priceRange: '',
    rarity: '',
    status: '',
    onSale: false,
    chains: '',
  })
  const [openFilters, setOpenFilters] = useState<Record<string, boolean>>({})

  const handleFilterChange = (key: keyof SelectedFilters, value: string | boolean) => {
    const newFilters = { 
      ...selectedFilters, 
      [key]: selectedFilters[key] === value ? '' : value 
    }
    setSelectedFilters(newFilters)
    onFilterChange(newFilters)
  }

  const toggleFilter = (filter: string) => {
    setOpenFilters((prevState) => ({
      ...prevState,
      [filter]: !prevState[filter],
    }))
  }

  return (
    <div className={styles.sidebar}>
      <div className={styles.filtersHeader}>
        <span className={styles.filterIcon}>☰</span>
        <h2>Filters</h2>
      </div>
      {["category", "rarity", "status", "onSale", "chains"].map((filter) => (
        <div key={filter} className={styles.filterItem}>
          <div className={styles.filterTitle} onClick={() => toggleFilter(filter)}>
            <span>{filter.charAt(0).toUpperCase() + filter.slice(1)}</span>
            <span className={styles.chevron}>
              {openFilters[filter] ? "▲" : "▼"}
            </span>
          </div>
          <div className={`${styles.filterOptions} ${openFilters[filter] ? styles.show : ''}`}>
            {filter === "category" && (
              <>
                {['Shoes', 'Dresses', 'Coats', 'Shirts', 'Pants'].map(category => (
                  <div className={styles.filterOption} key={category} onClick={() => handleFilterChange('category', category)}>
                    {category}
                  </div>
                ))}
              </>
            )}
            {filter === "rarity" && (
              <>
                {['Secret Rare', 'Uncommon Rare', 'Ultra Rare'].map(rarity => (
                  <div className={styles.filterOption} key={rarity} onClick={() => handleFilterChange('rarity', rarity)}>
                    {rarity}
                  </div>
                ))}
              </>
            )}
            {filter === "status" && (
              <>
                {['New', 'Available', 'Not Available'].map(status => (
                  <div className={styles.filterOption} key={status} onClick={() => handleFilterChange('status', status)}>
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
                  onChange={(e) => handleFilterChange('onSale', e.target.checked)}
                />
                Product on Sale
              </label>
            )}
            {filter === "chains" && (
              <input
                type="text"
                placeholder="Chain Reference"
                value={selectedFilters.chains}
                onChange={(e) => handleFilterChange('chains', e.target.value)}
                className={styles.chainInput}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default Sidebar