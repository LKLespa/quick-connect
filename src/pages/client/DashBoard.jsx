import React from 'react';
import { Box, Heading, Text, SimpleGrid, Button } from '@chakra-ui/react';

const ClientDashboard = ({ user }) => {
  return (
    <Box>
      <Heading size="lg" mb={2}>Welcome, {user.fullName ?? 'Client'} 👋</Heading>
      <Text color="gray.500" mb={6}>
        Here’s what you can do today.
      </Text>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <Button size="lg" variant="outline">Find Technicians</Button>
        <Button size="lg" variant="outline">My Requests</Button>
      </SimpleGrid>
    </Box>
  );
};

export default ClientDashboard;
