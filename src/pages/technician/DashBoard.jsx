import React, { useEffect } from 'react';
import { Box, Heading, Text, SimpleGrid, Button, Spinner } from '@chakra-ui/react';
import { useAuth } from '../../providers/AuthProvider';
import { useNavigate } from 'react-router';

const TechnicianDashboard = ({ user }) => {
  const { userData, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading) {
      if (userData?.role === "technician" && !userData?.technicianProfile) {
        navigate("/setup");
      }
    }
  })

  if (loading) {
    return <Spinner />
  }

  return (
    <Box>
      <Heading size="lg" mb={2}>Welcome, {userData?.fullName ?? 'Technician'} 🛠️</Heading>
      <Text color="gray.500" mb={6}>
        Your service dashboard
      </Text>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <Button size="lg" variant="outline">View Jobs</Button>
        <Button size="lg" variant="outline">My Profile</Button>
      </SimpleGrid>
    </Box>
  );
};

export default TechnicianDashboard;
