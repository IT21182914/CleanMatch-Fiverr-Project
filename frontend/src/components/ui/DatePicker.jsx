import { useState, useRef, useEffect } from "react";
import { CalendarDaysIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const DatePicker = ({ name, value, onChange, error, min, required, className = "" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);
    const containerRef = useRef(null);

    const minDate = min ? new Date(min) : new Date();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const formatDate = (date) => {
        if (!date) return "";
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatDateValue = (date) => {
        if (!date) return "";
        return date.toISOString().split('T')[0];
    };

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        const formattedDate = formatDateValue(date);
        onChange({
            target: {
                name,
                value: formattedDate
            }
        });
        setIsOpen(false);
    };

    const navigateMonth = (direction) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + direction);
        setCurrentDate(newDate);
    };

    const generateCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const days = [];
        const current = new Date(startDate);

        for (let i = 0; i < 42; i++) {
            days.push(new Date(current));
            current.setDate(current.getDate() + 1);
        }

        return days;
    };

    const isDateDisabled = (date) => {
        return date < minDate;
    };

    const isDateSelected = (date) => {
        return selectedDate &&
            date.getDate() === selectedDate.getDate() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getFullYear() === selectedDate.getFullYear();
    };

    const isDateToday = (date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const isDateInCurrentMonth = (date) => {
        return date.getMonth() === currentDate.getMonth();
    };

    const days = generateCalendar();
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {/* Input Field */}
            <div
                className={`w-full px-3 py-2 border rounded-lg cursor-pointer flex items-center justify-between ${error
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : "border-gray-300 focus:border-cyan-500 focus:ring-cyan-500"
                    } ${isOpen ? "ring-2 ring-cyan-500 border-cyan-500" : ""}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className={selectedDate ? "text-gray-900" : "text-gray-500"}>
                    {selectedDate ? formatDate(selectedDate) : "Select a date"}
                </span>
                <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
            </div>

            {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
            )}

            {/* Calendar Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    {/* Calendar Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <button
                            type="button"
                            onClick={() => navigateMonth(-1)}
                            className="p-1 hover:bg-gray-100 rounded"
                        >
                            <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
                        </button>

                        <h3 className="text-lg font-semibold text-gray-900">
                            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h3>

                        <button
                            type="button"
                            onClick={() => navigateMonth(1)}
                            className="p-1 hover:bg-gray-100 rounded"
                        >
                            <ChevronRightIcon className="h-5 w-5 text-gray-600" />
                        </button>
                    </div>

                    {/* Calendar Grid */}
                    <div className="p-4">
                        {/* Day Headers */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Days */}
                        <div className="grid grid-cols-7 gap-1">
                            {days.map((date, index) => {
                                const disabled = isDateDisabled(date);
                                const selected = isDateSelected(date);
                                const today = isDateToday(date);
                                const inCurrentMonth = isDateInCurrentMonth(date);

                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => !disabled && handleDateSelect(date)}
                                        disabled={disabled}
                                        className={`
                      w-8 h-8 text-sm rounded-full flex items-center justify-center transition-colors
                      ${disabled
                                                ? "text-gray-300 cursor-not-allowed"
                                                : "cursor-pointer"
                                            }
                      ${!inCurrentMonth && !selected
                                                ? "text-gray-400"
                                                : ""
                                            }
                      ${selected
                                                ? "bg-cyan-500 text-white font-semibold"
                                                : today
                                                    ? "bg-cyan-100 text-cyan-600 font-medium"
                                                    : !disabled
                                                        ? "hover:bg-gray-100 text-gray-900"
                                                        : ""
                                            }
                    `}
                                    >
                                        {date.getDate()}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="border-t border-gray-200 p-3 flex justify-between">
                        <button
                            type="button"
                            onClick={() => {
                                const today = new Date();
                                if (!isDateDisabled(today)) {
                                    handleDateSelect(today);
                                }
                            }}
                            disabled={isDateDisabled(new Date())}
                            className="text-sm text-cyan-600 hover:text-cyan-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                            Today
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="text-sm text-gray-600 hover:text-gray-700"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Hidden input for form submission */}
            <input
                type="hidden"
                name={name}
                value={formatDateValue(selectedDate)}
                required={required}
            />
        </div>
    );
};

export default DatePicker;
