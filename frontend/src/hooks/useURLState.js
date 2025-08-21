import { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Custom hook to synchronize state with URL search parameters
 * @param {string} key - The URL parameter key
 * @param {*} defaultValue - Default value when URL parameter is not present
 * @param {function} serialize - Function to convert value to string for URL
 * @param {function} deserialize - Function to convert string from URL to value
 * @returns {[value, setValue]} - Current value and setter function
 */
export const useURLState = (key, defaultValue, serialize = String, deserialize = String) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const getValue = useCallback(() => {
        const paramValue = searchParams.get(key);
        if (paramValue === null) return defaultValue;
        try {
            return deserialize(paramValue);
        } catch (error) {
            console.warn(`Failed to deserialize URL parameter ${key}:`, error);
            return defaultValue;
        }
    }, [searchParams, key, defaultValue, deserialize]);

    const [value, setValue] = useState(getValue);

    const setURLValue = useCallback((newValue) => {
        setValue(newValue);
        const params = new URLSearchParams(searchParams);

        if (newValue === defaultValue || newValue === null || newValue === undefined || newValue === '') {
            params.delete(key);
        } else {
            try {
                params.set(key, serialize(newValue));
            } catch (error) {
                console.warn(`Failed to serialize value for URL parameter ${key}:`, error);
                params.delete(key);
            }
        }

        setSearchParams(params, { replace: true });
    }, [searchParams, setSearchParams, key, defaultValue, serialize]);

    return [getValue(), setURLValue];
};

/**
 * Hook specifically for form data synchronization with URL
 */
export const useFormURLState = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const getFormDataFromURL = useCallback(() => {
        return {
            scheduledDate: searchParams.get('date') || "",
            scheduledTime: searchParams.get('time') || "",
            address: searchParams.get('address') || "",
            city: searchParams.get('city') || "",
            state: searchParams.get('state') || "",
            zipCode: searchParams.get('zipCode') || "",
            specialInstructions: searchParams.get('instructions') || "",
            latitude: searchParams.get('lat') ? parseFloat(searchParams.get('lat')) : null,
            longitude: searchParams.get('lng') ? parseFloat(searchParams.get('lng')) : null,
            locationMethod: searchParams.get('locationMethod') || "gps",
        };
    }, [searchParams]);

    const updateFormDataInURL = useCallback((formData) => {
        const params = new URLSearchParams(searchParams);

        // Helper function to set or delete parameter
        const setOrDelete = (key, value) => {
            if (value && value !== "" && value !== null && value !== undefined) {
                params.set(key, value.toString());
            } else {
                params.delete(key);
            }
        };

        setOrDelete('date', formData.scheduledDate);
        setOrDelete('time', formData.scheduledTime);
        setOrDelete('address', formData.address);
        setOrDelete('city', formData.city);
        setOrDelete('state', formData.state);
        setOrDelete('zipCode', formData.zipCode);
        setOrDelete('instructions', formData.specialInstructions);
        setOrDelete('lat', formData.latitude);
        setOrDelete('lng', formData.longitude);
        setOrDelete('locationMethod', formData.locationMethod);

        setSearchParams(params, { replace: true });
    }, [searchParams, setSearchParams]);

    return {
        getFormDataFromURL,
        updateFormDataInURL
    };
};
