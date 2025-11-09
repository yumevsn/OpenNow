
import React, { useState, useEffect } from 'react';
import { DisplayBusiness, Day, Hours } from '../types';
import { DAYS_OF_WEEK } from '../constants';
import { getBusinessStatus, BusinessStatus, formatHours, parseTimeToMinutes } from '../utils/time';
import { Holiday } from '../utils/date';

interface BusinessHabitCardProps {
  business: DisplayBusiness;
  onOpenEditModal: (business: DisplayBusiness) => void;
  currentDay: Day;
  holidaysInWeek: Map<Day, Holiday>;
}

const EditIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
    </svg>
);

const HolidayIcon: React.FC<{ title: string }> = ({ title }) => (
  // FIX: Replaced title attribute with a <title> element for accessibility and to fix the TypeScript error.
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-1 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
    <title>{title}</title>
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const TimelineBar: React.FC<{
  hours: Hours;
  isToday: boolean;
  now: Date;
  status: BusinessStatus;
}> = ({ hours, isToday, now, status }) => {
  if (!hours) return null;

  const openMinutes = parseTimeToMinutes(hours.open);
  const closeMinutes = parseTimeToMinutes(hours.close);

  const renderBar = (start: number, end: number) => {
    const left = (start / 1440) * 100;
    const width = ((end - start) / 1440) * 100;

    if (isToday) {
      const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
      const duration = end - start;
      let progressPercent = 0;

      if (currentTimeInMinutes >= start && currentTimeInMinutes <= end) {
        progressPercent = ((currentTimeInMinutes - start) / duration) * 100;
      } else if (currentTimeInMinutes > end) {
        progressPercent = 100;
      }
      
      const isCurrentlyClosed = status === 'closed' && (currentTimeInMinutes > end || currentTimeInMinutes < start);

      if(isCurrentlyClosed && progressPercent === 100) {
        // If it's after hours, show the full red bar
         return (
          <div
            className="absolute h-full rounded-full bg-red-500"
            style={{ left: `${left}%`, width: `${width}%` }}
          />
        );
      }
      
      const isClosingSoon = status === 'closingSoon';

      // The live progress bar
      return (
        <div
          className={`absolute h-full rounded-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 ${isClosingSoon ? 'animate-pulse' : ''}`}
          style={{ left: `${left}%`, width: `${width}%` }}
        >
          <div
            className="absolute top-0 h-full bg-gray-100 dark:bg-gray-700 transition-all duration-500 ease-linear"
            style={{ left: `${progressPercent}%`, right: '0' }}
          />
        </div>
      );
    }

    // Bar for non-today days
    return (
      <div
        className="absolute h-full bg-gray-300 dark:bg-gray-500 rounded-full"
        style={{ left: `${left}%`, width: `${width}%` }}
      />
    );
  };
  
  // Handle overnight hours by splitting into two bars
  if (openMinutes > closeMinutes) {
    return <>
      {renderBar(openMinutes, 1440)}
      {renderBar(0, closeMinutes)}
    </>
  }

  return renderBar(openMinutes, closeMinutes);
};


const BusinessHabitCard: React.FC<BusinessHabitCardProps> = ({ business, onOpenEditModal, currentDay, holidaysInWeek }) => {
  const [status, setStatus] = useState<BusinessStatus>(getBusinessStatus(business.schedule));
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setStatus(getBusinessStatus(business.schedule));
      setNow(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [business.schedule]);

  const statusIndicatorClasses: Record<BusinessStatus, string> = {
    open: 'bg-green-500',
    closingSoon: 'bg-yellow-500',
    closed: 'bg-red-500',
  };

  const statusTitle: Record<BusinessStatus, string> = {
      open: 'Open now',
      closingSoon: 'Closing soon',
      closed: 'Currently closed',
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col justify-between transition-shadow hover:shadow-lg dark:hover:shadow-xl dark:shadow-indigo-900/50">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center">
              <span
                className={`w-3 h-3 rounded-full mr-3 flex-shrink-0 transition-colors ${statusIndicatorClasses[status]}`}
                title={`Status: ${statusTitle[status]}`}
              ></span>
              <p className="text-gray-900 dark:text-gray-100 font-bold truncate" title={business.businessName}>{business.businessName}</p>
            </div>
            <p className="ml-6 text-sm text-gray-500 dark:text-gray-400">{business.area} - <span className="font-medium">{statusTitle[status]}</span></p>
          </div>

          <button onClick={() => onOpenEditModal(business)} className="ml-4 flex-shrink-0 text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors" aria-label={`Edit ${business.businessName}`}>
            <EditIcon />
          </button>
        </div>
        
        <div className="space-y-3 mt-4">
          {DAYS_OF_WEEK.map(day => {
            const hours = business.schedule[day];
            const isToday = day === currentDay;
            const holiday = holidaysInWeek.get(day);
            const isHoliday = !!holiday;

            return (
              <div key={day} className="grid grid-cols-6 gap-2 items-center text-sm">
                <div className="col-span-2">
                  <p className={`font-medium flex items-center ${isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-800 dark:text-gray-200'}`}>
                    {day}
                    {isHoliday && <HolidayIcon title={holiday.name} />}
                  </p>
                  <p className={`text-xs ${!hours ? 'text-gray-400 dark:text-gray-500' : 'text-gray-500 dark:text-gray-400'}`}>{formatHours(hours)}</p>
                </div>
                <div className="col-span-4 h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden relative">
                   <TimelineBar hours={hours} isToday={isToday} now={now} status={status}/>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BusinessHabitCard;
