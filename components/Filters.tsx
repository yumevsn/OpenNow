
import React from 'react';
import { BusinessType } from '../types';

interface FiltersProps {
  locations: { [city: string]: string[] };
  businessTypes: (BusinessType | 'All')[];
  selectedCity: string;
  onCityChange: (city: string) => void;
  selectedArea: string;
  onAreaChange: (area: string) => void;
  selectedType: BusinessType | 'All';
  onTypeChange: (type: BusinessType | 'All') => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  closingAlertsEnabled: boolean;
  onToggleClosingAlerts: () => void;
}

const Filters: React.FC<FiltersProps> = ({
  locations,
  businessTypes,
  selectedCity,
  onCityChange,
  selectedArea,
  onAreaChange,
  selectedType,
  onTypeChange,
  searchQuery,
  onSearchChange,
  closingAlertsEnabled,
  onToggleClosingAlerts,
}) => {
  const isAllCities = selectedCity === 'All Cities';
  const inputBaseClasses = "mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500";
  
  const isPermissionDenied = typeof Notification !== 'undefined' && Notification.permission === 'denied';
  const toggleTitle = isPermissionDenied 
    ? "Notifications are blocked in your browser settings." 
    : "Get notified when most businesses are closing soon";

  return (
    <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 px-4 py-4">
      <div className="w-full sm:w-auto">
        <label htmlFor="city-select" className="sr-only">
          City
        </label>
        <select
          id="city-select"
          value={selectedCity}
          onChange={(e) => onCityChange(e.target.value)}
          className={inputBaseClasses}
        >
          <option value="All Cities">All Cities</option>
          {Object.keys(locations).map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>
      <div className="w-full sm:w-auto">
        <label htmlFor="area-select" className="sr-only">
          Area
        </label>
        <select
          id="area-select"
          value={selectedArea}
          onChange={(e) => onAreaChange(e.target.value)}
          disabled={isAllCities}
          className={`${inputBaseClasses} disabled:bg-gray-200 disabled:cursor-not-allowed dark:disabled:bg-gray-800 dark:disabled:text-gray-400`}
        >
          <option value="All">All Areas</option>
          {!isAllCities &&
            locations[selectedCity]?.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
        </select>
      </div>
      <div className="w-full sm:w-auto">
        <label htmlFor="type-select" className="sr-only">
          Business Type
        </label>
        <select
          id="type-select"
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value as BusinessType | 'All')}
          className={inputBaseClasses}
        >
          {businessTypes.map((type) => (
            <option key={type} value={type}>
              {type === 'All' ? 'All Businesses' : type}
            </option>
          ))}
        </select>
      </div>
      <div className="w-full sm:w-auto">
        <label htmlFor="search-input" className="sr-only">
          Search by name
        </label>
        <input
          type="text"
          id="search-input"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by business name..."
          className={`${inputBaseClasses} pr-3`}
        />
      </div>

      <div className="w-full sm:w-auto flex items-center justify-center gap-2 border-t sm:border-t-0 sm:border-l border-gray-200 dark:border-gray-700 pt-4 sm:pt-0 sm:pl-4 mt-4 sm:mt-0">
        <label htmlFor="alert-toggle" className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer whitespace-nowrap" title={toggleTitle}>
          Closing Alerts
        </label>
        <button
          id="alert-toggle"
          type="button"
          onClick={onToggleClosingAlerts}
          disabled={isPermissionDenied}
          title={toggleTitle}
          className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800 ${
            closingAlertsEnabled ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-600'
          } ${isPermissionDenied ? 'opacity-50 cursor-not-allowed' : ''}`}
          role="switch"
          aria-checked={closingAlertsEnabled}
        >
          <span
            aria-hidden="true"
            className={`inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
              closingAlertsEnabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

    </div>
  );
};

export default Filters;
