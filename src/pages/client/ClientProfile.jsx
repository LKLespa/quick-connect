// src/pages/client/ProfilePage.jsx

import {
  Box,
  VStack,
  HStack,
  Avatar,
  Text,
  Heading,
  Tag,
  Button,
  Separator,
  Center,
  Spinner,
  Flex,
  Link,
} from '@chakra-ui/react';
import { BiPhoneCall, BiMailSend, BiUserPlus } from 'react-icons/bi';
import { useNavigate } from 'react-router';
import { useAuth } from '../../providers/AuthProvider';
import { routeLinks } from '../../routes';
import { useEffect, useState } from 'react';
import { fetchAddressFromCoords } from '../../utils/geo-location';
import { FaLocationArrow } from 'react-icons/fa';
import { formatTimestamp } from '../../utils/time';
import DialogWidget from '../../components/widgets/DialogWidget';
import UserMapView from '../../components/UserMapView';

export default function ClientProfilePage() {
  const { userData, loading, userLocation } = useAuth();
  const [address, setAddress] = useState(null);
  const [openMap, setOpenMap] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getAddress = async () => {
      const add = await fetchAddressFromCoords(userLocation.latitude, userLocation.longitude);
      console.log('Address', add);
      setAddress(add);
    };

    if (userLocation) {
      getAddress();
    }
  }, [userLocation]);

  if (loading || !userData) {
    return (
      <Center h="full">
        <Spinner />
      </Center>
    );
  }

  const hasTechnicianProfile = !!userData.technicianId && !!userData.technicianProfile;
  const hasLocation = !!address?.region || !!address?.city;

  const joinedDate = userData.createdAt?.toDate?.() || new Date(); // fallback to now if missing

  return (
    <Box maxW={1200} w={1200} mx="auto" p={6} borderWidth="1px" borderRadius="lg" shadow="md">
      <VStack spacing={6} align="start">
        <HStack spacing={4} align="start" w="full">
          <Avatar.Root shape="rounded" w={{ base: 100, md: 175, lg: 250 }} h={{ base: 150, md: 175, lg: 250 }}>
            <Avatar.Fallback name={userData.fullName} />
            <Avatar.Image src={userData.photoUrl} />
          </Avatar.Root>
          <VStack align="start" spacing={1} flex="1">
            <Heading size="3xl">{userData.fullName}</Heading>
            <Tag.Root size="xl" colorScheme="blue">
              <Tag.Label>Client</Tag.Label>
            </Tag.Root>
            <HStack>
              <Text fontSize="lg" color="gray.600">
                {hasLocation ? `${address?.region}, ${address?.city}, ${address?.locality}` : 'No location info'}
              </Text>
              {address && (
                <Button variant="plain" size="sm" onClick={() => setOpenMap(true)}>
                  <FaLocationArrow /> View Location
                </Button>
              )}
            </HStack>
          </VStack>
        </HStack>

        <Separator />

        <DialogWidget open={openMap} setOpen={setOpenMap} size='cover' title='My Location'>
          <UserMapView location={userLocation} fullName={'My Location'} />
        </DialogWidget>

        <Box w="full">
          <Heading size="md" mb={2}>
            Contact Info
          </Heading>
          <VStack align="start" spacing={2}>
            <Text><strong>Email:</strong> {userData.email || 'Not provided'}</Text>
            <Text><strong>Phone:</strong> {userData.phoneNumber || 'Not provided'}</Text>
            <Text><strong>Joined:</strong> {formatTimestamp(joinedDate)}</Text>
          </VStack>
        </Box>

        <Separator />

        <Flex w="full" justify="start">
          <Button
            leftIcon={<BiUserPlus />}
            colorScheme="purple"
            variant="solid"
            size="lg"
            onClick={() => {
              if (hasTechnicianProfile) {
                navigate(routeLinks.techHome);
              } else {
                navigate(routeLinks.setup);
              }
            }}
          >
            {hasTechnicianProfile ? 'Switch to Technician' : 'Become a Technician'}
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
}
