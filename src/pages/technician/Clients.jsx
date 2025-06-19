import {
  Box,
  Text,
  Heading,
  Input,
  SimpleGrid,
  Avatar,
  VStack,
  HStack,
  Tag,
  Button,
  Spinner,
  Center,
  Flex,
} from '@chakra-ui/react';
import { useClients } from '../../providers/ClientProvider';
import { routeLinks } from '../../routes';
import { Link } from 'react-router';

export default function ClientsPage() {
  const { filteredClients, loading, search, setSearch } = useClients();

  return (
    <Box p={4} maxW={1200} w="full">
      <Heading size="md" mb={4}>
        Browse Clients
      </Heading>

      <Flex flexWrap="wrap" justifyContent="space-between" mb={5}>
        <HStack spacing={4}>
          <Input
            placeholder="Search clients by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            maxW="300px"
          />
        </HStack>
      </Flex>

      {loading ? (
        <Center w="full">
          <Spinner size="xl" />
        </Center>
      ) : filteredClients.length === 0 ? (
        <Text>No clients found</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} gap={2}>
          {filteredClients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}

const ClientCard = ({ client }) => {
  return (
    <Box borderWidth="1px" borderRadius="xl" p={4} shadow="sm">
      <HStack spacing={4}>
        <Avatar.Root h={100} w={100}>
          <Avatar.Fallback name={client.fullName} />
          <Avatar.Image src={client.photoUrl} />
        </Avatar.Root>
        <VStack align="start" spacing={1}>
          <Text fontWeight="bold" fontSize="lg">
            {client.fullName}
          </Text>
          <Text fontSize="sm" color="gray.600">
            {client.email}
          </Text>
          <Text fontSize="sm" color="gray.500">
            {client.phoneNumber}
          </Text>
          <HStack>
            <Tag.Root colorScheme="blue">
            <Tag.Label>Client</Tag.Label>
          </Tag.Root>
          {client.technicianProfile && <Tag.Root colorScheme="blue" variant='plain'>
            <Tag.Label>Has Technician Profile</Tag.Label>
          </Tag.Root>}
          </HStack>
        </VStack>
      </HStack>

      <Button
        as={Link}
        to={`${routeLinks.clients}/${client.id}`}
        mt={4}
        colorScheme="teal"
        size="sm"
        width="full"
      >
        View Profile
      </Button>
    </Box>
  );
};
