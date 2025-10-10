

import React, { useState, useEffect } from 'react';
import { DisplayBusiness, Day } from '../types';
import { DAYS_OF_WEEK } from '../constants';
import { getHolidayForDate, Holiday } from '../utils/date';
import { getBusinessStatus, BusinessStatus, formatHours } from '../utils/time';
import BusinessHabitCard from './BusinessHabitCard';


interface BusinessGridProps {
  businesses: DisplayBusiness[];
  onOpenAddBusinessModal: () => void;
  onOpenEditModal: (business: DisplayBusiness) => void;
  viewMode: 'table' | 'grid';
}

const EditIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);

const BusinessRow: React.FC<{ business: DisplayBusiness; holidaysInWeek: Map<Day, Holiday>; onOpenEditModal: (business: DisplayBusiness) => void; currentDay: Day; }> = ({ business, holidaysInWeek, onOpenEditModal, currentDay }) => {
  const [status, setStatus] = useState<BusinessStatus>(getBusinessStatus(business.schedule));

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(getBusinessStatus(business.schedule));
    }, 60000);
    return () => clearInterval(interval);
  }, [business.schedule]);
  
  const statusIndicatorClasses: Record<BusinessStatus, string> = {
    open: 'bg-green-500',
    closingSoon: 'bg-yellow-500',
    closed: 'bg-red-500',
  };

  const statusTitle: Record<BusinessStatus, string> = {
      open: 'Open',
      closingSoon: 'Closing Soon',
      closed: 'Closed',
  };

  const BusinessNameDisplay = () => (
     <div className="flex items-center">
      <span
        className={`w-3 h-3 rounded-full mr-3 flex-shrink-0 ${statusIndicatorClasses[status]}`}
        title={`Status: ${statusTitle[status]}`}
      ></span>
      <span className="text-gray-900 font-medium">{business.businessName}</span>
      <span className="ml-2 text-gray-500">({business.area})</span>
    </div>
  );

  return (
    <>
      {/* Mobile Card */}
      <div className="md:hidden bg-white rounded-lg shadow-md p-3 relative">
        <div className="text-base font-semibold mb-2 pr-8">
           <BusinessNameDisplay />
        </div>
        <button onClick={() => onOpenEditModal(business)} className="absolute top-3 right-3 text-gray-400 hover:text-indigo-600 transition-colors" aria-label={`Edit ${business.businessName}`}>
            <EditIcon />
        </button>
        <div className="flex flex-wrap gap-1.5 text-xs">
          {DAYS_OF_WEEK.map((day) => {
            const hours = business.schedule[day];
            const isClosed = !hours;
            const isToday = day === currentDay;
            const holiday = holidaysInWeek.get(day);
            const isHoliday = !!holiday;

            return (
              <div 
                key={day} 
                className={`p-1.5 rounded-lg flex-grow basis-16 text-center ${isHoliday ? 'bg-red-50' : (isToday ? 'bg-indigo-50 ring-1 ring-indigo-200' : 'bg-gray-50')}`}
                title={isHoliday ? holiday.name : undefined}
              >
                <div className={`font-bold ${isHoliday ? 'text-red-700' : (isToday ? 'text-indigo-700' : 'text-gray-500')}`}>{day}</div>
                <div className={`mt-1 ${isClosed ? 'text-gray-400' : 'text-gray-800'}`}>
                  {formatHours(hours)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Desktop Row */}
      <tr className="hidden md:table-row even:bg-gray-50">
        <td className="sticky left-0 bg-white even:bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6 z-10">
           <BusinessNameDisplay />
        </td>
        {DAYS_OF_WEEK.map((day) => {
          const hours = business.schedule[day];
          const isClosed = !hours;
          const isToday = day === currentDay;
          const holiday = holidaysInWeek.get(day);
          const isHoliday = !!holiday;
          
          return (
            <td
              key={`${business.id}-${day}`}
              className={`whitespace-nowrap px-3 py-4 text-sm text-center ${isClosed ? 'text-gray-400' : 'text-gray-700'} ${isHoliday ? 'bg-red-50' : (isToday ? 'bg-indigo-50' : '')}`}
              title={isHoliday ? holiday.name : ''}
            >
              {formatHours(hours)}
            </td>
          );
        })}
        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
          <button onClick={() => onOpenEditModal(business)} className="text-indigo-600 hover:text-indigo-900" aria-label={`Edit ${business.businessName}`}>
            Edit
          </button>
        </td>
      </tr>
    </>
  );
};

const BusinessGrid: React.FC<BusinessGridProps> = ({ businesses, onOpenAddBusinessModal, onOpenEditModal, viewMode }) => {
  const [holidaysInWeek, setHolidaysInWeek] = useState<Map<Day, Holiday>>(new Map());
  const now = new Date();
  const todayIndex = (now.getDay() + 6) % 7;
  const currentDay = DAYS_OF_WEEK[todayIndex];

  useEffect(() => {
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - todayIndex);
    startOfWeek.setHours(0, 0, 0, 0);

    const holidayMap = new Map<Day, Holiday>();
    for (let i = 0; i < 7; i++) {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        const holiday = getHolidayForDate(date);
        if (holiday) {
            const dayOfWeek = DAYS_OF_WEEK[i];
            holidayMap.set(dayOfWeek, holiday);
        }
    }
    setHolidaysInWeek(holidayMap);
  }, []);

  if (businesses.length === 0) {
    return (
      <div className="text-center py-12 px-4 bg-white shadow ring-1 ring-black ring-opacity-5 md:rounded-lg mt-8 mx-4 sm:mx-6 lg:mx-8">
        <h3 className="text-lg font-medium text-gray-900">No results found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Can't find what you're looking for? Add a new business listing to help others.
        </p>
        <div className="mt-6">
          <button
            type="button"
            onClick={onOpenAddBusinessModal}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Business
          </button>
        </div>
      </div>
    );
  }
  
  if (viewMode === 'grid') {
    return (
      <div className="px-4 sm:px-6 lg:px-8 mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {businesses.map((business) => (
          <BusinessHabitCard 
            key={business.id} 
            business={business} 
            onOpenEditModal={onOpenEditModal} 
            currentDay={currentDay}
            holidaysInWeek={holidaysInWeek}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-6">
      {/* Container for Mobile Cards */}
      <div className="md:hidden space-y-4">
        {businesses.map((business) => (
          <BusinessRow key={business.id} business={business} holidaysInWeek={holidaysInWeek} onOpenEditModal={onOpenEditModal} currentDay={currentDay} />
        ))}
      </div>

      {/* Container for Desktop Table */}
      <div className="hidden md:flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="sticky left-0 bg-gray-50 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 z-10"
                    >
                      Business (Branch)
                    </th>
                    {DAYS_OF_WEEK.map((day) => (
                      <th
                        key={day}
                        scope="col"
                        className={`py-3.5 px-3 text-center text-sm font-semibold text-gray-900 ${day === currentDay ? 'bg-indigo-50 text-indigo-700' : ''}`}
                      >
                        {day}
                      </th>
                    ))}
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {businesses.map((business) => (
                     <BusinessRow key={business.id} business={business} holidaysInWeek={holidaysInWeek} onOpenEditModal={onOpenEditModal} currentDay={currentDay} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessGrid;