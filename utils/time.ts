import { Hours, Schedule, Day } from '../types';
import { DAYS_OF_WEEK } from '../constants';

/**
 * Converts a time string (e.g., "5 PM", "8:30 AM") to 24-hour format (e.g., "17:00", "08:30").
 * @param timeStr The time string in 12-hour AM/PM format.
 * @returns The time string in 24-hour HH:mm format.
 */
export function formatTo24Hour(timeStr: string): string {
  if (!timeStr) return '';
  const timeStrLower = timeStr.toLowerCase();
  const isPM = timeStrLower.includes('pm');
  
  let [hours, minutes] = [0, 0];
  const timePart = timeStrLower.replace('am', '').replace('pm', '').trim();
  
  if (timePart.includes(':')) {
    [hours, minutes] = timePart.split(':').map(Number);
  } else {
    hours = Number(timePart);
  }

  if (isPM && hours < 12) {
    hours += 12;
  } else if (!isPM && hours === 12) { // Handle 12 AM (midnight)
    hours = 0;
  }

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

/**
 * Converts a 24-hour time string (e.g., "17:00") to 12-hour AM/PM format (e.g., "5 PM").
 * It simplifies the output by omitting minutes if they are zero.
 * @param timeStr The time string in 24-hour HH:mm format.
 * @returns The time string in 12-hour AM/PM format.
 */
export function formatTo12Hour(timeStr: string): string {
  if (!timeStr) return '';
  const [hours24, minutes] = timeStr.split(':').map(Number);
  
  const modifier = hours24 >= 12 ? 'PM' : 'AM';
  let hours12 = hours24 % 12;
  if (hours12 === 0) {
    hours12 = 12; // Handle midnight (00:xx) and noon (12:xx)
  }
  
  if (minutes === 0) {
    return `${hours12} ${modifier}`;
  }
  
  const formattedMinutes = String(minutes).padStart(2, '0');
  return `${hours12}:${formattedMinutes} ${modifier}`;
}

export type BusinessStatus = 'open' | 'closingSoon' | 'closed';

export const formatHours = (hours: Hours): string => {
  if (!hours) {
    return 'Closed';
  }
  const simplify = (time: string) => time.replace(':00', '');
  return `${simplify(hours.open)} – ${simplify(hours.close)}`;
};

export const parseTimeToMinutes = (timeStr: string): number => {
  const [time, modifier] = timeStr.split(' ');
  const [hoursStr, minutesStr] = time.split(':');
  
  let hours = parseInt(hoursStr, 10);
  const minutes = minutesStr ? parseInt(minutesStr, 10) : 0;

  if (modifier?.toUpperCase() === 'PM' && hours < 12) {
    hours += 12;
  }
  if (modifier?.toUpperCase() === 'AM' && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
};

export const getBusinessStatus = (schedule: Schedule): BusinessStatus => {
  const now = new Date();
  const todayIndex = (now.getDay() + 6) % 7;
  const yesterdayIndex = (now.getDay() + 5) % 7;
  const today = DAYS_OF_WEEK[todayIndex];
  const yesterday = DAYS_OF_WEEK[yesterdayIndex];
  
  const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();

  const yesterdayHours = schedule[yesterday];
  if (yesterdayHours) {
    const openTimeYesterday = parseTimeToMinutes(yesterdayHours.open);
    const closeTimeYesterday = parseTimeToMinutes(yesterdayHours.close);
    if (openTimeYesterday > closeTimeYesterday) { // overnight
      if (currentTimeInMinutes < closeTimeYesterday) {
        if (closeTimeYesterday - currentTimeInMinutes <= 60) {
          return 'closingSoon';
        }
        return 'open';
      }
    }
  }

  const todayHours = schedule[today];
  if (todayHours) {
    const openTimeToday = parseTimeToMinutes(todayHours.open);
    const closeTimeToday = parseTimeToMinutes(todayHours.close);
    if (currentTimeInMinutes >= openTimeToday) {
       if (openTimeToday < closeTimeToday && currentTimeInMinutes < closeTimeToday) {
           const closingSoonTime = closeTimeToday - 60;
           if (currentTimeInMinutes >= closingSoonTime) {
             return 'closingSoon';
           }
           return 'open';
       } else if (openTimeToday > closeTimeToday) { // overnight
           return 'open';
       }
    }
  }

  return 'closed';
};
