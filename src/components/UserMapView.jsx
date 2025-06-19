// src/components/UserMapView.jsx

import { Box } from '@chakra-ui/react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { FaMapMarkerAlt } from 'react-icons/fa';
import L from 'leaflet';
import { OrangeMarker } from '../assets';

// Use a custom icon for the user
const userIcon = new L.Icon({
  iconUrl: OrangeMarker, // Example user marker
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  className: 'user-marker',
});

export default function UserMapView({ location, fullName = "User Location" }) {
  if (!location?.latitude || !location?.longitude) {
    return <Box>No location data available</Box>;
  }

  return (
    <Box w="full" h={{ base: '300px', md: '500px' }} borderRadius="md" overflow="hidden" shadow="md">
      <MapContainer
        center={[location.latitude, location.longitude]}
        zoom={13}
        style={{ width: '100%', height: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <Marker position={[location.latitude, location.longitude]} icon={userIcon}>
          <Popup>
            <strong>{fullName}</strong><br />
            Current Location
          </Popup>
        </Marker>
      </MapContainer>
    </Box>
  );
}
