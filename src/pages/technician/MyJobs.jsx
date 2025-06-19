import {
  Box,
  Text,
  VStack,
  Spinner,
  Center,
  HStack,
  Badge,
  Separator,
  Avatar,
  Button,
} from '@chakra-ui/react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuth } from '../../providers/AuthProvider';
import { db } from '../../firebase/config';
import { formatTimestamp } from '../../utils/time';
import { Link, useLocation } from 'react-router';
import { routeLinks } from '../../routes';
import { BiChat } from 'react-icons/bi';

export default function MyJobs() {
  const { userData } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation()

  const isClient = location.pathname.includes('client');

  useEffect(() => {
    const fetchRequests = async () => {
      if (!userData?.id) return;
      setLoading(true);

      try {
        const isClient = !!userData.clientId;
        const q = query(
          collection(db, 'requests'),
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        console.log('jobs',userData.id, data);
        const filteredJobs = data.filter(req => req.technicianId === userData.id);

        setRequests(filteredJobs);
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [userData?.id, userData?.clientId, userData?.technicianId]);

  if (loading) {
    return (
      <Center h="full">
        <Spinner />
      </Center>
    );
  }

  return (
    <Box maxW={1000} w={'full'} mx="auto" p={6}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        My Jobs
      </Text>

      {requests.length === 0 ? (
        <Text>No requests found.</Text>
      ) : (
        <VStack spacing={4} align="start">
          {requests.map(req => (
            <Box key={req.id} w="full" p={4} borderWidth="1px" borderRadius="md" shadow="sm">
              <HStack justify="space-between">
                <Text fontWeight="bold">{req.title || 'Service Request'}</Text>
                <Badge colorScheme={req.status === 'pending' ? 'yellow' : req.status === 'accepted' ? 'green' : 'gray'}>
                  {req.status || 'pending'}
                </Badge>
              </HStack>
              {req.emmergency && (
                <Badge colorPalette="yellow" mt={2}>
                  Emergency
                </Badge>
              )}
              <Text mt={2}>{req.description || 'No description provided.'}</Text>
              <Text fontSize="sm" color="gray.500" mt={2}>
                Sent on: {formatTimestamp(req.requestedAt)}
              </Text>
              <Separator mt={2} />
              <HStack justifyContent='space-between' alignItems='center'>
                <HStack as={Link} py={5} to={isClient ? `${routeLinks.technicians}/${req.technicianId}` : `${routeLinks.clients}/${req.clientId}`}>
                <Avatar.Root>
                  <Avatar.Fallback name={isClient ? req.technicianName : req.clientName} />
                  <Avatar.Image src={isClient ? req.technicianPhotoUrl : req.clientPhotoUrl} />
                </Avatar.Root>
                <Text fontSize="sm" mt={2}>
                {isClient ? `To Technician: ${req.technicianName}` : `From Client: ${req.clientName}`}
              </Text>
              </HStack>
              <HStack>
                <Button variant='plain' color='red'>Cancel</Button>
                {!isClient && <Button color='green'>Accept</Button>}
                <Button variant='plain' as={Link} py={5} to={isClient ? `/client/chats/${req.technicianId}` : `/technicians/chats/${req.clientId}`}>
                  <BiChat />
                  Chat
                </Button>
              </HStack>
              </HStack>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
}
