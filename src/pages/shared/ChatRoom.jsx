import {
  Box, VStack, Text, Spinner, Center, Input, HStack,
  IconButton, Flex, Avatar, AvatarBadge, AvatarGroup
} from '@chakra-ui/react'
import {
  collection, query, where, getDocs, orderBy,
  onSnapshot, addDoc, serverTimestamp, doc, setDoc, getDoc,
  updateDoc
} from 'firebase/firestore'
import { useParams, useLocation } from 'react-router'
import { useAuth } from '../../providers/AuthProvider'
import { useEffect, useState, useRef } from 'react'
import { db } from '../../firebase/config'
import { FiSend } from 'react-icons/fi'

export default function ChatRoom() {
  const { userData } = useAuth()
  const { pathname } = useLocation()
  const isClient = pathname.startsWith('/client')
  const { technicianId, clientId } = useParams()

  const [chat, setChat] = useState(null)
  const [chatLoading, setChatLoading] = useState(true)
  const [error, setError] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [targetUser, setTargetUser] = useState(null)
  const bottomRef = useRef(null)

  const targetId = isClient ? technicianId : clientId

  const chatQueryRef = async () => {
    const chatsRef = collection(db, 'chats')
    const q = query(
      chatsRef,
      where('clientId', '==', isClient ? userData.id : targetId),
      where('technicianId', '==', isClient ? targetId : userData.id)
    )
    const snapshot = await getDocs(q)
    return snapshot
  }

  // Fetch Chat & User
  useEffect(() => {
    const fetchChatAndUser = async () => {
      setChatLoading(true)
      try {
        const snapshot = await chatQueryRef()
        let currentChat = null

        if (!snapshot.empty) {
          const chatDoc = snapshot.docs[0]
          currentChat = { id: chatDoc.id, ...chatDoc.data() }
          setChat(currentChat)
        } else {
          setChat(null)
        }

        // Fetch the user info of the chat partner
        const targetRef = doc(db, 'users', targetId)
        const targetSnap = await getDoc(targetRef)
        if (targetSnap.exists()) {
          setTargetUser({ id: targetSnap.id, ...targetSnap.data() })
        }
      } catch (err) {
        console.error('Error fetching chat or user:', err)
        setError('Something went wrong')
      } finally {
        setChatLoading(false)
      }
    }

    if (targetId && userData?.id) fetchChatAndUser()
  }, [targetId, userData?.id, isClient])

  // Fetch messages
  useEffect(() => {
    if (!chat?.id) return
    const messagesRef = collection(db, 'chats', chat.id, 'messages')
    const q = query(messagesRef, orderBy('timestamp', 'asc'))

    const unsubscribe = onSnapshot(q, snapshot => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setMessages(msgs)
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    })

    return () => unsubscribe()
  }, [chat?.id])

  const handleSend = async () => {
    if (!newMessage.trim()) return
    try {
      let currentChat = chat

      if (!currentChat) {
        const newChatRef = doc(collection(db, 'chats'))
        await setDoc(newChatRef, {
          clientId: isClient ? userData.id : targetId,
          technicianId: isClient ? targetId : userData.id,
          createdAt: serverTimestamp(),
        })
        currentChat = { id: newChatRef.id, clientId: isClient ? userData.id : targetId, technicianId: isClient ? targetId : userData.id }
        setChat(currentChat)
      }

      const messagesRef = collection(db, 'chats', currentChat.id, 'messages')
      await addDoc(messagesRef, {
        text: newMessage.trim(),
        senderId: userData.id,
        timestamp: serverTimestamp()
      })
      setNewMessage('')

      const lastMessageRef = doc(db, "chats", currentChat.id);
      await updateDoc(lastMessageRef, {
        lastMessage: {
          text: newMessage.trim(),
          timestamp: serverTimestamp()
        }
      })
    } catch (err) {
      console.error('Failed to send message:', err)
    }
  }

  if (chatLoading) return <Center h="full"><Spinner /></Center>
  if (error) return <Center h="full"><Text color="red.500">{error}</Text></Center>

  return (
    <Flex direction="column" h="full" w='full' maxW={1200} mx="auto" p={4}>
      {/* Header */}
      <HStack spacing={3} mb={4} w='full' justifyContent='start'>
        <Avatar.Root>
          <Avatar.Fallback name={targetUser?.fullName} />
          <Avatar.Image src={targetUser?.photoUrl} />
        </Avatar.Root>
        <VStack align="start" spacing={0}>
          <Text fontWeight="bold">{targetUser?.fullName || 'Loading...'}</Text>
          <Text fontSize="sm" color="gray.500">
            {isClient ? 'Technician' : 'Client'}
          </Text>
        </VStack>
      </HStack>

      {/* Messages */}
      <VStack spacing={2} align="stretch" flex="1" overflowY="auto">
        {messages.length > 0 ? messages.map(msg => (
          <Box
            key={msg.id}
            alignSelf={msg.senderId === userData.id ? 'flex-end' : 'flex-start'}
            bg={msg.senderId === userData.id ? 'blue.500' : 'gray.100'}
            color={msg.senderId === userData.id ? 'white' : 'black'}
            px={4}
            py={2}
            borderRadius="md"
            maxW="80%"
          >
            <Text fontSize="sm">{msg.text}</Text>
          </Box>
        )) : (
          <Center h="full" color="gray.400" fontStyle="italic">
            No messages yet
          </Center>
        )}
        <div ref={bottomRef} />
      </VStack>

      {/* Input */}
      <HStack mt={4} w='full' maxW={600} mx='auto'>
        <Input
          placeholder="Type a message..."
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') handleSend()
          }}
        />
        <IconButton
          onClick={handleSend}
          colorScheme="blue"
          aria-label="Send message"
        >
            <FiSend />
        </IconButton>
      </HStack>
    </Flex>
  )
}
