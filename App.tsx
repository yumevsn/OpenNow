
import React, { useState, useMemo, useEffect, useRef } from 'react';
import Header from './components/Header';
import Filters from './components/Filters';
import BusinessGrid from './components/BusinessGrid';
import AddBusinessModal from './components/AddBusinessModal';
import { Business, BusinessType, Branch, DisplayBusiness } from './types';
import { LOCATIONS, BUSINESS_TYPES, SAMPLE_BUSINESSES } from './constants';
import ViewSwitcher from './components/ViewSwitcher';
import { getBusinessStatus } from './utils/time';

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


const App: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>(loadBusinessesFromStorage);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<DisplayBusiness | null>(null);

  const [selectedCity, setSelectedCity] = useState<string>('All Cities');
  const [selectedArea, setSelectedArea] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<BusinessType | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('grid');

  const [closingAlertsEnabled, setClosingAlertsEnabled] = useState(false);
  const notificationSentRef = useRef(false);
  
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

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
    const results: DisplayBusiness[] = [];
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
    return results;
  }, [businesses, selectedCity, selectedArea, selectedType, searchQuery]);
  
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

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingBusiness(null);
  };

  const handleAddBusiness = (data: Omit<Business, 'id' | 'branches'> & { branch: Omit<Branch, 'id'> }) => {
    const newBusiness: Business = {
      id: businesses.length > 0 ? Math.max(...businesses.map((b) => b.id)) + 1 : 1,
      name: data.name,
      type: data.type,
      branches: [{
        ...data.branch,
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
        />
        <div className="mt-8 px-4 sm:px-6 lg:px-8 flex justify-end">
          <ViewSwitcher viewMode={viewMode} setViewMode={setViewMode} />
        </div>
        <BusinessGrid
          businesses={displayedBusinesses}
          onOpenAddBusinessModal={handleOpenAddModal}
          onOpenEditModal={handleOpenEditModal}
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
    </div>
  );
};

export default App;