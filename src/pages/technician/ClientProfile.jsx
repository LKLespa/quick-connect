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
  Badge,
  Divider,
  Separator,
} from '@chakra-ui/react'
import { doc, getDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { db } from '../../firebase/config'
import { BiPhone, BiChat } from 'react-icons/bi'
import { routeLinks } from '../../routes'
import { Link } from 'react-router'

export default function ClientProfileForTechnician() {
  const { clientId } = useParams()
  const [client, setClient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!clientId) return

    const fetchClient = async () => {
      setLoading(true)
      try {
        const docRef = doc(db, 'users', clientId)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setClient({ id: docSnap.id, ...docSnap.data() })
        } else {
          setError('Client not found')
        }
      } catch (err) {
        setError('Failed to fetch client')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchClient()
  }, [clientId])

  if (loading) return <Center h="full"><Spinner /></Center>
  if (error) return <Center h="full"><Text color="red.500">{error}</Text></Center>
  if (!client) return <Center h="full"><Text>No client data available</Text></Center>

  const techProfile = client.technicianProfile || null

  return (
    <Box maxW={900} w="full" mx="auto" p={6} borderWidth="1px" borderRadius="lg" shadow="md">
      <VStack spacing={6} align="start">
        <HStack spacing={6} align="center" w="full">
          <Avatar.Root shape="rounded" w={{ base: 100, md: 175, lg: 250 }} h={{ base: 150, md: 175, lg: 250 }}>
            <Avatar.Fallback name={client.fullName} />
            <Avatar.Image src={client.photoUrl} />
          </Avatar.Root>
          <VStack align="start" spacing={1}>
            <Heading size="2xl">{client.fullName}</Heading>
            <Badge size="md" colorScheme="blue">Client</Badge>
            <Text fontSize="md" color="gray.600">{client.email}</Text>
            <Text fontSize="md" color="gray.600">{client.phoneNumber}</Text>
          </VStack>
        </HStack>

        {techProfile && (
          <>
            <Separator />
            <Box>
              <Heading size="md" mb={2}>Also a Technician</Heading>
              <VStack align="start" spacing={2}>
                <Badge colorScheme="teal" px={3} py={1} fontSize="md">
                  {techProfile.mainService}
                </Badge>
                <Text fontSize="sm" color="gray.500">
                  {techProfile.localAddress}, {techProfile.city}, {techProfile.region}
                </Text>
              </VStack>
            </Box>
          </>
        )}

        <Separator />

        <HStack spacing={4}>
          {client.phoneNumber && (
            <Button
              as="a"
              href={`tel:${client.phoneNumber}`}
              colorScheme="green"
              leftIcon={<BiPhone />}
            >
              Call
            </Button>
          )}
          <Button
            as={Link}
            to={`${routeLinks.techChats}/${client.id}`}
            variant="outline"
            colorScheme="teal"
            leftIcon={<BiChat />}
          >
            Chat
          </Button>
        </HStack>
      </VStack>
    </Box>
  )
}
