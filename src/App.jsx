import React from 'react';
import { DatePickerProvider, useDatePicker } from './context/DatePickerContext';
import RecurringDatePicker from './components/RecurringDatePicker';
import { formatDate } from './utils/dateUtils';
import './App.css';

function App() {
  const handleDateSelect = (dates, pattern) => {
    console.log('Selected dates:', dates);
    console.log('Recurrence pattern:', pattern);
  };

  return (
    <DatePickerProvider>
      <div className="app-container">
        <h1 className="app-title">Recurring Date Picker</h1>
        <p className="app-subtitle">
          A powerful, reusable React component for selecting recurring dates, 
          similar to the feature in the TickTick app. Built with modern React patterns and beautiful UI.
        </p>

        <div className="demo-section">
          <h2 className="demo-title">Interactive Demo</h2>
          <RecurringDatePicker
            onDateSelect={handleDateSelect}
            placeholder="Click to select recurring dates..."
          />
          
          <DatePickerContent />
        </div>

        <div className="demo-section">
          <h2 className="demo-title">Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-title">🔄 Multiple Recurrence Patterns</div>
              <div className="feature-description">One-time, Daily, Weekly, Monthly, and Yearly patterns with advanced customization options.</div>
            </div>
            <div className="feature-card">
              <div className="feature-title">📅 Flexible Weekly Selection</div>
              <div className="feature-description">Choose specific days of the week for precise weekly recurring schedules.</div>
            </div>
            <div className="feature-card">
              <div className="feature-title">⚙️ Custom Intervals</div>
              <div className="feature-description">Every N days/weeks/months/years with intelligent date calculation.</div>
            </div>
            <div className="feature-card">
              <div className="feature-title">📊 Visual Calendar Preview</div>
              <div className="feature-description">Interactive calendar view with highlighted dates and real-time preview.</div>
            </div>
            <div className="feature-card">
              <div className="feature-title">🎯 Advanced Monthly Patterns</div>
              <div className="feature-description">Support for "second Tuesday of every month" style patterns.</div>
            </div>
            <div className="feature-card">
              <div className="feature-title">📱 Responsive Design</div>
              <div className="feature-description">Works seamlessly on desktop and mobile devices with touch support.</div>
            </div>
          </div>
        </div>
      </div>
    </DatePickerProvider>
  );
}

// Component to display selected dates
const DatePickerContent = () => {
  const { selectedDates, recurrencePattern } = useDatePicker();

  if (selectedDates.length === 0) {
    return (
      <div className="selected-dates-display">
        <div className="selected-dates-title">No dates selected</div>
        <p style={{ color: '#666', margin: 0 }}>
          Use the date picker above to select recurring dates.
        </p>
      </div>
    );
  }

  const getPatternDescription = () => {
    switch (recurrencePattern.type) {
      case 'none':
        return 'One-time event';
      case 'daily':
        return `Every ${recurrencePattern.interval === 1 ? '' : recurrencePattern.interval + ' '}day${recurrencePattern.interval > 1 ? 's' : ''}`;
      case 'weekly':
        if (recurrencePattern.daysOfWeek && recurrencePattern.daysOfWeek.length > 0) {
          const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          const selectedDays = recurrencePattern.daysOfWeek.map(day => weekdayNames[day]);
          return `Weekly on ${selectedDays.join(', ')}`;
        }
        return `Every ${recurrencePattern.interval === 1 ? '' : recurrencePattern.interval + ' '}week${recurrencePattern.interval > 1 ? 's' : ''}`;
      case 'monthly':
        if (recurrencePattern.monthlyType === 'weekday' && recurrencePattern.weekOfMonth && recurrencePattern.dayOfWeek !== undefined) {
          const weekdayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          const ordinals = ['', 'first', 'second', 'third', 'fourth', 'fifth'];
          const ordinal = ordinals[recurrencePattern.weekOfMonth] || `${recurrencePattern.weekOfMonth}th`;
          return `Monthly on the ${ordinal} ${weekdayNames[recurrencePattern.dayOfWeek]}`;
        }
        return `Every ${recurrencePattern.interval === 1 ? '' : recurrencePattern.interval + ' '}month${recurrencePattern.interval > 1 ? 's' : ''}`;
      case 'yearly':
        return `Every ${recurrencePattern.interval === 1 ? '' : recurrencePattern.interval + ' '}year${recurrencePattern.interval > 1 ? 's' : ''}`;
      default:
        return 'Custom pattern';
    }
  };

  return (
    <div className="selected-dates-display">
      <div className="selected-dates-title">
        Selected Dates ({selectedDates.length} total)
      </div>
      <div style={{ marginBottom: '16px', color: '#666', fontWeight: '500' }}>
        Pattern: {getPatternDescription()}
        {recurrencePattern.endDate && (
          <span> • Ends on {formatDate(recurrencePattern.endDate)}</span>
        )}
      </div>
      <div className="selected-dates-list">
        {selectedDates.slice(0, 10).map((date, index) => (
          <div key={index} className="selected-date-item">
            {index + 1}. {formatDate(date)}
          </div>
        ))}
        {selectedDates.length > 10 && (
          <div className="selected-date-item" style={{ fontStyle: 'italic', color: '#888' }}>
            ... and {selectedDates.length - 10} more dates
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
