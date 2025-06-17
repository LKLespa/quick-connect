import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Box, Text } from '@chakra-ui/react';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTechnicians } from '../providers/TechnicianProvider';
import { BlueMarker, OrangeMarker } from '../assets';
import { useAuth } from '../providers/AuthProvider';

const techIcon = new Icon({
  iconUrl: BlueMarker,
  iconSize: [30, 35],
  iconAnchor: [12, 41],
});

const userIcon = new Icon({
  iconUrl: OrangeMarker,
  iconSize: [40, 60],
  iconAnchor: [12, 41],
  popupAnchor: [0, -40],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function TechnicianMap() {
  const { filteredTechnicians } = useTechnicians();
  const { userLocation } = useAuth();

  console.log('logg', userLocation)

  return (
    <Box w="full" h="600px" borderRadius="xl" overflow="hidden">
      <MapContainer
        center={userLocation ? [userLocation.latitude, userLocation.longitude] : [5.9631, 10.1591]} // default to somewhere in Cameroon
        zoom={10}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {userLocation && (
          <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userIcon}>
            <Popup>You are here</Popup>
          </Marker>
        )}

        {filteredTechnicians.map((tech) => {
          const loc = tech.technicianProfile?.location;
          return loc ? (
            <Marker
              key={tech.id}
              position={[loc.latitude, loc.longitude]}
              icon={techIcon}
            >
              <Popup>
                <Text fontWeight="bold">{tech.fullName}</Text>
                <Text fontSize="sm">{tech.technicianProfile?.mainService}</Text>
                <Text fontSize="sm">
                  {tech.technicianProfile?.city}, {tech.technicianProfile?.region}
                </Text>
              </Popup>
            </Marker>
          ) : null;
        })}
      </MapContainer>
    </Box>
  );
}
