import { serviceIcons } from "./serviceIcons";

export const luxuryServices = [
  {
    id: 14,
    name: "Private Jet & Aircraft Cleaning",
    memberPrice: "$42/h",
    regularPrice: "$75/h",
    category: "Luxury",
    icon: serviceIcons.CommandLineIcon,
    description:
      "Specialized aircraft cleaning services meeting aviation industry standards and luxury expectations.",
    features: [
      "Interior detailing",
      "Exterior washing",
      "Safety compliance",
      "Luxury finishes",
    ],
    premium: true,
  },
  {
    id: 15,
    name: "Yacht and Ship Cleaning",
    memberPrice: "$32/h",
    regularPrice: "$65/h",
    category: "Luxury",
    icon: serviceIcons.CloudIcon,
    description:
      "Marine vessel cleaning services for yachts, boats, and ships with specialized marine products.",
    features: [
      "Deck cleaning",
      "Interior cabins",
      "Marine-safe products",
      "Hull maintenance",
    ],
    premium: true,
  },
  {
    id: 29,
    name: "Luxury Villa cleaning and maintenance",
    memberPrice: "$24/h",
    regularPrice: "$54/h",
    category: "Luxury",
    icon: serviceIcons.HomeIcon,
    description:
      "Premium cleaning services for luxury villas with white-glove attention to detail.",
    features: [
      "White-glove service",
      "Luxury standards",
      "Privacy protection",
      "Concierge cleaning",
    ],
    premium: true,
  },
];
