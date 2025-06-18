import {
    Box,
    VStack,
    HStack,
    Avatar,
    Text,
    Heading,
    Tag,
    Badge,
    Button,
    Divider,
    Stack,
    Separator,
    Center,
    Spinner,
    Flex,
} from '@chakra-ui/react'
import { doc, getDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { BiPhoneCall, BiMailSend, BiPhone, BiChat } from 'react-icons/bi'
import { Link, useParams } from 'react-router'
import { db } from '../../firebase/config'
import { renderStars } from '../../utils/rating'
import { routeLinks } from '../../routes'

export default function TechnicianProfile() {
    const { technicianId } = useParams()
    const [technician, setTechnician] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (!technicianId) return

        const fetchTechnician = async () => {
            setLoading(true)
            try {
                const docRef = doc(db, 'users', technicianId)
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    setTechnician({ id: docSnap.id, ...docSnap.data() })
                } else {
                    setError('Technician not found')
                }
            } catch (err) {
                setError('Failed to fetch technician')
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        fetchTechnician()
    }, [technicianId])

    if (loading) return <Center h='full'><Spinner /></Center>
    if (error) return <Center h='full'><Text color="red.500">{error}</Text></Center>
    if (!technician) return <Center h='full'><Text>No technician data available</Text></Center>

    const profile = technician.technicianProfile || {}

    const avgRating = profile.rating || 4.2
    const reviews = profile.reviews || [
        { id: 1, reviewer: 'Jane Doe', rating: 5, comment: 'Super reliable and professional!' },
        { id: 2, reviewer: 'John Smith', rating: 4, comment: 'Did a great job, would recommend.' },
    ]

    return (
        <Box maxW={1200} w={1200} mx="auto" p={6} borderWidth="1px" borderRadius="lg" shadow="md">
            <VStack spacing={6} align="start">
                <HStack spacing={4} align="start" w="full">
                    <Avatar.Root shape='rounded' w={{ base: 100, md: 175, lg: 250 }} h={{ base: 150, md: 175, lg: 250 }}>
                        <Avatar.Fallback name={technician.fullName} />
                        <Avatar.Image src={technician.photoUrl} />
                    </Avatar.Root>
                    <VStack align="start" spacing={1} flex="1">
                        <Heading size="3xl">{technician.fullName}</Heading>
                        <Tag.Root size='xl' colorScheme={profile.availability ? 'green' : 'red'}>
                            <Tag.Label>{profile.availability ? 'Available' : 'Unavailable'}</Tag.Label>
                        </Tag.Root>
                        <Text fontSize="lg" color="gray.600">
                            {profile.localAddress}, {profile.city}, {profile.region}
                        </Text>
                        <Box>
                            <Heading size="md" mb={2}>Rating</Heading>
                            {avgRating === 0 ? <Text>Not Rated</Text> : <HStack spacing={1} fontSize="xl">
                                {renderStars(avgRating)}
                                <Text ml={2} fontWeight="bold" fontSize="md">{avgRating.toFixed(1)} / 5</Text>
                            </HStack>}
                        </Box>
                    </VStack>
                </HStack>

                <Separator />

                <Box w="full">
                    <Heading size="md" mb={2}>
                        Services
                    </Heading>
                    <Flex gap={4}>
                        <Badge colorScheme="teal" variant="solid" size='lg' fontSize="lg" px={4} py={2}>
                            {profile.mainService}
                        </Badge>
                        {(profile.services || []).map((service, idx) => (
                            <Badge
                                key={idx}
                                colorScheme="blue"
                                variant="outline"
                                size='lg' fontSize="lg"
                                px={4} py={2}
                            >
                                {service}
                            </Badge>
                        ))}
                    </Flex>
                </Box>

                <Separator />

                <Box w="full">
                    <Heading size="md" mb={2}>
                        About
                    </Heading>
                    <Text fontSize="sm" color="gray.700" whiteSpace="pre-line">
                        {profile.about || 'No additional information provided.'}
                    </Text>
                </Box>

                <Separator />

                <Box>
                    <Heading size="md" mb={2}>Reviews</Heading>
                    <VStack
                        maxH="180px"
                        spacing={4}
                        overflowY="auto"
                        pr={2}
                        border="1px solid"
                        borderColor="gray.200"
                        borderRadius="md"
                        p={3}
                    >
                        {reviews.length === 0 && <Text>No reviews yet</Text>}
                        {reviews.map(({ id, reviewer, rating, comment }) => (
                            <Box key={id} w="full" borderBottom="1px solid" borderColor="gray.100" pb={2}>
                                <HStack justify="space-between" mb={1}>
                                    <Text fontWeight="bold">{reviewer}</Text>
                                    <HStack spacing={1} fontSize="md" color="#ffc107">
                                        {renderStars(rating)}
                                    </HStack>
                                </HStack>
                                <Text fontSize="sm" color="gray.600">{comment}</Text>
                            </Box>
                        ))}
                    </VStack>
                </Box>

                <Separator />

                <HStack spacing={4} w="full" justify="start">
                    <Button
                        leftIcon={<BiPhoneCall />}
                        colorScheme="green"
                        variant="solid"
                        as={Link}
                        href={`tel:${technician.phoneNumber}`}
                        isDisabled={!technician.phoneNumber}
                    >
                        <BiPhone />
                        Call
                    </Button>
                    <Button
                        colorScheme="green"
                        size="lg"
                        onClick={() => alert('Request service clicked!')}
                    >
                        Request Service
                    </Button>
                    <Button
                       as={Link}
                        to={`${routeLinks.clientChats}/${technician.id}`}
                        colorScheme="blue"
                        variant="outline"
                        size="lg"
                    >
                        <BiChat />
                        Chat
                    </Button>
                </HStack>
            </VStack>
        </Box>
    )
}
