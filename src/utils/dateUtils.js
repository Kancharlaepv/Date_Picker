// Date utility functions for recurring date calculations

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

export const formatShortDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

export const isSameDay = (date1, date2) => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const addWeeks = (date, weeks) => {
  return addDays(date, weeks * 7);
};

export const addMonths = (date, months) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

export const addYears = (date, years) => {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
};

export const getWeekday = (date) => {
  return date.getDay(); // 0 = Sunday, 1 = Monday, etc.
};

export const getDayOfMonth = (date) => {
  return date.getDate();
};

export const getWeekOfMonth = (date) => {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const firstWeekday = firstDayOfMonth.getDay();
  const dayOfMonth = date.getDate();
  
  return Math.ceil((dayOfMonth + firstWeekday) / 7);
};

export const generateRecurringDates = (startDate, pattern, maxDates = 50) => {
  const dates = [];
  let currentDate = new Date(startDate);
  let count = 0;

  // Always include the start date
  dates.push(new Date(currentDate));
  count++;

  if (pattern.type === 'none') {
    return dates;
  }

  while (count < maxDates) {
    switch (pattern.type) {
      case 'daily':
        currentDate = addDays(currentDate, pattern.interval || 1);
        break;
      
      case 'weekly':
        if (pattern.daysOfWeek && pattern.daysOfWeek.length > 0) {
          // Find next occurrence based on selected days of week
          currentDate = getNextWeeklyOccurrence(currentDate, pattern.daysOfWeek);
        } else {
          currentDate = addWeeks(currentDate, pattern.interval || 1);
        }
        break;
      
      case 'monthly':
        if (pattern.monthlyType === 'weekday' && pattern.weekOfMonth && pattern.dayOfWeek !== undefined) {
          // Specific week and day of month (e.g., second Tuesday)
          currentDate = getNextMonthlyWeekdayOccurrence(
            currentDate, 
            pattern.weekOfMonth, 
            pattern.dayOfWeek, 
            pattern.interval || 1
          );
        } else {
          // Same day of month
          currentDate = addMonths(currentDate, pattern.interval || 1);
        }
        break;
      
      case 'yearly':
        currentDate = addYears(currentDate, pattern.interval || 1);
        break;
      
      default:
        return dates;
    }

    // Check if we've reached the end date
    if (pattern.endDate && currentDate > pattern.endDate) {
      break;
    }

    dates.push(new Date(currentDate));
    count++;
  }

  return dates;
};

const getNextWeeklyOccurrence = (currentDate, daysOfWeek) => {
  const currentWeekday = getWeekday(currentDate);
  let nextDate = new Date(currentDate);
  
  // Find the next day of the week that matches our pattern
  for (let i = 1; i <= 7; i++) {
    nextDate = addDays(currentDate, i);
    const nextWeekday = getWeekday(nextDate);
    
    if (daysOfWeek.includes(nextWeekday)) {
      return nextDate;
    }
  }
  
  return nextDate;
};

const getNextMonthlyWeekdayOccurrence = (currentDate, weekOfMonth, dayOfWeek, monthInterval) => {
  let nextMonth = addMonths(currentDate, monthInterval);
  
  // Find the specific week and day of the next month
  const firstDayOfMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 1);
  const firstWeekday = getWeekday(firstDayOfMonth);
  
  // Calculate the date of the specific weekday in the specific week
  let targetDate = addDays(firstDayOfMonth, (weekOfMonth - 1) * 7 + (dayOfWeek - firstWeekday + 7) % 7);
  
  // Ensure we're still in the same month
  if (targetDate.getMonth() !== nextMonth.getMonth()) {
    targetDate = addDays(targetDate, -7);
  }
  
  return targetDate;
};

export const getCalendarDates = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = new Date(firstDay);
  const endDate = new Date(lastDay);
  
  // Start from the first day of the week containing the first day of the month
  startDate.setDate(startDate.getDate() - startDate.getDay());
  
  // End on the last day of the week containing the last day of the month
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
  
  const dates = [];
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return dates;
};
