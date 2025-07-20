# Recurring Date Picker Component

A powerful, reusable React component for selecting recurring dates, similar to the feature found in the TickTick app. Built with React, Vite, and CSS for a modern, responsive experience.

## 🚀 Features

- **Multiple Recurrence Patterns**: Support for one-time, daily, weekly, monthly, and yearly recurring dates
- **Flexible Weekly Selection**: Choose specific days of the week for weekly recurrence
- **Custom Intervals**: Set custom intervals (every N days/weeks/months/years)
- **End Date Support**: Optional end date for recurring patterns
- **Visual Calendar**: Interactive calendar view with date highlighting
- **Real-time Preview**: See generated dates before applying selection
- **State Management**: Built with React Context API for efficient state handling
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Accessibility**: Keyboard navigation and screen reader support
- **No External Dependencies**: Pure CSS styling without external frameworks

## 🛠️ Technical Requirements

- **Framework**: React 18+
- **Build Tool**: Vite
- **Styling**: Pure CSS (no external CSS frameworks)
- **State Management**: React Context API
- **Browser Support**: Modern browsers (ES6+)

## 📦 Installation

1. Clone or download the project
2. Install dependencies:
   ```bash
   npm install
   ```

## 🚀 Getting Started

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:5173`

## 🎯 Usage

### Basic Implementation

```jsx
import React from 'react';
import { DatePickerProvider } from './context/DatePickerContext';
import RecurringDatePicker from './components/RecurringDatePicker';

function App() {
  const handleDateSelect = (dates, pattern) => {
    console.log('Selected dates:', dates);
    console.log('Recurrence pattern:', pattern);
  };

  return (
    <DatePickerProvider>
      <RecurringDatePicker
        onDateSelect={handleDateSelect}
        placeholder="Select recurring dates..."
      />
    </DatePickerProvider>
  );
}
```

### Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `onDateSelect` | `function` | - | Callback function called when dates are selected |
| `placeholder` | `string` | "Select recurring dates..." | Placeholder text for the picker trigger |

### State Management

The component uses React Context API for state management. The main state includes:

- `selectedDates`: Array of selected Date objects
- `recurrencePattern`: Object containing recurrence configuration
- `startDate`: Starting date for the recurrence
- `isPickerOpen`: Boolean indicating if the picker is open

## 🎨 Customization

### Styling

The component uses CSS modules for styling. You can customize the appearance by modifying the CSS files:

- `src/components/RecurringDatePicker.css`: Main component styles
- `src/index.css`: Global styles and app layout

### Recurrence Patterns

The component supports the following recurrence patterns:

1. **None/Once**: Single date selection
2. **Daily**: Every N days
3. **Weekly**: Every N weeks, with optional specific days of the week
4. **Monthly**: Every N months
5. **Yearly**: Every N years

## 📱 Responsive Design

The component is fully responsive and includes:

- Mobile-optimized touch interactions
- Responsive grid layouts
- Adaptive font sizes and spacing
- Mobile-friendly calendar navigation

## ♿ Accessibility

- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Screen reader compatibility
- High contrast color schemes

## 🔧 Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm run preview`: Preview production build
- `npm run lint`: Run ESLint

## 📁 Project Structure

```
src/
├── components/
│   ├── RecurringDatePicker.jsx    # Main component
│   └── RecurringDatePicker.css    # Component styles
├── context/
│   └── DatePickerContext.jsx     # Context API setup
├── utils/
│   └── dateUtils.js               # Date utility functions
├── App.jsx                        # Main app component
├── App.css                        # App styles
├── main.jsx                       # React entry point
└── index.css                      # Global styles
```

## 🧩 Component Architecture

### Context Layer
- `DatePickerProvider`: Manages global state and actions
- `useDatePicker`: Custom hook for accessing context

### Component Layer
- `RecurringDatePicker`: Main UI component with all features
- Calendar rendering and date selection logic
- Pattern configuration interface

### Utility Layer
- Date calculation functions
- Recurrence pattern generation
- Date formatting utilities

## 🐛 Known Issues

- None currently reported

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Inspired by the TickTick app's recurring date selection feature
- Built with modern React patterns and best practices
- Designed for reusability and customization

---

**Note**: This component is designed to be a complete, production-ready solution for recurring date selection in React applications. It can be easily integrated into existing projects or used as a starting point for custom implementations.
"# Date_Picker" 
