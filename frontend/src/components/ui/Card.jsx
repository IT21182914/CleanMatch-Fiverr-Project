import { forwardRef } from "react";
import { cn } from "../../lib/utils";

const Card = forwardRef(
  ({ className, variant = "default", hover = false, ...props }, ref) => {
    const variants = {
      default:
        "rounded-lg border border-gray-200 bg-white text-gray-950 shadow-sm",
      elevated:
        "rounded-lg border border-gray-200 bg-white text-gray-950 shadow-md hover:shadow-lg transition-shadow duration-300",
      outlined:
        "rounded-lg border-2 border-gray-200 bg-white text-gray-950 hover:border-gray-300 transition-colors duration-200",
      primary:
        "rounded-lg border border-cyan-200 bg-cyan-50 text-gray-950 shadow-sm",
      success:
        "rounded-lg border border-green-200 bg-green-50 text-gray-950 shadow-sm",
      warning:
        "rounded-lg border border-orange-200 bg-orange-50 text-gray-950 shadow-sm",
      error:
        "rounded-lg border border-red-200 bg-red-50 text-gray-950 shadow-sm",
      glass:
        "rounded-lg border border-white/20 bg-white/80 backdrop-blur-sm text-gray-950 shadow-lg",
      gradient:
        "rounded-lg border border-gray-200 bg-gradient-to-br from-white to-gray-50 text-gray-950 shadow-sm",
    };

    const hoverClasses = hover
      ? "hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer"
      : "";

    return (
      <div
        ref={ref}
        className={cn(variants[variant], hoverClasses, className)}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

const CardHeader = forwardRef(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "flex flex-col space-y-1.5 p-4 sm:p-6",
      compact: "flex flex-col space-y-1 p-3 sm:p-4",
      spacious: "flex flex-col space-y-2 p-6 sm:p-8",
      centered: "flex flex-col space-y-1.5 p-4 sm:p-6 text-center",
      bordered: "flex flex-col space-y-1.5 p-4 sm:p-6 border-b border-gray-200",
      accent: "flex flex-col space-y-1.5 p-4 sm:p-6 bg-gray-50 rounded-t-lg",
      primary:
        "flex flex-col space-y-1.5 p-4 sm:p-6 bg-cyan-50 rounded-t-lg border-b border-cyan-200",
    };

    return (
      <div ref={ref} className={cn(variants[variant], className)} {...props} />
    );
  }
);
CardHeader.displayName = "CardHeader";

const CardTitle = forwardRef(
  ({ className, size = "default", ...props }, ref) => {
    const sizes = {
      sm: "text-base sm:text-lg font-semibold leading-tight tracking-tight",
      default:
        "text-lg sm:text-xl lg:text-2xl font-semibold leading-tight tracking-tight",
      lg: "text-xl sm:text-2xl lg:text-3xl font-bold leading-tight tracking-tight",
      xl: "text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight tracking-tight",
    };

    return (
      <h3
        ref={ref}
        className={cn(sizes[size], "text-gray-900", className)}
        {...props}
      />
    );
  }
);
CardTitle.displayName = "CardTitle";

const CardDescription = forwardRef(
  ({ className, size = "default", ...props }, ref) => {
    const sizes = {
      sm: "text-xs text-gray-500",
      default: "text-sm text-gray-600",
      lg: "text-base text-gray-600",
    };

    return <p ref={ref} className={cn(sizes[size], className)} {...props} />;
  }
);
CardDescription.displayName = "CardDescription";

const CardContent = forwardRef(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "p-4 sm:p-6 pt-0",
      compact: "p-3 sm:p-4 pt-0",
      spacious: "p-6 sm:p-8 pt-0",
      full: "p-4 sm:p-6",
      flush: "p-0",
      padded: "p-4 sm:p-6",
    };

    return (
      <div ref={ref} className={cn(variants[variant], className)} {...props} />
    );
  }
);
CardContent.displayName = "CardContent";

const CardFooter = forwardRef(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "flex items-center p-4 sm:p-6 pt-0",
      compact: "flex items-center p-3 sm:p-4 pt-0",
      spacious: "flex items-center p-6 sm:p-8 pt-0",
      centered: "flex items-center justify-center p-4 sm:p-6 pt-0",
      between: "flex items-center justify-between p-4 sm:p-6 pt-0",
      bordered: "flex items-center p-4 sm:p-6 pt-0 border-t border-gray-200",
      accent: "flex items-center p-4 sm:p-6 pt-0 bg-gray-50 rounded-b-lg",
      primary:
        "flex items-center p-4 sm:p-6 pt-0 bg-cyan-50 rounded-b-lg border-t border-cyan-200",
    };

    return (
      <div ref={ref} className={cn(variants[variant], className)} {...props} />
    );
  }
);
CardFooter.displayName = "CardFooter";

// Specialized Card Components

const ServiceCard = forwardRef(
  (
    {
      className,
      title,
      description,
      price,
      originalPrice,
      features = [],
      isPopular = false,
      onClick,
      children,
      ...props
    },
    ref
  ) => (
    <Card
      ref={ref}
      variant={isPopular ? "primary" : "elevated"}
      hover={true}
      className={cn(
        "relative overflow-hidden",
        isPopular && "ring-2 ring-cyan-500",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {isPopular && (
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
          <span className="bg-cyan-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
            Most Popular
          </span>
        </div>
      )}

      <CardHeader variant={isPopular ? "primary" : "default"}>
        <CardTitle size="lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        {price && (
          <div className="flex items-baseline mt-2">
            <span className="text-2xl sm:text-3xl font-bold text-gray-900">
              {price}
            </span>
            {originalPrice && (
              <span className="text-lg text-gray-500 line-through ml-2">
                {originalPrice}
              </span>
            )}
          </div>
        )}
      </CardHeader>

      <CardContent>
        {features.length > 0 && (
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <svg
                  className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm text-gray-600">{feature}</span>
              </li>
            ))}
          </ul>
        )}
        {children}
      </CardContent>
    </Card>
  )
);
ServiceCard.displayName = "ServiceCard";

const TestimonialCard = forwardRef(
  (
    {
      className,
      name,
      role,
      content,
      rating = 5,
      verified = false,
      avatar,
      ...props
    },
    ref
  ) => (
    <Card
      ref={ref}
      variant="elevated"
      hover={true}
      className={cn("h-full", className)}
      {...props}
    >
      <CardContent variant="full" className="flex flex-col h-full">
        <div className="flex items-center mb-4">
          <div className="flex mr-2">
            {[...Array(rating)].map((_, i) => (
              <svg
                key={i}
                className="h-5 w-5 text-cyan-400 fill-current"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          {verified && (
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              Verified
            </span>
          )}
        </div>

        <p className="text-gray-700 mb-6 flex-grow italic">"{content}"</p>

        <div className="flex items-center">
          {avatar ? (
            <img
              src={avatar}
              alt={name}
              className="w-10 h-10 rounded-full mr-3"
            />
          ) : (
            <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center mr-3 text-white font-semibold">
              {name.charAt(0)}
            </div>
          )}
          <div>
            <p className="font-semibold text-gray-900">{name}</p>
            <p className="text-sm text-gray-500">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
);
TestimonialCard.displayName = "TestimonialCard";

const PricingCard = forwardRef(
  (
    {
      className,
      planName,
      price,
      period = "month",
      description,
      features = [],
      ctaText = "Get Started",
      isPopular = false,
      onCtaClick,
      ...props
    },
    ref
  ) => (
    <Card
      ref={ref}
      variant={isPopular ? "primary" : "elevated"}
      className={cn(
        "relative overflow-hidden",
        isPopular && "ring-2 ring-cyan-500 scale-105",
        className
      )}
      {...props}
    >
      {isPopular && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
          <span className="bg-cyan-500 text-white px-4 py-2 rounded-b-lg text-sm font-semibold">
            Best Value
          </span>
        </div>
      )}

      <CardHeader
        variant={isPopular ? "primary" : "centered"}
        className={isPopular ? "pt-8" : "pt-6"}
      >
        <CardTitle size="lg">{planName}</CardTitle>
        <div className="flex items-baseline justify-center">
          <span className="text-4xl font-bold text-gray-900">{price}</span>
          <span className="text-lg text-gray-500 ml-2">/{period}</span>
        </div>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardHeader>

      <CardContent>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <svg
                className="h-5 w-5 text-green-500 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter variant="centered">
        <button
          onClick={onCtaClick}
          className={cn(
            "w-full py-3 px-4 rounded-lg font-semibold transition-colors duration-200",
            isPopular
              ? "bg-cyan-500 hover:bg-cyan-600 text-white"
              : "bg-gray-900 hover:bg-gray-800 text-white"
          )}
        >
          {ctaText}
        </button>
      </CardFooter>
    </Card>
  )
);
PricingCard.displayName = "PricingCard";

const StatsCard = forwardRef(
  (
    { className, title, value, change, trend = "up", icon: Icon, ...props },
    ref
  ) => (
    <Card
      ref={ref}
      variant="elevated"
      className={cn("overflow-hidden", className)}
      {...props}
    >
      <CardContent variant="full">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {change && (
              <p
                className={cn(
                  "text-xs flex items-center",
                  trend === "up" ? "text-green-600" : "text-red-600"
                )}
              >
                <svg
                  className={cn(
                    "h-3 w-3 mr-1",
                    trend === "down" && "rotate-180"
                  )}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04L10.75 5.612V16.25A.75.75 0 0110 17z"
                    clipRule="evenodd"
                  />
                </svg>
                {change}
              </p>
            )}
          </div>
          {Icon && (
            <div className="p-3 bg-cyan-100 rounded-lg">
              <Icon className="h-6 w-6 text-cyan-600" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
);
StatsCard.displayName = "StatsCard";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  ServiceCard,
  TestimonialCard,
  PricingCard,
  StatsCard,
};
