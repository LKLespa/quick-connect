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
  Select,
  Spinner,
  NativeSelect,
  Center,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useDebounce } from '../../hooks/useDebounce' // optional custom hook for smoother search
import { useTechnicians } from '../../providers/TechnicianProvider'

export default function Technicians() {
  const { filteredTechnicians, loading, search, setSearch, filter, setFilter} = useTechnicians();

  return (
    <Box p={4} maxW={1200} w='full'>
      <Heading size="md" mb={4}>Browse Technicians</Heading>

      <HStack mb={4} spacing={4}>
        <Input
          placeholder="Search by name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          maxW="300px"
        />
        <NativeSelect.Root maxW="250px">
          <NativeSelect.Field placeholder="Filter by Service" onChange={e => setFilter(e.target.value)}>
             <option value="Plumber">Plumber</option>
          <option value="Electrician">Electrician</option>
          <option value="AC Repair">AC Repair</option>
          <option value="Carpenter">Carpenter</option>
          {/* Add other services as needed */}
          </NativeSelect.Field>
        </NativeSelect.Root>
      </HStack>

      {loading ? (
       <Center w='full'><Spinner size="xl" /></Center>
      ) : filteredTechnicians.length === 0 ? (
        <Text>No technicians found</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4} gap={2} justifyContent='center'>
          {filteredTechnicians.map(tech => (
            <TechCard key={tech.id} tech={tech} />
          ))}
        </SimpleGrid>
      )}
    </Box>
  )
}

const TechCard = ({ tech }) => {
  const profile = tech.technicianProfile;
  return (
    <Box borderWidth="1px" borderRadius="xl" p={4} shadow="sm">
      <HStack spacing={4}>
        <Avatar.Root h={100} w={100}>
          <Avatar.Fallback name={tech.fullName} />
          <Avatar.Image src={tech.photoUrl} />
        </Avatar.Root>
        <VStack align="start" spacing={1}>
          <Text fontWeight="bold" fontSize="lg">{tech.fullName}</Text>
          <Text fontSize="sm" color="gray.600">{profile?.mainService}</Text>
          <Text fontSize="sm" color="gray.500">{profile?.city}, {profile?.region}</Text>
          <Tag.Root colorScheme={profile?.availability ? 'green' : 'red'}>
            <Tag.Label>
            {profile?.availability ? 'Available' : 'Unavailable'}
          </Tag.Label>
          </Tag.Root>
        </VStack>
      </HStack>

      <Button mt={4} colorScheme="teal" size="sm" width="full">
        View Profile
      </Button>
    </Box>
  )
}
