import React, { createContext, useContext, useReducer } from 'react';

// Initial state
const initialState = {
  selectedDates: [],
  recurrencePattern: {
    type: 'none', // none, daily, weekly, monthly, yearly, custom
    interval: 1,
    endDate: null,
    daysOfWeek: [], // for weekly recurrence
    dayOfMonth: null, // for monthly recurrence
    weekOfMonth: null, // for monthly recurrence (e.g., second Tuesday)
    dayOfWeek: undefined, // for monthly weekday recurrence
    monthlyType: 'date', // 'date' or 'weekday'
    customPattern: null
  },
  startDate: new Date(),
  isPickerOpen: false
};

// Action types
const ActionTypes = {
  SET_START_DATE: 'SET_START_DATE',
  SET_RECURRENCE_PATTERN: 'SET_RECURRENCE_PATTERN',
  SET_SELECTED_DATES: 'SET_SELECTED_DATES',
  ADD_SELECTED_DATE: 'ADD_SELECTED_DATE',
  REMOVE_SELECTED_DATE: 'REMOVE_SELECTED_DATE',
  TOGGLE_PICKER: 'TOGGLE_PICKER',
  RESET_PICKER: 'RESET_PICKER'
};

// Reducer function
const datePickerReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_START_DATE:
      return {
        ...state,
        startDate: action.payload
      };
    
    case ActionTypes.SET_RECURRENCE_PATTERN:
      return {
        ...state,
        recurrencePattern: {
          ...state.recurrencePattern,
          ...action.payload
        }
      };
    
    case ActionTypes.SET_SELECTED_DATES:
      return {
        ...state,
        selectedDates: action.payload
      };
    
    case ActionTypes.ADD_SELECTED_DATE:
      return {
        ...state,
        selectedDates: [...state.selectedDates, action.payload]
      };
    
    case ActionTypes.REMOVE_SELECTED_DATE:
      return {
        ...state,
        selectedDates: state.selectedDates.filter(date => 
          date.getTime() !== action.payload.getTime()
        )
      };
    
    case ActionTypes.TOGGLE_PICKER:
      return {
        ...state,
        isPickerOpen: !state.isPickerOpen
      };
    
    case ActionTypes.RESET_PICKER:
      return initialState;
    
    default:
      return state;
  }
};

// Create context
const DatePickerContext = createContext();

// Provider component
export const DatePickerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(datePickerReducer, initialState);

  // Helper functions
  const setStartDate = (date) => {
    dispatch({ type: ActionTypes.SET_START_DATE, payload: date });
  };

  const setRecurrencePattern = (pattern) => {
    dispatch({ type: ActionTypes.SET_RECURRENCE_PATTERN, payload: pattern });
  };

  const setSelectedDates = (dates) => {
    dispatch({ type: ActionTypes.SET_SELECTED_DATES, payload: dates });
  };

  const addSelectedDate = (date) => {
    dispatch({ type: ActionTypes.ADD_SELECTED_DATE, payload: date });
  };

  const removeSelectedDate = (date) => {
    dispatch({ type: ActionTypes.REMOVE_SELECTED_DATE, payload: date });
  };

  const togglePicker = () => {
    dispatch({ type: ActionTypes.TOGGLE_PICKER });
  };

  const resetPicker = () => {
    dispatch({ type: ActionTypes.RESET_PICKER });
  };

  const value = {
    ...state,
    setStartDate,
    setRecurrencePattern,
    setSelectedDates,
    addSelectedDate,
    removeSelectedDate,
    togglePicker,
    resetPicker
  };

  return (
    <DatePickerContext.Provider value={value}>
      {children}
    </DatePickerContext.Provider>
  );
};

// Custom hook to use the context
export const useDatePicker = () => {
  const context = useContext(DatePickerContext);
  if (!context) {
    throw new Error('useDatePicker must be used within a DatePickerProvider');
  }
  return context;
};

export { ActionTypes };
