import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  accuracy?: number;
}

interface LocationError {
  code: number;
  message: string;
}

export const useLocation = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<LocationError | null>(null);
  const { toast } = useToast();

  const getCurrentLocation = async (): Promise<LocationData | null> => {
    if (!navigator.geolocation) {
      const error = {
        code: 0,
        message: 'Geolocation is not supported by this browser'
      };
      setError(error);
      toast({
        title: "Location Not Supported",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    setIsLoading(true);
    setError(null);

    return new Promise((resolve) => {
      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude, accuracy } = position.coords;
          
          const locationData: LocationData = {
            latitude,
            longitude,
            accuracy
          };

          try {
            // Reverse geocoding to get address
            const address = await reverseGeocode(latitude, longitude);
            locationData.address = address;
          } catch (geocodeError) {
            console.warn('Reverse geocoding failed:', geocodeError);
          }

          setLocation(locationData);
          setIsLoading(false);
          
          toast({
            title: "Location Detected",
            description: locationData.address || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          });

          resolve(locationData);
        },
        (positionError) => {
          const error: LocationError = {
            code: positionError.code,
            message: getLocationErrorMessage(positionError.code)
          };
          
          setError(error);
          setIsLoading(false);
          
          toast({
            title: "Location Error",
            description: error.message,
            variant: "destructive",
          });

          resolve(null);
        },
        options
      );
    });
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      // Using a free geocoding service (OpenStreetMap Nominatim)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding service unavailable');
      }

      const data = await response.json();
      
      if (data.display_name) {
        return data.display_name;
      } else {
        throw new Error('Address not found');
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      throw error;
    }
  };

  const getLocationErrorMessage = (code: number): string => {
    switch (code) {
      case 1:
        return 'Location access denied by user. Please enable location permissions.';
      case 2:
        return 'Location information is unavailable. Please check your GPS/network.';
      case 3:
        return 'Location request timed out. Please try again.';
      default:
        return 'An unknown error occurred while getting location.';
    }
  };

  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        
        if (permission.state === 'granted') {
          return true;
        } else if (permission.state === 'prompt') {
          // User will be prompted when getCurrentLocation is called
          return true;
        } else {
          toast({
            title: "Location Permission Denied",
            description: "Please enable location access in your browser settings to use this feature.",
            variant: "destructive",
          });
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error('Permission check failed:', error);
      return true; // Fallback to trying anyway
    }
  };

  const clearLocation = () => {
    setLocation(null);
    setError(null);
  };

  // Auto-detect location on mount if permission is already granted
  useEffect(() => {
    const checkInitialLocation = async () => {
      if ('permissions' in navigator) {
        try {
          const permission = await navigator.permissions.query({ name: 'geolocation' });
          if (permission.state === 'granted') {
            getCurrentLocation();
          }
        } catch (error) {
          console.log('Permission check not supported');
        }
      }
    };

    checkInitialLocation();
  }, []);

  return {
    location,
    isLoading,
    error,
    getCurrentLocation,
    requestLocationPermission,
    clearLocation
  };
};