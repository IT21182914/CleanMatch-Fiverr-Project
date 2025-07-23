import { residentialServices } from "./residentialServices";
import { commercialServices } from "./commercialServices";
import { specializedServices } from "./specializedServices";
import { healthSafetyServices } from "./healthSafetyServices";
import { luxuryServices } from "./luxuryServices";
import { outdoorServices } from "./outdoorServices";
import { otherServices } from "./otherServices";

// Combine all services into a single array
export const allServices = [
  ...residentialServices,
  ...commercialServices,
  ...specializedServices,
  ...healthSafetyServices,
  ...luxuryServices,
  ...outdoorServices,
  ...otherServices,
];

// Export individual service categories for easier access
export {
  residentialServices,
  commercialServices,
  specializedServices,
  healthSafetyServices,
  luxuryServices,
  outdoorServices,
  otherServices,
};

// Helper function to get services by category
export const getServicesByCategory = (category) => {
  if (category === "All Services") {
    return allServices;
  }
  return allServices.filter((service) => service.category === category);
};

// Helper function to search services
export const searchServices = (searchTerm, category = "All Services") => {
  const categoryServices = getServicesByCategory(category);
  if (!searchTerm) return categoryServices;

  return categoryServices.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.features.some((feature) =>
        feature.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );
};
