type Coordinates = {
    longitude: number;
    latitude: number;
};

type GeolocationOptions = {
    enableHighAccuracy?: boolean;
    timeout?: number;
    maximumAge?: number;
};

// Utility function to get geolocation
export const getUserLocation = (options: GeolocationOptions = {}): Promise<Coordinates> => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported by your browser"));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                console.log("Successfully retrieved coordinates:");
                console.log(`Latitude: ${latitude}`);
                console.log(`Longitude: ${longitude}`);

                // Return the coordinates in the correct format (longitude first)
                resolve({ longitude, latitude });
            },
            (err) => {
                console.warn(`ERROR(${err.code}): ${err.message}`);
                reject(err);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
                ...options,
            }
        );
    });
};
