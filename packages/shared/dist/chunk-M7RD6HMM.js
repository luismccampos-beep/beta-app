import {
  Button
} from "./chunk-B6RKDGUF.js";
import {
  cn
} from "./chunk-CDRKFMWH.js";

// src/components/admin/DateRangePicker/index.tsx
import { useState, useCallback } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { jsx, jsxs } from "react/jsx-runtime";
var DateRangePicker = ({
  value,
  onChange,
  className,
  placeholder = "Select date range",
  locale = "en-US",
  disabled = false,
  minDate,
  maxDate,
  presets = []
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(/* @__PURE__ */ new Date());
  const [selectingEnd, setSelectingEnd] = useState(false);
  const [tempStart, setTempStart] = useState(null);
  const formatDate = useCallback((date) => {
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(date);
  }, [locale]);
  const formatRange = useCallback((range) => {
    return `${formatDate(range.start)} - ${formatDate(range.end)}`;
  }, [formatDate]);
  const handleDateClick = useCallback((date) => {
    if (disabled) return;
    if (!selectingEnd) {
      setTempStart(date);
      setSelectingEnd(true);
    } else {
      if (tempStart && date >= tempStart) {
        const newRange = { start: tempStart, end: date };
        onChange?.(newRange);
        setTempStart(null);
        setSelectingEnd(false);
        setIsOpen(false);
      } else {
        setTempStart(date);
        setSelectingEnd(true);
      }
    }
  }, [disabled, selectingEnd, tempStart, onChange]);
  const handlePresetClick = useCallback((preset) => {
    if (disabled) return;
    onChange?.(preset.range);
    setIsOpen(false);
  }, [disabled, onChange]);
  const isDateSelected = useCallback((date) => {
    if (!value) return false;
    return date >= value.start && date <= value.end;
  }, [value]);
  const isDateTempSelected = useCallback((date) => {
    if (!tempStart) return false;
    if (selectingEnd) {
      return date >= tempStart && date <= new Date(tempStart.getTime() + 7 * 24 * 60 * 60 * 1e3);
    }
    return date.getTime() === tempStart.getTime();
  }, [tempStart, selectingEnd]);
  const isDateDisabled = useCallback((date) => {
    if (disabled) return true;
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  }, [disabled, minDate, maxDate]);
  const renderCalendar = useCallback(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    const days = [];
    const current = new Date(startDate);
    while (current <= lastDay || current.getDay() !== 0) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    return days;
  }, [currentMonth]);
  const changeMonth = useCallback((direction) => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: cn("relative", className), children: [
    /* @__PURE__ */ jsxs(
      Button,
      {
        variant: "outline",
        onClick: () => setIsOpen(!isOpen),
        disabled,
        className: cn("w-full justify-start text-left font-normal", !value && "text-muted-foreground"),
        children: [
          /* @__PURE__ */ jsx(Calendar, { className: "mr-2 h-4 w-4" }),
          value ? formatRange(value) : placeholder
        ]
      }
    ),
    isOpen && /* @__PURE__ */ jsxs("div", { className: "absolute top-full left-0 z-50 mt-1 bg-popover border rounded-lg shadow-lg p-4 w-96", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: "Select Date Range" }),
        /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: () => setIsOpen(false), children: "\xD7" })
      ] }),
      presets.length > 0 && /* @__PURE__ */ jsxs("div", { className: "mb-4", children: [
        /* @__PURE__ */ jsx("div", { className: "text-sm font-medium mb-2", children: "Quick Select" }),
        /* @__PURE__ */ jsx("div", { className: "grid grid-cols-2 gap-2", children: presets.map((preset, index) => /* @__PURE__ */ jsx(
          Button,
          {
            variant: "outline",
            size: "sm",
            onClick: () => handlePresetClick(preset),
            className: "text-xs",
            children: preset.label
          },
          index
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-4", children: [
        /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: () => changeMonth(-1), children: /* @__PURE__ */ jsx(ChevronLeft, { className: "h-4 w-4" }) }),
        /* @__PURE__ */ jsx("div", { className: "font-medium", children: currentMonth.toLocaleDateString(locale, { month: "long", year: "numeric" }) }),
        /* @__PURE__ */ jsx(Button, { variant: "ghost", size: "sm", onClick: () => changeMonth(1), children: /* @__PURE__ */ jsx(ChevronRight, { className: "h-4 w-4" }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-7 gap-1 text-center", children: [
        ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => /* @__PURE__ */ jsx("div", { className: "text-xs font-medium text-muted-foreground py-2", children: day }, day)),
        renderCalendar().map((date, index) => {
          const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
          const isSelected = isDateSelected(date);
          const isTempSelected = isDateTempSelected(date);
          const isDisabled = isDateDisabled(date);
          const isToday = date.toDateString() === (/* @__PURE__ */ new Date()).toDateString();
          return /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => handleDateClick(date),
              disabled: isDisabled,
              className: cn(
                "h-8 w-8 text-sm rounded-md transition-colors",
                !isCurrentMonth && "text-muted-foreground",
                isToday && "bg-primary/10",
                isSelected && "bg-primary text-primary-foreground",
                isTempSelected && "bg-primary/20",
                isDisabled && "opacity-50 cursor-not-allowed",
                !isDisabled && "hover:bg-muted"
              ),
              children: date.getDate()
            },
            index
          );
        })
      ] }),
      selectingEnd && tempStart && /* @__PURE__ */ jsxs("div", { className: "mt-4 text-sm text-muted-foreground", children: [
        "Select end date (starting from ",
        formatDate(tempStart),
        ")"
      ] })
    ] })
  ] });
};
var DateRangePicker_default = DateRangePicker;

export {
  DateRangePicker,
  DateRangePicker_default
};
//# sourceMappingURL=chunk-M7RD6HMM.js.map