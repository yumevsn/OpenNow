
import React, { useState, useMemo, useEffect, useRef } from 'react';
import Header from './components/Header';
import Filters from './components/Filters';
import BusinessGrid from './components/BusinessGrid';
import AddBusinessModal from './components/AddBusinessModal';
import { Business, BusinessType, Branch, DisplayBusiness, Day } from './types';
import { LOCATIONS, BUSINESS_TYPES, SAMPLE_BUSINESSES, DAYS_OF_WEEK } from './constants';
import ViewSwitcher from './components/ViewSwitcher';
import { getBusinessStatus, BusinessStatus, formatHours } from './utils/time';

// --- HELPER FUNCTIONS ---

// Haversine formula to calculate distance between two lat/lon points in km
const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// --- SUB COMPONENTS ---

// --- Icon components for the modal ---
const LocationPinIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
  </svg>
);

const RouteIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const ClockIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.415L11 9.586V6z" clipRule="evenodd" />
    </svg>
);


const BusinessDetailModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  business: DisplayBusiness | null;
}> = ({ isOpen, onClose, business }) => {
  if (!isOpen || !business) return null;

  const status = getBusinessStatus(business.schedule);
  const statusClasses: Record<BusinessStatus, string> = {
    open: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    closingSoon: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    closed: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  };
   const statusText: Record<BusinessStatus, string> = {
    open: 'Open',
    closingSoon: 'Closing Soon',
    closed: 'Closed',
  };
  
  const todayIndex = (new Date().getDay() + 6) % 7;
  const currentDay = DAYS_OF_WEEK[todayIndex];

  return (
    <div className="fixed inset-0 bg-black/60 dark:bg-black/70 z-40 flex justify-center items-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto flex flex-col modal-enter-active" 
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-t-xl border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{business.businessName}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{business.businessType}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200 dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1">
          {/* Details Section */}
          <div className="space-y-4 text-sm">
            <div className="flex items-start">
              <LocationPinIcon />
              <p className="ml-3 text-gray-800 dark:text-gray-200">{business.address}, {business.area}, {business.city}</p>
            </div>
            {business.distance !== undefined && (
              <div className="flex items-start">
                <RouteIcon />
                <p className="ml-3 text-gray-800 dark:text-gray-200">{business.distance.toFixed(1)} km away</p>
              </div>
            )}
            <div className="flex items-start">
                <ClockIcon />
                <div className="ml-3 flex items-center">
                    <p className="text-gray-800 dark:text-gray-200 mr-2">Currently:</p>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses[status]}`}>{statusText[status]}</span>
                </div>
            </div>
          </div>
          
          <div className="mt-8">
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Opening Hours</h3>
            <ul className="mt-3 space-y-2">
              {DAYS_OF_WEEK.map(day => {
                const isToday = day === currentDay;
                return (
                  <li key={day} className={`p-2.5 rounded-md flex justify-between items-center transition-colors ${isToday ? 'bg-indigo-50 dark:bg-indigo-900/30' : ''}`}>
                    <span className={`font-medium ${isToday ? 'text-indigo-700 dark:text-indigo-300' : 'text-gray-800 dark:text-gray-300'}`}>{day}</span>
                    <span className={`${!business.schedule[day] ? 'text-gray-400 dark:text-gray-500' : 'text-gray-600 dark:text-gray-400'} font-mono text-xs sm:text-sm`}>
                      {formatHours(business.schedule[day])}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};


// Helper function to load businesses from localStorage
const loadBusinessesFromStorage = (): Business[] => {
  try {
    const storedBusinesses = localStorage.getItem('businesses');
    if (storedBusinesses) {
      return JSON.parse(storedBusinesses);
    }
  } catch (error) {
    console.error("Failed to parse businesses from localStorage", error);
  }
  return SAMPLE_BUSINESSES;
};

type LocationStatus = 'idle' | 'loading' | 'granted' | 'denied';

const App: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>(loadBusinessesFromStorage);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<DisplayBusiness | null>(null);
  const [viewedBusiness, setViewedBusiness] = useState<DisplayBusiness | null>(null);

  const [selectedCity, setSelectedCity] = useState<string>('All Cities');
  const [selectedArea, setSelectedArea] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<BusinessType | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');

  const [closingAlertsEnabled, setClosingAlertsEnabled] = useState(false);
  const notificationSentRef = useRef(false);
  
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>('idle');

  // Effect to handle geolocation
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus('denied'); // Geolocation not supported
      return;
    }

    navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus) => {
      if (permissionStatus.state === 'granted') {
        handleRequestLocation();
      } else if (permissionStatus.state === 'denied') {
        setLocationStatus('denied');
      }
      permissionStatus.onchange = () => {
        if(permissionStatus.state === 'granted') handleRequestLocation();
        else if (permissionStatus.state === 'denied') setLocationStatus('denied');
        else setLocationStatus('idle');
      };
    });
  }, []);

  const handleRequestLocation = () => {
    if (!navigator.geolocation) return;
    setLocationStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setLocationStatus('granted');
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLocationStatus('denied');
      }
    );
  };


  // Effect to persist businesses to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('businesses', JSON.stringify(businesses));
    } catch (error) {
      console.error("Failed to save businesses to localStorage", error);
    }
  }, [businesses]);
  
  // Effect to listen for online/offline events
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const displayedBusinesses = useMemo(() => {
    let results: DisplayBusiness[] = [];
    businesses.forEach((business) => {
      const typeMatch = selectedType === 'All' || business.type === selectedType;
      const searchMatch = business.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      if (typeMatch && searchMatch) {
        const matchingBranches = business.branches.filter((branch) => {
          const cityMatch = selectedCity === 'All Cities' || branch.city === selectedCity;
          const areaMatch = selectedArea === 'All' || branch.area === selectedArea;
          return cityMatch && areaMatch;
        });

        matchingBranches.forEach((branch) => {
          results.push({
            ...branch,
            businessId: business.id,
            businessName: business.name,
            businessType: business.type,
          });
        });
      }
    });

    if (userLocation) {
        results = results.map(business => ({
            ...business,
            distance: getDistance(userLocation.lat, userLocation.lon, business.latitude, business.longitude)
        })).sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));
    }

    return results;
  }, [businesses, selectedCity, selectedArea, selectedType, searchQuery, userLocation]);
  
  useEffect(() => {
    if (!closingAlertsEnabled || typeof Notification === 'undefined') {
      return;
    }
    
    if (displayedBusinesses.length === 0) {
      notificationSentRef.current = false; // Reset if no businesses
      return;
    }
    
    const closingSoonCount = displayedBusinesses.filter(
      (b) => getBusinessStatus(b.schedule) === 'closingSoon'
    ).length;
    
    const totalCount = displayedBusinesses.length;
    const majorityIsClosingSoon = (closingSoonCount / totalCount) > 0.5;

    if (majorityIsClosingSoon) {
      if (!notificationSentRef.current) {
        new Notification('OpenNow Alert', {
          body: 'Heads up! The majority of businesses in your current view are closing within the hour.',
          icon: '/favicon.ico'
        });
        notificationSentRef.current = true;
      }
    } else {
      // Reset the flag once the condition is no longer met
      notificationSentRef.current = false;
    }
  }, [displayedBusinesses, closingAlertsEnabled]);

  const handleToggleClosingAlerts = async () => {
    if (typeof Notification === 'undefined') return;

    if (Notification.permission === 'denied') {
      alert("Notification permission has been denied. Please enable it in your browser settings to use this feature.");
      return;
    }

    if (!closingAlertsEnabled) {
      if (Notification.permission === 'granted') {
        setClosingAlertsEnabled(true);
      } else { // 'default' permission state
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setClosingAlertsEnabled(true);
        } else {
          setClosingAlertsEnabled(false);
        }
      }
    } else {
      setClosingAlertsEnabled(false);
    }
  };

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setSelectedArea('All');
  };

  const handleOpenAddModal = () => {
    setEditingBusiness(null);
    setModalOpen(true);
  };
  
  const handleOpenEditModal = (displayBusiness: DisplayBusiness) => {
    setEditingBusiness(displayBusiness);
    setModalOpen(true);
  };
  
  const handleOpenDetailModal = (business: DisplayBusiness) => {
    setViewedBusiness(business);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingBusiness(null);
  };

  const handleAddBusiness = (data: Omit<Business, 'id' | 'branches'> & { branch: Omit<Branch, 'id'> }) => {
    // This is a simplified add - in a real app, you'd need a geocoding step
    // For now, we'll add placeholder coordinates.
    const newBusiness: Business = {
      id: businesses.length > 0 ? Math.max(...businesses.map((b) => b.id)) + 1 : 1,
      name: data.name,
      type: data.type,
      branches: [{
        ...data.branch,
        latitude: -17.825, // Placeholder coords
        longitude: 31.033,
        id: Date.now(), // simple unique id for the branch
      }],
    };
    setBusinesses((prev) => [...prev, newBusiness]);
    handleCloseModal();
  };

  const handleEditBusiness = (data: DisplayBusiness) => {
     setBusinesses(prev => prev.map(business => {
        if (business.id === data.businessId) {
            const updatedBranches = business.branches.map(branch => {
                if (branch.id === data.id) {
                    return {
                      id: data.id,
                      address: data.address,
                      city: data.city,
                      area: data.area,
                      schedule: data.schedule,
                      latitude: data.latitude,
                      longitude: data.longitude,
                    };
                }
                return branch;
            });
            return {
                ...business,
                name: data.businessName,
                type: data.businessType,
                branches: updatedBranches
            };
        }
        return business;
    }));
    handleCloseModal();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans transition-colors duration-300">
      <main className="container mx-auto px-4 py-8">
        <Header isOffline={isOffline} />
        <Filters
          locations={LOCATIONS}
          businessTypes={BUSINESS_TYPES}
          selectedCity={selectedCity}
          onCityChange={handleCityChange}
          selectedArea={selectedArea}
          onAreaChange={setSelectedArea}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          closingAlertsEnabled={closingAlertsEnabled}
          onToggleClosingAlerts={handleToggleClosingAlerts}
          locationStatus={locationStatus}
          onRequestLocation={handleRequestLocation}
        />
        <div className="mt-8 px-4 sm:px-6 lg:px-8 flex justify-end">
          <ViewSwitcher viewMode={viewMode} setViewMode={setViewMode} />
        </div>
        <BusinessGrid
          businesses={displayedBusinesses}
          onOpenAddBusinessModal={handleOpenAddModal}
          onOpenEditModal={handleOpenEditModal}
          onViewDetails={handleOpenDetailModal}
          viewMode={viewMode}
        />
      </main>
      <AddBusinessModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddBusiness={handleAddBusiness}
        onEditBusiness={handleEditBusiness}
        locations={LOCATIONS}
        businessTypes={BUSINESS_TYPES.filter((t) => t !== 'All') as BusinessType[]}
        businessToEdit={editingBusiness}
      />
      <BusinessDetailModal 
        isOpen={!!viewedBusiness}
        onClose={() => setViewedBusiness(null)}
        business={viewedBusiness}
      />
    </div>
  );
};

export default App;