import { useState, useEffect } from "react";
import {
    MagnifyingGlassIcon,
    AdjustmentsHorizontalIcon,
    SparklesIcon,
    EyeIcon,
    StarIcon,
    InformationCircleIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import {
    Card,
    CardContent,
} from "../ui/Card";
import Button from "../ui/Button";
import { LoadingGrid } from "../ui/Loading";
import { formatCurrency } from "../../lib/utils";
import { getServiceImage } from "../../utils/serviceImages";
import LazyImage from "../ui/LazyImage";

const ServiceSearch = ({
    services,
    loading,
    serviceError,
    onServiceSelect,
    onRetry,
}) => {
    const [filteredServices, setFilteredServices] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [servicesPerPage] = useState(12); // Show 12 services per page

    // Filter services based on search and category
    useEffect(() => {
        let filtered = services;

        if (searchTerm) {
            filtered = filtered.filter(service =>
                service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                service.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (selectedCategory !== "all") {
            filtered = filtered.filter(service =>
                service.category?.toLowerCase() === selectedCategory.toLowerCase()
            );
        }

        setFilteredServices(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    }, [services, searchTerm, selectedCategory]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredServices.length / servicesPerPage);
    const startIndex = (currentPage - 1) * servicesPerPage;
    const endIndex = startIndex + servicesPerPage;
    const currentServices = filteredServices.slice(startIndex, endIndex);

    // Pagination handlers
    const handlePageChange = (page) => {
        setCurrentPage(page);
        // Scroll to top of services grid
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            handlePageChange(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            handlePageChange(currentPage + 1);
        }
    };

    // Get unique categories for filtering
    const categories = [...new Set(services.map(service => service.category).filter(Boolean))];

    // Clear all filters
    const clearFilters = () => {
        setSearchTerm("");
        setSelectedCategory("all");
        setCurrentPage(1);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-left">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                    Choose Your Cleaning Service
                </h2>
                <p className="text-sm text-gray-600 max-w-2xl">
                    Browse our professional cleaning services and book with ease
                </p>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search Input */}
                    <div className="flex-1 relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search services..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <XMarkIcon className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* Category Filter */}
                    <div className="relative">
                        <AdjustmentsHorizontalIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white"
                        >
                            <option value="all">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                    {/* Clear Filters Button */}
                    {(searchTerm || selectedCategory !== "all") && (
                        <Button
                            variant="outline"
                            onClick={clearFilters}
                            className="flex items-center whitespace-nowrap"
                        >
                            <XMarkIcon className="h-4 w-4 mr-1" />
                            Clear Filters
                        </Button>
                    )}
                </div>

                {/* Search Results Counter */}
                {!loading && (
                    <div className="mt-3 text-sm text-gray-600">
                        {filteredServices.length === services.length ? (
                            `Showing all ${services.length} services`
                        ) : (
                            `Found ${filteredServices.length} service${filteredServices.length !== 1 ? 's' : ''} ${
                                searchTerm ? `matching "${searchTerm}"` : ''
                            } ${selectedCategory !== 'all' ? `in ${selectedCategory}` : ''}`
                        )}
                        {filteredServices.length > servicesPerPage && (
                            ` • Page ${currentPage} of ${totalPages}`
                        )}
                    </div>
                )}
            </div>

            {/* Services Grid */}
            {loading ? (
                <LoadingGrid count={6} />
            ) : serviceError ? (
                <div className="text-center py-12">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                        <InformationCircleIcon className="h-8 w-8 text-red-500 mx-auto mb-4" />
                        <p className="text-red-600 mb-4">{serviceError}</p>
                        <Button onClick={onRetry} variant="outline">
                            Try Again
                        </Button>
                    </div>
                </div>
            ) : filteredServices.length === 0 ? (
                <div className="text-center py-12">
                    <SparklesIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
                    <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentServices.map((service) => (
                            <Card
                                key={service.id}
                                className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
                                onClick={() => onServiceSelect(service)}
                            >
                                {/* Service Image */}
                                <div className="relative h-48 overflow-hidden">
                                    <LazyImage
                                        src={getServiceImage(service.name)}
                                        alt={service.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        fallbackSrc="/services/1/House & Apartment Cleaning.png"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                    <div className="absolute bottom-4 left-4 right-4">
                                        {service.category && (
                                            <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded">
                                                {service.category}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Service Details */}
                                <CardContent className="p-4">
                                    <span className="text-black font-semibold text-shadow-2xs mb-1">
                                        {service.name}
                                    </span>
                                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                        {service.description}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-2xl font-bold text-cyan-600">
                                                {formatCurrency(service.base_price || service.basePrice || service.price)}
                                            </span>
                                            {/* <span className="text-gray-500 text-sm ml-1">starting</span> */}
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <Button size="xs" variant="outline">
                                                <EyeIcon className="h-4 w-4 mr-1" />
                                                View Details
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Rating Display (if available) */}
                                    {service.rating && (
                                        <div className="flex items-center mt-2">
                                            <div className="flex items-center">
                                                {[...Array(5)].map((_, i) => (
                                                    <StarIcon
                                                        key={i}
                                                        className={`h-4 w-4 ${i < Math.floor(service.rating)
                                                            ? "text-yellow-400 fill-current"
                                                            : "text-gray-300"
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm text-gray-600 ml-2">
                                                {service.rating} ({service.review_count || 0} reviews)
                                            </span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center space-x-2 mt-8">
                            <Button
                                variant="outline"
                                onClick={handlePreviousPage}
                                disabled={currentPage === 1}
                                className="flex items-center"
                            >
                                <ChevronLeftIcon className="h-4 w-4 mr-1" />
                                Previous
                            </Button>

                            <div className="flex items-center space-x-1">
                                {/* Page numbers */}
                                {[...Array(totalPages)].map((_, index) => {
                                    const page = index + 1;
                                    const isCurrentPage = page === currentPage;
                                    const shouldShow = 
                                        page === 1 || 
                                        page === totalPages || 
                                        (page >= currentPage - 1 && page <= currentPage + 1);

                                    if (!shouldShow) {
                                        if (page === currentPage - 2 || page === currentPage + 2) {
                                            return <span key={page} className="px-2 text-gray-400">...</span>;
                                        }
                                        return null;
                                    }

                                    return (
                                        <Button
                                            key={page}
                                            variant={isCurrentPage ? "primary" : "outline"}
                                            onClick={() => handlePageChange(page)}
                                            className="w-10 h-10 p-0"
                                        >
                                            {page}
                                        </Button>
                                    );
                                })}
                            </div>

                            <Button
                                variant="outline"
                                onClick={handleNextPage}
                                disabled={currentPage === totalPages}
                                className="flex items-center"
                            >
                                Next
                                <ChevronRightIcon className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ServiceSearch;
