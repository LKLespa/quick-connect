import {
  Box, Heading, VStack, HStack, Avatar, Text, Spinner, LinkBox, LinkOverlay,
  Center
} from '@chakra-ui/react'
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { db } from '../../firebase/config'
import { useAuth } from '../../providers/AuthProvider'
import { formatTimestamp } from '../../utils/time'

export default function AllChats() {
  const { userData } = useAuth()
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchChats = async () => {
      if (!userData?.id || !userData?.role) return

      setLoading(true)
      try {
        const q = query(
          collection(db, 'chats'),
          where(userData.role === 'client' ? 'clientId' : 'technicianId', '==', userData.id)
        )
        const snapshot = await getDocs(q)
        const chatList = await Promise.all(snapshot.docs.map(async docSnap => {
          const chatData = docSnap.data()
          const otherId = userData.role === 'client' ? chatData.technicianId : chatData.clientId
          const userSnap = await getDoc(doc(db, 'users', otherId))
          const userInfo = userSnap.exists() ? userSnap.data() : {}
          return {
            id: docSnap.id,
            ...chatData,
            otherUser: {
              id: otherId,
              name: userInfo.fullName || 'Unknown User',
              photoUrl: userInfo.photoUrl || '',
            }
          }
        }))
        setChats(chatList)
      } catch (err) {
        console.error('Failed to fetch chats:', err)
        setError('Failed to load chats')
      } finally {
        setLoading(false)
      }
    }

    fetchChats()
  }, [userData])

  if (loading) return <Center h='full' p={4}><Spinner /></Center>
  if (error) return <Center h='full' p={4}><Text color="red.500">{error}</Text></Center>

  return (
    <Box p={4} w='full' maxW={1000}>
      <Heading size="md" mb={4}>Your Chats</Heading>
      <VStack gap={4} align="stretch">
        {chats.length === 0 && (
          <Text color="gray.500">No chats yet.</Text>
        )}
        {chats.map(chat => (
          <LinkBox
            key={chat.id}
            as="article"
            p={3}
            borderWidth="1px"
            borderRadius="lg"
            _hover={{ bg: 'gray.50' }}
          >
            <HStack gap={4} w='full'>
              <Avatar.Root size='2xl'>
                <Avatar.Fallback name={chat.otherUser.name} />
                <Avatar.Image src={chat.otherUser.photoUrl} />
              </Avatar.Root>
              <Box flex="1">
                <LinkOverlay
                  as={Link}
                  to={
                    userData.role === 'client'
                      ? `/client/chats/${chat.technicianId}`
                      : `/technician/chats/${chat.clientId}`
                  }
                >
                  <Text fontWeight="medium" fontSize='lg'>{chat.otherUser.name}</Text>
                </LinkOverlay>
                <HStack justifyContent='space-between'>
                  <Text fontSize="sm" color="brand.600" noOfLines={1}>
                  {chat.lastMessage.text || 'No message yet'}
                </Text>
                <Text fontSize="sm" color="gray.600" noOfLines={1}>
                  {formatTimestamp(chat.lastMessage.timestamp || null)}
                </Text>
                </HStack>
              </Box>
            </HStack>
          </LinkBox>
        ))}
      </VStack>
    </Box>
  )
}
