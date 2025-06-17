import React from 'react';
import { useNavigate } from 'react-router';
import { Box, Spinner, Center } from '@chakra-ui/react';
import ClientDashBoard from './client/DashBoard';
import TechnicianDashBoard from './technician/DashBoard';
import { useAuth } from '../providers/AuthProvider';
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
    navigate('/signin');
    return null;
  }

  return (
    <Box px={{ base: 4, md: 10 }} py={6}>
      {userData.role === 'client' && <ClientDashBoard user={userData} />}
      {userData.role === 'technician' && <TechnicianDashBoard user={userData} />}
    </Box>
  );
};

export default Dashboard;
