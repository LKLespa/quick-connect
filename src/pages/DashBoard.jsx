import React from 'react';
import { useNavigate } from 'react-router';
import { Box, Spinner, Center } from '@chakra-ui/react';
import ClientDashBoard from './client/DashBoard';
import TechnicianDashBoard from './technician/DashBoard';
import { useAuth } from '../providers/AuthProvider';
import { routeLinks } from '../routes';
// import { useAuth } from '../../provider/AuthProvider';


const Dashboard = () => {
  const { userData, loading } = useAuth();
  const user = { role: 'technician' };

  const navigate = useNavigate();

  if (loading) {
    return (
      <Center h="100vh">
        <Spinner size="lg" />
      </Center>
    );
  }

  if (!userData) {
    navigate(routeLinks.signIn);
    return null;
  }

  if(userData.role === 'client'){
    navigate(routeLinks.clientHome)
    return null;
  }

    if(userData.role === 'technician'){
    navigate(routeLinks.techHome)
    return null;
  }

  return (
    <Box px={{ base: 4, md: 10 }} py={6}>
      Empty
    </Box>
  );
};

export default Dashboard;
