import { forwardRef } from "react";
import { cn } from "../../lib/utils";

// Responsive Grid Component
export const ResponsiveGrid = forwardRef(
  (
    {
      className,
      cols = { sm: 1, md: 2, lg: 3 },
      gap = "4",
      children,
      ...props
    },
    ref
  ) => {
    const gridClasses = cn(
      "grid",
      `grid-cols-${cols.sm || 1}`,
      cols.md && `md:grid-cols-${cols.md}`,
      cols.lg && `lg:grid-cols-${cols.lg}`,
      cols.xl && `xl:grid-cols-${cols.xl}`,
      `gap-${gap}`,
      className
    );

    return (
      <div ref={ref} className={gridClasses} {...props}>
        {children}
      </div>
    );
  }
);

ResponsiveGrid.displayName = "ResponsiveGrid";

// Responsive Stack Component (vertical layout that becomes horizontal on larger screens)
export const ResponsiveStack = forwardRef(
  (
    {
      className,
      direction = "vertical", // "vertical" | "horizontal" | "responsive"
      spacing = "4",
      align = "stretch", // "start" | "center" | "end" | "stretch"
      justify = "start", // "start" | "center" | "end" | "between" | "around"
      children,
      ...props
    },
    ref
  ) => {
    const getFlexDirection = () => {
      if (direction === "responsive") return "flex-col sm:flex-row";
      if (direction === "horizontal") return "flex-row";
      return "flex-col";
    };

    const getAlignItems = () => {
      const alignMap = {
        start: "items-start",
        center: "items-center",
        end: "items-end",
        stretch: "items-stretch",
      };
      return alignMap[align] || "items-stretch";
    };

    const getJustifyContent = () => {
      const justifyMap = {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
        between: "justify-between",
        around: "justify-around",
      };
      return justifyMap[justify] || "justify-start";
    };

    const getSpacing = () => {
      if (direction === "responsive") {
        return `space-y-${spacing} sm:space-y-0 sm:space-x-${spacing}`;
      }
      if (direction === "horizontal") {
        return `space-x-${spacing}`;
      }
      return `space-y-${spacing}`;
    };

    const stackClasses = cn(
      "flex",
      getFlexDirection(),
      getAlignItems(),
      getJustifyContent(),
      getSpacing(),
      className
    );

    return (
      <div ref={ref} className={stackClasses} {...props}>
        {children}
      </div>
    );
  }
);

ResponsiveStack.displayName = "ResponsiveStack";

// Responsive Container Component
export const ResponsiveContainer = forwardRef(
  (
    {
      className,
      size = "default", // "xs" | "sm" | "default" | "lg" | "xl" | "full"
      padding = "responsive", // "none" | "sm" | "md" | "lg" | "responsive"
      children,
      ...props
    },
    ref
  ) => {
    const getSizeClasses = () => {
      const sizeMap = {
        xs: "max-w-xs",
        sm: "max-w-2xl",
        default: "max-w-7xl",
        lg: "max-w-screen-lg",
        xl: "max-w-screen-xl",
        full: "max-w-full",
      };
      return sizeMap[size] || "max-w-7xl";
    };

    const getPaddingClasses = () => {
      const paddingMap = {
        none: "",
        sm: "px-2 sm:px-4",
        md: "px-4 sm:px-6",
        lg: "px-6 sm:px-8",
        responsive: "px-4 sm:px-6 lg:px-8",
      };
      return paddingMap[padding] || "px-4 sm:px-6 lg:px-8";
    };

    const containerClasses = cn(
      "mx-auto w-full",
      getSizeClasses(),
      getPaddingClasses(),
      className
    );

    return (
      <div ref={ref} className={containerClasses} {...props}>
        {children}
      </div>
    );
  }
);

ResponsiveContainer.displayName = "ResponsiveContainer";

// Responsive Text Component
export const ResponsiveText = forwardRef(
  (
    {
      className,
      size = "base", // "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl"
      weight = "normal", // "light" | "normal" | "medium" | "semibold" | "bold"
      as = "p",
      children,
      ...props
    },
    ref
  ) => {
    const getSizeClasses = () => {
      const sizeMap = {
        xs: "text-xs sm:text-sm",
        sm: "text-sm sm:text-base",
        base: "text-base sm:text-lg",
        lg: "text-lg sm:text-xl",
        xl: "text-xl sm:text-2xl",
        "2xl": "text-xl sm:text-2xl lg:text-3xl",
        "3xl": "text-2xl sm:text-3xl lg:text-4xl xl:text-5xl",
      };
      return sizeMap[size] || "text-base sm:text-lg";
    };

    const getWeightClasses = () => {
      const weightMap = {
        light: "font-light",
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
      };
      return weightMap[weight] || "font-normal";
    };

    const textClasses = cn(getSizeClasses(), getWeightClasses(), className);

    const Component = as;

    return (
      <Component ref={ref} className={textClasses} {...props}>
        {children}
      </Component>
    );
  }
);

ResponsiveText.displayName = "ResponsiveText";

export default {
  ResponsiveGrid,
  ResponsiveStack,
  ResponsiveContainer,
  ResponsiveText,
};
