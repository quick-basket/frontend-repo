import React, {useEffect, useRef, useState} from 'react';
import {MapContainer, TileLayer, Marker, useMapEvents, useMap} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, {LatLngExpression, LatLngLiteral, LatLngTuple} from 'leaflet';

// Fix Leaflet's default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProps {
    location: LatLngTuple;
    onLocationChange: (location: LatLngTuple) => void;
}

const LocationMarker: React.FC<MapProps> = ({ location, onLocationChange }) => {
    const map = useMapEvents({
        click(e) {
            onLocationChange([e.latlng.lat, e.latlng.lng]);
        },
    });

    useEffect(() => {
        map.flyTo(location, map.getZoom());
    }, [location, map]);

    return <Marker position={location} />;
};

const LocationMap: React.FC<MapProps> = ({ location, onLocationChange }) => {
    return (
        <MapContainer center={location} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <LocationMarker location={location} onLocationChange={onLocationChange} />
        </MapContainer>
    );
};

export default LocationMap;