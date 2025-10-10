export interface Holiday {
  date: string; // YYYY-MM-DD format for easy comparison
  name: string;
}

/**
 * Calculates and returns a list of Zimbabwean public holidays for a given year.
 * Handles both fixed-date and floating holidays.
 * @param year The year for which to get the holidays.
 * @returns An array of Holiday objects.
 */
export const getZimbabweHolidays = (year: number): Holiday[] => {
  const holidays: Holiday[] = [];

  // Fixed Date Holidays
  holidays.push({ date: `${year}-01-01`, name: "New Year's Day" });
  holidays.push({ date: `${year}-02-21`, name: 'Robert Gabriel Mugabe National Youth Day' });
  holidays.push({ date: `${year}-04-18`, name: 'Independence Day' });
  holidays.push({ date: `${year}-05-01`, name: "Workers' Day" });
  holidays.push({ date: `${year}-05-25`, name: 'Africa Day' });
  holidays.push({ date: `${year}-12-22`, name: 'Unity Day' });
  holidays.push({ date: `${year}-12-25`, name: 'Christmas Day' });
  holidays.push({ date: `${year}-12-26`, name: 'Boxing Day' });

  // Floating Holidays
  // Good Friday & Easter (Complex calculation, omitted for simplicity but can be added)

  // Heroes' Day: Second Monday of August
  const augustFirst = new Date(year, 7, 1);
  let daysUntilFirstMonday = (8 - augustFirst.getDay()) % 7;
  if (daysUntilFirstMonday === 0) daysUntilFirstMonday = 7; // If it's already a monday, we want next one
  const secondMondayDate = 1 + daysUntilFirstMonday + 7;
  const heroesDay = new Date(year, 7, secondMondayDate);
  holidays.push({ date: heroesDay.toISOString().split('T')[0], name: "Heroes' Day" });
  
  // Defence Forces Day: Tuesday after Heroes' Day
  const defenceForcesDay = new Date(heroesDay);
  defenceForcesDay.setDate(heroesDay.getDate() + 1);
  holidays.push({ date: defenceForcesDay.toISOString().split('T')[0], name: 'Defence Forces Day' });

  return holidays;
};

/**
 * Checks if a given date is a public holiday in Zimbabwe.
 * @param date The date to check.
 * @returns The Holiday object if it's a holiday, otherwise null.
 */
export const getHolidayForDate = (date: Date): Holiday | null => {
    const year = date.getFullYear();
    const holidays = getZimbabweHolidays(year);
    const dateString = date.toISOString().split('T')[0];
    
    return holidays.find(h => h.date === dateString) || null;
}
