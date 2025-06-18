import { Avatar, Box, Button, CloseButton, Drawer, Flex, HStack, IconButton, Portal, Text, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router'
import Logo from '../../components/widgets/Logo'
import { routeLinks } from '../../routes'
import { useAuth } from '../../providers/AuthProvider'
import { BiHistory, BiHome, BiMenu, BiMessage, BiUser } from 'react-icons/bi'
import { ColorModeButton } from '../../components/ui/color-mode'

export default function ClientHeader() {

    const { userData, userLocation, setUserLocation, loading } = useAuth()

    const [openDrawer, setOpenDrawer] = useState(false)
    const navigate = useNavigate();

    useEffect(() => {

        if(!loading && !userData?.clientId){
            navigate(routeLinks.techHome)
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const coords = pos.coords;
                setUserLocation({ latitude: coords.latitude, longitude: coords.longitude });
            },
            (err) => alert("Error getting location"),
            { enableHighAccuracy: true }
        )

        console.log('Location', userLocation)
    }, [])

    return (
        <VStack>
            <Flex h={16} alignItems='center' justifyContent='space-between' w='full' px={4} py={3} shadow='sm' position='sticky' top={0} zIndex='1000' bg='background'>
                <HStack>
                    <Logo />
                    <Text fontWeight='bold' fontSize='xl' color='brand.700'>QuickConnect</Text>
                </HStack>

                <Box display={{ base: 'none', lg: 'flex' }}>
                    <NavLinks />
                </Box>

                <SideDrawer open={openDrawer} setOpen={setOpenDrawer} userData={userData} />

                <HStack>
                    <ColorModeButton />
                    <Avatar.Root as={Link} to={routeLinks.clientProfile} display={{ base: 'none', lg: 'flex' }}>
                        <Avatar.Fallback name={userData?.fullName} />
                        <Avatar.Image src={userData?.photoUrl} />
                    </Avatar.Root>
                </HStack>

                <IconButton size='md' aria-label='Open Menu' display={{ base: 'flex', lg: 'none' }} onClick={() => setOpenDrawer(true)}>
                    <BiMenu />
                </IconButton>
            </Flex>
            <Flex w='full' h='calc(100vh - 90px)' justifyContent='center' overflow='auto'>
                <Outlet />
            </Flex>
        </VStack>
    )
}


const NavLinks = ({ userData }) => {
    const navLinks = [
        { label: "Dashboard", href: routeLinks.clientHome, icon: <BiHome /> },
        { label: "Requests", href: routeLinks.clientRequest, icon: <BiHistory /> },
        { label: "Technicians", href: routeLinks.technicians, icon: <BiUser /> },
        { label: "Chats", href: routeLinks.clientChats, icon: <BiMessage /> },
    ]

    return (
        <Flex justifyContent='center' alignItems='center' flexDirection={{ base: 'column', lg: 'row' }} height='full'>
            <Avatar.Root size='xl' display={{ base: 'flex', lg: 'none' }}>
                <Avatar.Fallback name={userData?.fullName} />
                <Avatar.Image src={userData?.photoUrl} />
            </Avatar.Root>
            {navLinks.map(link => (
                <Button
                    key={link.label}
                    variant='ghost'
                    colorScheme='teal'
                    as={Link}
                    to={link.href}
                    size='lg'
                >
                    {link.icon}
                    {link.label}
                </Button>
            ))}
        </Flex>
    )
}

const SideDrawer = ({ open, setOpen, userData }) => {
    return (
        <Drawer.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content>
                        <Drawer.Body>
                            <NavLinks userData={userData} />
                        </Drawer.Body>
                    </Drawer.Content>
                    <Drawer.CloseTrigger asChild>
                        <CloseButton size="sm" />
                    </Drawer.CloseTrigger>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    );
}