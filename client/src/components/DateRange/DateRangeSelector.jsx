import React, { useState, useEffect } from 'react';
import { CalendarIcon, ChevronDown } from 'lucide-react';
import { format, subMonths, subYears, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

// Shadcn-inspired components
const Button = ({ children, variant = 'default', size = 'default', className = '', ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F97316] disabled:pointer-events-none disabled:opacity-50';
  
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    outline: 'border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-slate-50',
    link: 'text-primary underline-offset-4 hover:underline',
  };
  
  const sizes = {
    default: 'h-9 px-4 py-2',
    sm: 'h-8 rounded-md px-3 text-xs',
    lg: 'h-10 rounded-md px-8',
    icon: 'h-9 w-9',
  };
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Popover = ({ trigger, content, open, setOpen }) => {
  return (
    <div className="relative">
      <div onClick={() => setOpen(!open)}>
        {trigger}
      </div>
      {open && (
        <div className="absolute z-50 mt-2 min-w-[200px] w-auto max-w-[200px] rounded-md border border-slate-200 bg-white p-2 shadow-md animate-in fade-in-80">
          {content}
        </div>
      )}
    </div>
  );
};

const Calendar = ({ selectedStartDate, selectedEndDate, onRangeSelect }) => {
  return (
    <div className="p-2">
      <div className="space-y-3">
        <div className="grid gap-3">
          <div className="flex flex-col">
            <div className="text-xs font-medium text-slate-500 mb-1">Start Date</div>
            <input 
              type="date" 
              className="p-1.5 border border-slate-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#F97316] focus:border-[#F97316]"
              value={format(selectedStartDate, 'yyyy-MM-dd')}
              onChange={(e) => onRangeSelect([new Date(e.target.value), selectedEndDate])}
            />
          </div>
          <div className="flex flex-col">
            <div className="text-xs font-medium text-slate-500 mb-1">End Date</div>
            <input 
              type="date" 
              className="p-1.5 border border-slate-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#F97316] focus:border-[#F97316]"
              value={format(selectedEndDate, 'yyyy-MM-dd')}
              onChange={(e) => onRangeSelect([selectedStartDate, new Date(e.target.value)])}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const DateRangeSelector = ({ onDateRangeChange }) => {
  const [open, setOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState('last_30_days');
  const [customRange, setCustomRange] = useState([new Date(), new Date()]);
  
  const ranges = {
    last_30_days: {
      label: 'Last 30 Days',
      getRange: () => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 30);
        return [start, end];
      }
    },
    last_month: {
      label: 'Last Month',
      getRange: () => {
        const today = new Date();
        const lastMonth = subMonths(today, 1);
        return [startOfMonth(lastMonth), endOfMonth(lastMonth)];
      }
    },
    last_3_months: {
      label: 'Last 3 Months',
      getRange: () => {
        const end = new Date();
        const start = subMonths(end, 3);
        return [start, end];
      }
    },
    last_6_months: {
      label: 'Last 6 Months',
      getRange: () => {
        const end = new Date();
        const start = subMonths(end, 6);
        return [start, end];
      }
    },
    last_year: {
      label: 'Last Year',
      getRange: () => {
        const today = new Date();
        const lastYear = subYears(today, 1);
        return [startOfYear(lastYear), endOfYear(lastYear)];
      }
    },
    custom: {
      label: 'Custom Range',
      getRange: () => customRange
    }
  };

  useEffect(() => {
    // Initialize with default range (last 30 days)
    handleRangeChange('last_30_days');
  }, []);

  const handleRangeChange = (rangeKey) => {
    setSelectedRange(rangeKey);
    const [start, end] = ranges[rangeKey].getRange();
    
    if (onDateRangeChange) {
      onDateRangeChange({
        start_date: format(start, 'yyyy-MM-dd'),
        end_date: format(end, 'yyyy-MM-dd'),
        range_type: rangeKey
      });
    }
    
    if (rangeKey !== 'custom') {
      setOpen(false);
    }
  };

  const handleCustomRangeSelect = (dateRange) => {
    setCustomRange(dateRange);
    setSelectedRange('custom');
    
    if (onDateRangeChange) {
      onDateRangeChange({
        start_date: format(dateRange[0], 'yyyy-MM-dd'),
        end_date: format(dateRange[1], 'yyyy-MM-dd'),
        range_type: 'custom'
      });
    }
  };

  const getDisplayText = () => {
    if (selectedRange === 'custom') {
      return `${format(customRange[0], 'MMM d, yyyy')} - ${format(customRange[1], 'MMM d, yyyy')}`;
    }
    return ranges[selectedRange].label;
  };

  return (
    <div className="flex items-center">
      <Popover
        open={open}
        setOpen={setOpen}
        trigger={
          <Button
            variant="outline"
            className="w-full min-w-[180px] max-w-full justify-between text-left font-normal text-sm"
          >
            <div className="flex items-center gap-2 truncate">
              <CalendarIcon className="h-4 w-4 text-slate-500 flex-shrink-0" />
              <span className="truncate">{getDisplayText()}</span>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0 ml-2" />
          </Button>
        }
        content={
          <div className="space-y-1">
            {Object.keys(ranges).map((rangeKey) => (
              rangeKey !== 'custom' ? (
                <div
                  key={rangeKey}
                  className={`cursor-pointer rounded px-3 py-1.5 text-sm transition-colors ${
                    selectedRange === rangeKey 
                      ? 'bg-slate-100 text-slate-900 font-medium' 
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                  onClick={() => handleRangeChange(rangeKey)}
                >
                  {ranges[rangeKey].label}
                </div>
              ) : null
            ))}
            <div className="border-t border-slate-100 my-1"></div>
            <div
              className={`cursor-pointer rounded px-3 py-1.5 text-sm transition-colors ${
                selectedRange === 'custom' 
                  ? 'bg-slate-100 text-slate-900 font-medium' 
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
              onClick={() => setSelectedRange('custom')}
            >
              Custom Range
            </div>
            {selectedRange === 'custom' && (
              <Calendar
                selectedStartDate={customRange[0]}
                selectedEndDate={customRange[1]}
                onRangeSelect={handleCustomRangeSelect}
              />
            )}
          </div>
        }
      />
    </div>
  );
};

export default DateRangeSelector;
