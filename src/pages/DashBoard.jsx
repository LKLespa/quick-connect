import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Box, Spinner, Center } from '@chakra-ui/react';
import { useAuth } from '../providers/AuthProvider';
import { routeLinks } from '../routes';

const Dashboard = () => {
  const { userData, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!userData) {
      navigate(routeLinks.signIn);
    } else if (userData.clientId) {
      navigate(routeLinks.clientHome);
    } else if (userData.technicianId) {
      navigate(routeLinks.techHome);
    }
  }, [userData, loading, navigate]);

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="lg" />
      </Center>
    );
  }

  return (
    <Box px={{ base: 4, md: 10 }} py={6}>
      Redirecting...
    </Box>
  );
};

export default Dashboard;
