import { serviceIcons } from "./serviceIcons";

export const outdoorServices = [
  {
    id: 12,
    name: "Pool Cleaning",
    memberPrice: "$24/h",
    regularPrice: "$54/h",
    category: "Outdoor",
    icon: serviceIcons.BeakerIcon,
    description:
      "Complete pool and spa cleaning services including water treatment and equipment maintenance.",
    features: [
      "Water chemistry balance",
      "Filter cleaning",
      "Skimming & vacuuming",
      "Equipment check",
    ],
  },
  {
    id: 16,
    name: "Weeds Cutting & Mowing",
    memberPrice: "$24/h",
    regularPrice: "$54/h",
    category: "Outdoor",
    icon: serviceIcons.ScissorsIcon,
    description:
      "Professional landscaping services including weed removal and lawn maintenance.",
    features: [
      "Weed removal",
      "Grass cutting",
      "Edge trimming",
      "Debris cleanup",
    ],
  },
  {
    id: 21,
    name: "Roof and terrace cleaning",
    memberPrice: "$24/h",
    regularPrice: "$54/h",
    category: "Outdoor",
    icon: serviceIcons.HomeIcon,
    description:
      "High-level cleaning services for roofs, terraces, and elevated outdoor spaces.",
    features: [
      "Safety equipment",
      "Weather protection",
      "Drainage cleaning",
      "Surface restoration",
    ],
  },
  {
    id: 24,
    name: "Paving stone cleaning",
    memberPrice: "$22/h",
    regularPrice: "$45/h",
    category: "Outdoor",
    icon: serviceIcons.Squares2X2Icon,
    description:
      "Specialized cleaning and restoration of paving stones, driveways, and walkways.",
    features: [
      "Pressure washing",
      "Stain removal",
      "Sealing service",
      "Restoration",
    ],
  },
];
