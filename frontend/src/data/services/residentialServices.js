import { serviceIcons } from "./serviceIcons";

export const residentialServices = [
  {
    id: 1,
    name: "Cleaning of the house and apartment",
    memberPrice: "$18/h",
    regularPrice: "$36/h",
    category: "Residential",
    icon: serviceIcons.HomeIcon,
    description:
      "Complete house and apartment cleaning including all rooms, surfaces, and common areas. Perfect for maintaining a spotless living environment.",
    features: [
      "All rooms cleaned",
      "Kitchen & bathroom deep clean",
      "Dusting & vacuuming",
      "Trash removal",
    ],
    popular: true,
  },
  {
    id: 2,
    name: "Deep Cleaning",
    memberPrice: "$22/h",
    regularPrice: "$45/h",
    category: "Residential",
    icon: serviceIcons.SparklesIcon,
    description:
      "Comprehensive deep cleaning service that reaches every corner. Ideal for seasonal cleaning or move-in preparation.",
    features: [
      "Inside appliances",
      "Baseboards & windows",
      "Cabinet interiors",
      "Light fixtures",
    ],
    popular: true,
  },
  {
    id: 7,
    name: "Maid service",
    memberPrice: "$18/h",
    regularPrice: "$36/h",
    category: "Residential",
    icon: serviceIcons.UserGroupIcon,
    description:
      "Regular maid service for ongoing home maintenance and housekeeping needs.",
    features: [
      "Scheduled visits",
      "Consistent quality",
      "Trusted professionals",
      "Flexible scheduling",
    ],
  },
  {
    id: 13,
    name: "Housekeeping Services",
    memberPrice: "$18/h",
    regularPrice: "$36/h",
    category: "Residential",
    icon: serviceIcons.HomeIcon,
    description:
      "Comprehensive housekeeping services for daily, weekly, or monthly home maintenance.",
    features: [
      "Regular maintenance",
      "Laundry service",
      "Organization",
      "Deep cleaning options",
    ],
  },
  {
    id: 22,
    name: "Residential cleaning",
    memberPrice: "$18/h",
    regularPrice: "$36/h",
    category: "Residential",
    icon: serviceIcons.HomeIcon,
    description:
      "Standard residential cleaning services for homes, apartments, and condominiums.",
    features: [
      "All living areas",
      "Kitchen & bathrooms",
      "Bedroom service",
      "Common areas",
    ],
  },
];
