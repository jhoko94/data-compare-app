import React, { useState, forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { X } from "lucide-react"; // Import ikon X dari lucide-react

const CustomInput = forwardRef(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ({ value, onClick, onClear }: any, ref: React.Ref<HTMLInputElement>) => (
      <div className="relative w-full">
        <input
          value={value}
          onClick={onClick}
          ref={ref}
          className="py-2 px-3 w-full md:w-80 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Pilih Rentang Tanggal"
          readOnly
        />
        {value && (
          <X
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400 cursor-pointer"
            onClick={onClear}
          />
        )}
      </div>
    )
);  

const DateRangePicker = ({ onDateChange }: { onDateChange: (startDate: Date | null, endDate: Date | null) => void }) => {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
  
    const handleDateChange = (dates: [Date | null, Date | null] | null) => {
      const [start, end] = dates || [null, null];
      setStartDate(start);
      setEndDate(end);
      
      // Trigger the onDateChange callback when dates are updated
      onDateChange(start, end);
    };
  
    return (
      <DatePicker
        selected={startDate}
        onChange={handleDateChange}
        startDate={startDate}
        endDate={endDate}
        selectsRange
        customInput={
          <CustomInput
            onClear={() => {
              setStartDate(null);
              setEndDate(null);
              onDateChange(null, null); // Ensure callback is triggered with null values
            }}
          />
        }
      />
    );
};  

export default DateRangePicker;