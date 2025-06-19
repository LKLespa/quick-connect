// src/pages/technician/ProfilePage.jsx

import {
  Box,
  VStack,
  HStack,
  Avatar,
  Text,
  Heading,
  Tag,
  Button,
  Center,
  Spinner,
  Flex,
  Separator,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { useNavigate } from 'react-router';
import { fetchAddressFromCoords } from '../../utils/geo-location';
import { FaLocationArrow } from 'react-icons/fa';
import { formatTimestamp } from '../../utils/time';
import DialogWidget from '../../components/widgets/DialogWidget';
import UserMapView from '../../components/UserMapView';
import { BiUserPlus } from 'react-icons/bi';
import { routeLinks } from '../../routes';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { toaster } from '../../components/ui/toaster';
import { v4 as uuidv4 } from 'uuid';

export default function TechnicianProfilePage() {
  const { userData, loading, userLocation } = useAuth();
  const [address, setAddress] = useState(null);
  const [openMap, setOpenMap] = useState(false);
  const [working, setWorking] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getAddress = async () => {
      const add = await fetchAddressFromCoords(userLocation.latitude, userLocation.longitude);
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

  const setClientProfile = async () => {
    setWorking(false);
    try {
          const userRef = doc(db, "users", userData.id);
    
            await updateDoc(userRef, {
                clientId: userData.clientId ?? uuidv4(),
            });
            toaster.create({title: "You are now a technician", type: 'success', duration: 2000});
    } catch(err) {
      toaster.create({title: "An Error Ocurred", type: 'error', duration: 2000});
    } finally {
      setWorking(false)
    }
  }

  const techProfile = userData.technicianProfile || {};
  const hasClientId = !!userData.clientId;
  const hasLocation = !!address?.region || !!address?.city;
  const joinedDate = userData.createdAt?.toDate?.() || new Date();

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
            <Tag.Root size="xl" colorScheme="green">
              <Tag.Label>Technician</Tag.Label>
            </Tag.Root>
            <Text fontSize="lg" color="gray.600">{techProfile.mainService}</Text>
            <HStack>
              <Text fontSize="md" color="gray.600">
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
          <Heading size="md" mb={2}>Contact Info</Heading>
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
            loading={working}
            onClick={() => {
              if (hasClientId) {
                navigate(routeLinks.clientHome);
              } else {
                setClientProfile();
              }
            }}
          >
            {hasClientId ? 'Switch to Client' : 'Become a Client'}
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
}
