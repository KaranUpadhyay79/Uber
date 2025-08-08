
const axios = require('axios');
const captainModel = require('../models/captain.model');

module.exports.getAddressCoordinate = async (address) => {
    const mapboxApiKey = process.env.MAPBOX_API; // use a new env variable
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxApiKey}`;

    // console.log("📍 Mapbox Requesting coordinates for:", address);
    // console.log("🔗 Request URL:", url);

    try {
        const response = await axios.get(url);
        // console.log("📦 Mapbox Geocode Response:", response.data);

        if (response.data && response.data.features && response.data.features.length > 0) {
            const [lng, lat] = response.data.features[0].center;
            return { lat, lng };
            
        } else {
            throw new Error('Coordinates not found');
        }
    } catch (error) {
        console.error('❌ Mapbox Geocoding API Error:', error.response?.data || error.message);
        throw error;
    }
};


module.exports.getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new Error('Origin and destination are required');
    }

    const mapboxApiKey = process.env.MAPBOX_API;

    try {
        // Geocode origin and destination
        const originRes = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(origin)}.json?access_token=${mapboxApiKey}`);
        const destRes = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(destination)}.json?access_token=${mapboxApiKey}`);

        if (!originRes.data.features.length || !destRes.data.features.length) {
            throw new Error('Could not geocode origin or destination');
        }

        const [originLng, originLat] = originRes.data.features[0].center;
        const [destLng, destLat] = destRes.data.features[0].center;

        // Get directions
        const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${originLng},${originLat};${destLng},${destLat}?access_token=${mapboxApiKey}&overview=false`;
        const directionsRes = await axios.get(directionsUrl);

        if (directionsRes.data.routes && directionsRes.data.routes.length > 0) {
            const route = directionsRes.data.routes[0];
            const distanceInMeters = route.distance;
            const durationInSeconds = route.duration;

            return {
                distance: {
                    text: formatDistance(distanceInMeters),
                    value: distanceInMeters
                },
                duration: {
                    text: formatDuration(durationInSeconds),
                    value: durationInSeconds
                },
                status: "OK"
            };
        } else {
            throw new Error('No route found between origin and destination');
        }

    } catch (err) {
        console.error('❌ Mapbox Directions API Error:', err.response?.data || err.message);
        throw err;
    }
};

// Format distance like "1,421 km"
function formatDistance(meters) {
    const km = meters / 1000;
    return km.toLocaleString('en-IN', { maximumFractionDigits: 0 }) + ' km';
}

// Format duration like "1 day 3 hours" or "2 hours 15 mins"
function formatDuration(seconds) {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    let parts = [];
    if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
    if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
    if (minutes > 0 && days === 0) parts.push(`${minutes} min${minutes > 1 ? 's' : ''}`);

    return parts.join(' ');
}


const MAPBOX_TOKEN = process.env.MAPBOX_API; // apna token env me rakho

module.exports.getAutoCompleteSuggestions = async (input) => {
    try {
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(input)}.json`;
        
        const response = await axios.get(url, {
            params: {
                access_token: MAPBOX_TOKEN,
                autocomplete: true,
                limit: 5,
                country: 'IN' // optional: sirf India results ke liye
            }
        });

        const suggestions = response.data.features.map(feature => {
            const placeName = feature.place_name;
            const parts = placeName.split(',').map(p => p.trim());

            // Terms array banana
            let offset = 0;
            const terms = parts.map(part => {
                const term = { offset, value: part };
                offset += part.length + 2; // +2 for ", "
                return term;
            });

            return {
                description: feature.place_name,
                place_id: feature.id,
                reference: feature.id,
                structured_formatting: {
                    main_text: parts[0],
                    secondary_text: parts.slice(1).join(', ')
                },
                terms,
                matched_substrings: [
                    {
                        length: input.length,
                        offset: 0
                    }
                ],
                types: [feature.place_type[0]] // jaise locality, address, etc.
            };
        });

        return { suggestions };
    } catch (error) {
        console.error('Error fetching autocomplete suggestions:', error.message);
        throw new Error('Failed to fetch location suggestions');
    }
};


module.exports.getCaptainsInTheRadius = async (lat, lng, radius) => {
    // radius in kilometers; MongoDB requires radius in radians
    const captains = await captainModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [[lat, lng], radius / 6371]
            }
        }
    });

    return captains;
};


