import React, { useState, useEffect, useRef } from 'react';
import { useDatePicker } from '../context/DatePickerContext';
import { formatDate, formatShortDate, generateRecurringDates, getCalendarDates } from '../utils/dateUtils';
import './RecurringDatePicker.css';

const RecurringDatePicker = ({ onDateSelect, placeholder = "Select recurring dates..." }) => {
  const {
    selectedDates,
    recurrencePattern,
    startDate,
    isPickerOpen,
    setStartDate,
    setRecurrencePattern,
    setSelectedDates,
    togglePicker,
    resetPicker
  } = useDatePicker();

  const [localStartDate, setLocalStartDate] = useState(startDate);
  const [localPattern, setLocalPattern] = useState(recurrencePattern);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [hasEndDate, setHasEndDate] = useState(false);
  const [previewDates, setPreviewDates] = useState([]);
  
  const dropdownRef = useRef(null);

  // Close picker when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        if (isPickerOpen) {
          togglePicker();
        }
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isPickerOpen) {
        togglePicker();
      }
    };

    if (isPickerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPickerOpen, togglePicker]);

  // Generate preview dates when pattern changes
  useEffect(() => {
    if (localPattern.type !== 'none') {
      const dates = generateRecurringDates(localStartDate, localPattern, 10);
      setPreviewDates(dates);
    } else {
      setPreviewDates([localStartDate]);
    }
  }, [localStartDate, localPattern]);

  const handleStartDateChange = (e) => {
    const newDate = new Date(e.target.value);
    setLocalStartDate(newDate);
    setCalendarDate(newDate);
  };

  const handleRecurrenceTypeChange = (type) => {
    setLocalPattern({
      ...localPattern,
      type,
      interval: 1,
      daysOfWeek: type === 'weekly' ? [localStartDate.getDay()] : [],
      dayOfMonth: type === 'monthly' ? localStartDate.getDate() : null,
      weekOfMonth: null,
      dayOfWeek: undefined,
      monthlyType: 'date' // 'date' or 'weekday'
    });
  };

  const handleIntervalChange = (e) => {
    const interval = parseInt(e.target.value) || 1;
    setLocalPattern({
      ...localPattern,
      interval: Math.max(1, interval)
    });
  };

  const handleWeekdayToggle = (day) => {
    const newDaysOfWeek = localPattern.daysOfWeek.includes(day)
      ? localPattern.daysOfWeek.filter(d => d !== day)
      : [...localPattern.daysOfWeek, day].sort();
    
    setLocalPattern({
      ...localPattern,
      daysOfWeek: newDaysOfWeek
    });
  };

  const handleEndDateToggle = () => {
    setHasEndDate(!hasEndDate);
    if (!hasEndDate) {
      // Set end date to 3 months from start date by default
      const endDate = new Date(localStartDate);
      endDate.setMonth(endDate.getMonth() + 3);
      setLocalPattern({
        ...localPattern,
        endDate
      });
    } else {
      setLocalPattern({
        ...localPattern,
        endDate: null
      });
    }
  };

  const handleEndDateChange = (e) => {
    const endDate = new Date(e.target.value);
    setLocalPattern({
      ...localPattern,
      endDate
    });
  };

  const handleMonthlyTypeChange = (monthlyType) => {
    if (monthlyType === 'weekday') {
      const weekOfMonth = Math.ceil(localStartDate.getDate() / 7);
      setLocalPattern({
        ...localPattern,
        monthlyType,
        weekOfMonth,
        dayOfWeek: localStartDate.getDay()
      });
    } else {
      setLocalPattern({
        ...localPattern,
        monthlyType,
        weekOfMonth: null,
        dayOfWeek: undefined
      });
    }
  };

  const handleApply = () => {
    const finalDates = generateRecurringDates(localStartDate, localPattern, 100);
    setStartDate(localStartDate);
    setRecurrencePattern(localPattern);
    setSelectedDates(finalDates);
    
    if (onDateSelect) {
      onDateSelect(finalDates, localPattern);
    }
    
    togglePicker();
  };

  const handleCancel = () => {
    setLocalStartDate(startDate);
    setLocalPattern(recurrencePattern);
    togglePicker();
  };

  const handleReset = () => {
    resetPicker();
    setLocalStartDate(new Date());
    setLocalPattern({
      type: 'none',
      interval: 1,
      endDate: null,
      daysOfWeek: [],
      dayOfMonth: null,
      weekOfMonth: null,
      customPattern: null
    });
    setHasEndDate(false);
  };

  const navigateCalendar = (direction) => {
    const newDate = new Date(calendarDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCalendarDate(newDate);
  };

  const renderCalendar = () => {
    const dates = getCalendarDates(calendarDate.getFullYear(), calendarDate.getMonth());
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return (
      <div className="calendar-container">
        <div className="calendar-header">
          <button 
            className="calendar-nav-btn" 
            onClick={() => navigateCalendar(-1)}
            type="button"
          >
            ‹
          </button>
          <div className="calendar-title">
            {calendarDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </div>
          <button 
            className="calendar-nav-btn" 
            onClick={() => navigateCalendar(1)}
            type="button"
          >
            ›
          </button>
        </div>
        
        <div className="calendar-grid">
          {weekdays.map(day => (
            <div key={day} className="calendar-weekday">{day}</div>
          ))}
          
          {dates.map((date, index) => {
            const isOtherMonth = date.getMonth() !== calendarDate.getMonth();
            const isStartDate = date.getTime() === localStartDate.getTime();
            const isRecurringDate = previewDates.some(d => 
              d.getTime() === date.getTime() && !isStartDate
            );
            
            return (
              <div
                key={index}
                className={`calendar-date ${
                  isOtherMonth ? 'other-month' : ''
                } ${
                  isStartDate ? 'start-date' : ''
                } ${
                  isRecurringDate ? 'recurring' : ''
                }`}
                onClick={() => {
                  if (!isOtherMonth) {
                    setLocalStartDate(date);
                  }
                }}
              >
                <span>{date.getDate()}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const getDisplayText = () => {
    if (selectedDates.length === 0) {
      return placeholder;
    }
    
    if (recurrencePattern.type === 'none') {
      return `Selected: ${formatShortDate(selectedDates[0])}`;
    }
    
    const typeLabel = {
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      yearly: 'Yearly'
    }[recurrencePattern.type];
    
    return `${typeLabel} from ${formatShortDate(startDate)} (${selectedDates.length} dates)`;
  };

  const getOrdinalWeek = (date) => {
    const weekOfMonth = Math.ceil(date.getDate() / 7);
    const ordinals = ['', 'first', 'second', 'third', 'fourth', 'fifth'];
    return ordinals[weekOfMonth] || `${weekOfMonth}th`;
  };

  const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="recurring-date-picker" ref={dropdownRef}>
      <button
        className="picker-trigger"
        onClick={togglePicker}
        type="button"
      >
        <span className={`trigger-text ${selectedDates.length > 0 ? 'has-selection' : ''}`}>
          {getDisplayText()}
        </span>
        <span className={`trigger-arrow ${isPickerOpen ? 'open' : ''}`}>
          ▼
        </span>
      </button>

      {isPickerOpen && (
        <div className="picker-dropdown">
          <div className="picker-body">
            {/* Start Date Section */}
            <div className="picker-section">
              <div className="section-title">Start Date</div>
              <input
                type="date"
                className="start-date-input"
                value={localStartDate.toISOString().split('T')[0]}
                onChange={handleStartDateChange}
              />
            </div>

            {/* Recurrence Pattern Section */}
            <div className="picker-section">
              <div className="section-title">Recurrence Pattern</div>
              <div className="recurrence-options">
                {['none', 'daily', 'weekly', 'monthly', 'yearly'].map(type => (
                  <button
                    key={type}
                    className={`recurrence-option ${localPattern.type === type ? 'active' : ''}`}
                    onClick={() => handleRecurrenceTypeChange(type)}
                    type="button"
                  >
                    {type === 'none' ? 'Once' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>

              {/* Weekly Options */}
              {localPattern.type === 'weekly' && (
                <div className="weekly-options">
                  <div style={{ marginBottom: '8px', fontSize: '13px', color: '#666' }}>
                    Select days of the week:
                  </div>
                  <div className="weekdays-grid">
                    {weekdayLabels.map((label, index) => (
                      <button
                        key={index}
                        className={`weekday-option ${localPattern.daysOfWeek.includes(index) ? 'selected' : ''}`}
                        onClick={() => handleWeekdayToggle(index)}
                        type="button"
                      >
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Monthly Options */}
              {localPattern.type === 'monthly' && (
                <div className="monthly-options">
                  <div style={{ marginBottom: '8px', fontSize: '13px', color: '#666' }}>
                    Monthly recurrence type:
                  </div>
                  <div className="monthly-type-options">
                    <button
                      className={`recurrence-option ${(!localPattern.monthlyType || localPattern.monthlyType === 'date') ? 'active' : ''}`}
                      onClick={() => handleMonthlyTypeChange('date')}
                      type="button"
                      style={{ marginBottom: '8px', marginRight: '8px' }}
                    >
                      On day {localStartDate.getDate()}
                    </button>
                    <button
                      className={`recurrence-option ${localPattern.monthlyType === 'weekday' ? 'active' : ''}`}
                      onClick={() => handleMonthlyTypeChange('weekday')}
                      type="button"
                      style={{ marginBottom: '8px' }}
                    >
                      On the {getOrdinalWeek(localStartDate)} {weekdayLabels[localStartDate.getDay()]}
                    </button>
                  </div>
                </div>
              )}

              {/* Interval Control */}
              {localPattern.type !== 'none' && (
                <div className="interval-control">
                  <span className="interval-label">Every</span>
                  <input
                    type="number"
                    className="interval-input"
                    value={localPattern.interval}
                    min="1"
                    max="365"
                    onChange={handleIntervalChange}
                  />
                  <span className="interval-label">
                    {localPattern.type === 'daily' && (localPattern.interval === 1 ? 'day' : 'days')}
                    {localPattern.type === 'weekly' && (localPattern.interval === 1 ? 'week' : 'weeks')}
                    {localPattern.type === 'monthly' && (localPattern.interval === 1 ? 'month' : 'months')}
                    {localPattern.type === 'yearly' && (localPattern.interval === 1 ? 'year' : 'years')}
                  </span>
                </div>
              )}
            </div>

            {/* End Date Section */}
            {localPattern.type !== 'none' && (
              <div className="picker-section">
                <div className="section-title">End Date (Optional)</div>
                <div className="end-date-control">
                  <label className="end-date-checkbox">
                    <input
                      type="checkbox"
                      checked={hasEndDate}
                      onChange={handleEndDateToggle}
                    />
                    <span>Set end date</span>
                  </label>
                  {hasEndDate && (
                    <input
                      type="date"
                      className="end-date-input"
                      value={localPattern.endDate ? localPattern.endDate.toISOString().split('T')[0] : ''}
                      min={localStartDate.toISOString().split('T')[0]}
                      onChange={handleEndDateChange}
                    />
                  )}
                </div>
              </div>
            )}

            {/* Calendar View */}
            {renderCalendar()}

            {/* Preview Section */}
            {previewDates.length > 0 && (
              <div className="picker-section">
                <div className="preview-section">
                  <div className="preview-title">Preview ({previewDates.length} dates)</div>
                  <div className="preview-dates">
                    {previewDates.slice(0, 8).map((date, index) => (
                      <div key={index} className="preview-date">
                        {formatDate(date)}
                      </div>
                    ))}
                    {previewDates.length > 8 && (
                      <div className="preview-summary">
                        ... and {previewDates.length - 8} more dates
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons - Outside of scrollable body */}
          <div className="picker-actions">
            <button
              className="btn btn-secondary"
              onClick={handleReset}
              type="button"
            >
              Reset
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleCancel}
              type="button"
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleApply}
              disabled={!localStartDate}
              type="button"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecurringDatePicker;
