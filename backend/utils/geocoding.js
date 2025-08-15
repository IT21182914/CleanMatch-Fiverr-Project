const axios = require('axios');

/**
 * Geocode an address or zipcode using Google Geocoding API
 * @param {string} address - Address or zipcode to geocode
 * @returns {Promise<{latitude: number, longitude: number}>} - Coordinates
 */
const geocodeAddress = async (address) => {
    try {
        const apiKey = process.env.GOOGLE_GEO_API_KEY;

        if (!apiKey) {
            throw new Error('Google Geocoding API key not configured. Please set GOOGLE_GEO_API_KEY environment variable.');
        }

        const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: address,
                key: apiKey
            },
            timeout: 5000 // 5 second timeout
        });

        if (response.data.status !== 'OK') {
            throw new Error(`Geocoding failed: ${response.data.status} - ${response.data.error_message || 'Unknown error'}`);
        }

        if (!response.data.results || response.data.results.length === 0) {
            throw new Error('No results found for the provided address/zipcode');
        }

        const location = response.data.results[0].geometry.location;

        return {
            latitude: location.lat,
            longitude: location.lng,
            formattedAddress: response.data.results[0].formatted_address,
            addressComponents: response.data.results[0].address_components
        };

    } catch (error) {
        console.error('Geocoding error:', error.message);

        if (error.code === 'ECONNABORTED') {
            throw new Error('Geocoding request timed out. Please try again.');
        }

        if (error.response) {
            throw new Error(`Geocoding API error: ${error.response.status} - ${error.response.statusText}`);
        }

        throw error;
    }
};

/**
 * Validate if a string looks like a zipcode
 * @param {string} input - Input string to validate
 * @returns {boolean} - True if looks like a zipcode
 */
const isZipCode = (input) => {
    if (!input || typeof input !== 'string') return false;

    // US zipcode patterns: 12345 or 12345-6789
    const usZipRegex = /^\d{5}(-\d{4})?$/;

    // Canadian postal code pattern: A1A 1A1 or A1A1A1
    const canadianPostalRegex = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;

    return usZipRegex.test(input.trim()) || canadianPostalRegex.test(input.trim());
};

/**
 * Extract zipcode from various address formats
 * @param {string} address - Address string
 * @returns {string|null} - Extracted zipcode or null
 */
const extractZipCode = (address) => {
    if (!address) return null;

    // Look for US zipcode pattern at the end of address
    const usZipMatch = address.match(/\b\d{5}(-\d{4})?\b$/);
    if (usZipMatch) return usZipMatch[0];

    // Look for Canadian postal code
    const canadianMatch = address.match(/\b[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d\b$/);
    if (canadianMatch) return canadianMatch[0];

    return null;
};

module.exports = {
    geocodeAddress,
    isZipCode,
    extractZipCode
};
