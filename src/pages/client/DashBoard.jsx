import React, { useEffect } from 'react'
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Button,
  VStack,
  HStack,
  Avatar,
  Card,
} from '@chakra-ui/react'
import { useAuth } from '../../providers/AuthProvider'
import { Link } from 'react-router'
import { routeLinks } from '../../routes'
import { BiPlusCircle, BiUser, BiHistory } from 'react-icons/bi'

export default function ClientDashboard() {
  const { userData } = useAuth()

  return (
    <Box p={4} maxW={1200} w='full'>
      {/* Welcome */}
      <Card.Root mb={4} rounded="2xl" shadow="md" bg={{base: "brand.50", _dark: "brand.900"}}>
        <Card.Body>
          <HStack spacing={4}>
            <Avatar.Root w={100} h={100}>
              <Avatar.Fallback name={userData?.fullName} />
              <Avatar.Image src={userData?.photoUrl} />
            </Avatar.Root>
            <VStack align="start" spacing={0}>
              <Heading size="xl">Welcome back, {userData?.fullName?.split(' ')[0]} 👋</Heading>
              <Text fontSize="md" color="gray.400">
                Let’s connect you to the best technician!
              </Text>
            </VStack>
          </HStack>
        </Card.Body>
      </Card.Root>

      Quick Actions
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} gap={4}>
        <ActionCard
          title="Make a New Request"
          icon={<BiPlusCircle size={24} />}
          to={routeLinks.clientRequest}
        />
        <ActionCard
          title="View Technicians"
          icon={<BiUser size={24} />}
          to={routeLinks.technicians}
        />
        <ActionCard
          title="Request History"
          icon={<BiHistory size={24} />}
          to={routeLinks.clientRequest}
        />
      </SimpleGrid>

      {/* Recent Requests Section */}
      <Box mt={8}>
        <Heading size="md" mb={2}>Recent Requests</Heading>
        <Text fontSize="sm" color="gray.500" mb={4}>Here's a look at your most recent service requests</Text>
        {/* Replace with real data later */}
        <VStack spacing={3}>
          <Card.Root w="full" shadow="sm" rounded="xl">
            <Card.Body>
              <Text fontWeight="semibold">AC Installation</Text>
              <Text fontSize="sm" color="gray.500">Requested on: June 10</Text>
            </Card.Body>
          </Card.Root>
          <Card.Root w="full" shadow="sm" rounded="xl">
            <Card.Body>
              <Text fontWeight="semibold">Plumbing Repair</Text>
              <Text fontSize="sm" color="gray.500">Requested on: May 28</Text>
            </Card.Body>
          </Card.Root>
        </VStack>
      </Box>
      
    </Box>
  )
}

const ActionCard = ({ title, icon, to }) => (
  <Card.Root as={Link} to={to} shadow="sm" _hover={{ shadow: 'md' }} transition="all 0.2s" rounded="2xl">
    <Card.Body>
      <VStack spacing={3} py={4} align="center" justify="center">
        <Box color="brand.600">{icon}</Box>
        <Text fontWeight="medium">{title}</Text>
        <Button variant="link" size="sm" colorScheme="teal">Go</Button>
      </VStack>
    </Card.Body>
  </Card.Root>
)
