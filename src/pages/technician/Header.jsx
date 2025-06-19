import {
    Avatar,
    Box,
    Button,
    CloseButton,
    Drawer,
    Flex,
    HStack,
    IconButton,
    Portal,
    Text,
    VStack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router';
import Logo from '../../components/widgets/Logo';
import { routeLinks } from '../../routes';
import { useAuth } from '../../providers/AuthProvider';
import { BiHistory, BiHome, BiMenu, BiMessage, BiUser } from 'react-icons/bi';
import { ColorModeButton } from '../../components/ui/color-mode';
import { FiSettings } from 'react-icons/fi';

export default function TechnicianHeader() {
    const { userData, userLocation, setUserLocation, loading } = useAuth();
    const [openDrawer, setOpenDrawer] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading) {
            if (!userData?.technicianId) {
                navigate(routeLinks.clientHome); // If not a technician, fallback to client home
            }

            if (userData?.technicianId && !userData?.technicianProfile) {
                navigate("/setup");
            }
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const coords = pos.coords;
                setUserLocation(userData?.location ?? { latitude: coords.latitude, longitude: coords.longitude });
            },
            () => alert("Error getting location"),
            { enableHighAccuracy: true }
        );
    }, []);

    return (
        <VStack>
            <Flex h={16} alignItems="center" justifyContent="space-between" w="full" px={4} py={3} shadow="sm" position="sticky" top={0} zIndex="1000" bg="background">
                <HStack>
                    <Logo />
                    <Text fontWeight="bold" fontSize="xl" color="brand.700">QuickConnect</Text>
                </HStack>

                <Box display={{ base: 'none', lg: 'flex' }}>
                    <NavLinks />
                </Box>

                <SideDrawer open={openDrawer} setOpen={setOpenDrawer} userData={userData} />

                <HStack>
                    <ColorModeButton />
                    <Avatar.Root as={Link} to={routeLinks.techProfile} display={{ base: 'none', lg: 'flex' }}>
                        <Avatar.Fallback name={userData?.fullName} />
                        <Avatar.Image src={userData?.photoUrl} />
                    </Avatar.Root>
                </HStack>

                <IconButton size="md" aria-label="Open Menu" display={{ base: 'flex', lg: 'none' }} onClick={() => setOpenDrawer(true)}>
                    <BiMenu />
                </IconButton>
            </Flex>

            <Flex w="full" h="calc(100vh - 90px)" justifyContent="center" overflow="auto">
                <Outlet />
            </Flex>
        </VStack>
    );
}

const NavLinks = ({ userData }) => {
    const navLinks = [
        { label: "Dashboard", href: routeLinks.techHome, icon: <BiHome /> },
        { label: "Requests", href: routeLinks.techRequest, icon: <BiHistory /> },
        { label: "My Jobs", href: routeLinks.techJobs, icon: <FiSettings />},
        { label: "Clients", href: routeLinks.clients, icon: <BiUser /> },
        { label: "Chats", href: routeLinks.techChats, icon: <BiMessage /> },
    ];

    return (
        <Flex justifyContent="center" alignItems="center" flexDirection={{ base: 'column', lg: 'row' }} height="full">
            <Avatar.Root size="xl" display={{ base: 'flex', lg: 'none' }}>
                <Avatar.Fallback name={userData?.fullName} />
                <Avatar.Image src={userData?.photoUrl} />
            </Avatar.Root>

            {navLinks.map(link => (
                <Button
                    key={link.label}
                    variant="ghost"
                    colorScheme="teal"
                    as={Link}
                    to={link.href}
                    size="lg"
                >
                    {link.icon}
                    {link.label}
                </Button>
            ))}
        </Flex>
    );
};

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
};
