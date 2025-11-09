
import React, { useState, useEffect } from 'react';
import { Business, BusinessType, Day, Schedule, DisplayBusiness, Branch } from '../types';
import { DAYS_OF_WEEK } from '../constants';
import { formatTo12Hour, formatTo24Hour } from '../utils/time';

interface AddBusinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddBusiness: (data: Omit<Business, 'id' | 'branches'> & { branch: Omit<Branch, 'id'> }) => void;
  onEditBusiness: (data: DisplayBusiness) => void;
  locations: { [city: string]: string[] };
  businessTypes: BusinessType[];
  businessToEdit: DisplayBusiness | null;
}

type FormSchedule = {
  [key in Day]: {
    open: string;
    close: string;
    isClosed: boolean;
  };
};

const AddBusinessModal: React.FC<AddBusinessModalProps> = ({
  isOpen,
  onClose,
  onAddBusiness,
  onEditBusiness,
  locations,
  businessTypes,
  businessToEdit,
}) => {
  const isEditMode = businessToEdit !== null;
  const initialCity = Object.keys(locations)[0];
  
  const getInitialSchedule = () => DAYS_OF_WEEK.reduce((acc, day) => {
    acc[day] = { open: '08:00', close: '17:00', isClosed: false };
    return acc;
  }, {} as FormSchedule);

  const [name, setName] = useState('');
  const [type, setType] = useState<BusinessType>(businessTypes[0]);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState(initialCity);
  const [area, setArea] = useState(locations[initialCity][0]);
  const [formSchedule, setFormSchedule] = useState<FormSchedule>(getInitialSchedule());
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode && businessToEdit) {
      setName(businessToEdit.businessName);
      setType(businessToEdit.businessType);
      setAddress(businessToEdit.address);
      setCity(businessToEdit.city);
      setArea(businessToEdit.area);
      const scheduleToEdit = DAYS_OF_WEEK.reduce((acc, day) => {
          const hours = businessToEdit.schedule[day];
          acc[day] = {
              isClosed: !hours,
              open: hours ? formatTo24Hour(hours.open) : '08:00',
              close: hours ? formatTo24Hour(hours.close) : '17:00',
          };
          return acc;
      }, {} as FormSchedule);
      setFormSchedule(scheduleToEdit);
    } else {
        resetForm();
    }
  }, [businessToEdit, isOpen]);


  useEffect(() => {
    if (!isEditMode) {
      setArea(locations[city]?.[0] || '');
    }
  }, [city, isEditMode]);

  const handleScheduleChange = (
    day: Day,
    field: 'open' | 'close' | 'isClosed',
    value: string | boolean
  ) => {
    setFormSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };
  
  const resetForm = () => {
    setName('');
    setType(businessTypes[0]);
    setAddress('');
    setCity(initialCity);
    setArea(locations[initialCity][0]);
    setFormSchedule(getInitialSchedule());
    setError('');
  };

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !address.trim()) {
      setError('Business name and address are required.');
      return;
    }
    setError('');

    const schedule: Schedule = (Object.keys(formSchedule) as Day[]).reduce(
      (acc, day) => {
        const daySchedule = formSchedule[day];
        if (!daySchedule.isClosed && daySchedule.open >= daySchedule.close) {
            throw new Error(`On ${day}, closing time must be after opening time.`);
        }
        acc[day] = daySchedule.isClosed
          ? null
          : { open: formatTo12Hour(daySchedule.open), close: formatTo12Hour(daySchedule.close) };
        return acc;
      },
      {} as Schedule
    );

    try {
        if (isEditMode && businessToEdit) {
            onEditBusiness({
                ...businessToEdit,
                businessName: name,
                businessType: type,
                address,
                city,
                area,
                schedule,
            });
        } else {
            onAddBusiness({
                name,
                type,
                branch: { address, city, area, schedule }
            });
        }
        handleClose();
    } catch(err) {
        if (err instanceof Error) {
            setError(err.message);
        } else {
            setError("An unknown validation error occurred.");
        }
    }
  };

  if (!isOpen) {
    return null;
  }

  const inputClasses = "mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-indigo-500 dark:focus:border-indigo-500";
  const labelClasses = "block text-sm font-medium text-gray-700 dark:text-gray-300";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <div className="p-6">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {isEditMode ? 'Edit Business Branch' : 'Add a New Business'}
              </h2>
              <button
                type="button"
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <label htmlFor="business-name" className={labelClasses}>Business Name</label>
                <input type="text" id="business-name" value={name} onChange={(e) => setName(e.target.value)} className={inputClasses} />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="business-type" className={labelClasses}>Type</label>
                <select id="business-type" value={type} onChange={(e) => setType(e.target.value as BusinessType)} className={inputClasses}>
                  {businessTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              <div className="sm:col-span-6">
                <label htmlFor="business-address" className={labelClasses}>Branch Address</label>
                <input type="text" id="business-address" value={address} onChange={(e) => setAddress(e.target.value)} className={inputClasses} />
              </div>
              
              <div className="sm:col-span-3">
                <label htmlFor="business-city" className={labelClasses}>City</label>
                <select id="business-city" value={city} onChange={(e) => setCity(e.target.value)} className={inputClasses}>
                  {Object.keys(locations).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="business-area" className={labelClasses}>Area</label>
                <select id="business-area" value={area} onChange={(e) => setArea(e.target.value)} className={inputClasses}>
                  {locations[city]?.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">Weekly Hours</h3>
              <div className="mt-4 space-y-4">
                {DAYS_OF_WEEK.map(day => (
                  <div key={day} className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4 p-2 rounded-md even:bg-gray-50 dark:even:bg-white/5">
                    <div className="sm:col-span-1 flex items-center justify-between">
                      <span className="font-medium text-gray-800 dark:text-gray-200">{day}</span>
                      <div className="flex items-center sm:ml-4">
                        <input id={`closed-${day}`} type="checkbox" checked={formSchedule[day].isClosed} onChange={(e) => handleScheduleChange(day, 'isClosed', e.target.checked)} className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600" />
                        <label htmlFor={`closed-${day}`} className="ml-2 block text-sm text-gray-900 dark:text-gray-200">Closed</label>
                      </div>
                    </div>
                    <div className="sm:col-span-3 grid grid-cols-2 gap-4">
                       <div>
                         <label htmlFor={`open-${day}`} className="sr-only">Open Time</label>
                         <input type="time" id={`open-${day}`} value={formSchedule[day].open} onChange={(e) => handleScheduleChange(day, 'open', e.target.value)} disabled={formSchedule[day].isClosed} className={`${inputClasses} disabled:bg-gray-200 dark:disabled:bg-gray-600 disabled:cursor-not-allowed`} />
                       </div>
                       <div>
                         <label htmlFor={`close-${day}`} className="sr-only">Close Time</label>
                         <input type="time" id={`close-${day}`} value={formSchedule[day].close} onChange={(e) => handleScheduleChange(day, 'close', e.target.value)} disabled={formSchedule[day].isClosed} className={`${inputClasses} disabled:bg-gray-200 dark:disabled:bg-gray-600 disabled:cursor-not-allowed`} />
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900/80 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse items-center">
            <button
              type="submit"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isEditMode ? 'Save Changes' : 'Add Business'}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
             {error && <p className="text-sm text-red-600 sm:mr-4 flex-1 text-right">{error}</p>}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBusinessModal;