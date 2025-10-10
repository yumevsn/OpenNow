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
}) => {
  const isAllCities = selectedCity === 'All Cities';
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
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
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
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm disabled:bg-gray-200 disabled:cursor-not-allowed"
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
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
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
          className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
        />
      </div>
    </div>
  );
};

export default Filters;
