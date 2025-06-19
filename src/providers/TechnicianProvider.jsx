// src/providers/TechnicianProvider.jsx

import { createContext, useContext, useEffect, useState } from 'react'
import { addDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useDebounce } from '../hooks/useDebounce'
import { useAuth } from './AuthProvider'
import { getDistance } from 'geolib'
import { toaster } from '../components/ui/toaster'

const TechnicianContext = createContext()

export const useTechnicians = () => useContext(TechnicianContext)

export const TechnicianProvider = ({ children }) => {
    const {userLocation, setUserLocation, userData} = useAuth();
    const role = 'technician';

    const [technicians, setTechnicians] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState('')
    const [nearbySearch, setNearbySearch] = useState(false);
    const [searchRadius, setSearchRadius] = useState(1);
    const debouncedSearch = useDebounce(search, 300)

    useEffect(() => {
        const fetchTechnicians = async () => {
            setLoading(true)
            try {
                const usersRef = collection(db, 'users')
                const snapshot = await getDocs(usersRef)
                const techs = snapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(user => !!user.technicianId && user.technicianProfile)
                setTechnicians(techs)
            } catch (err) {
                console.error('Error fetching technicians:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchTechnicians()
    }, [])

    const filteredTechnicians = technicians.filter(tech => {
        const query = debouncedSearch.toLowerCase();
        const profile = tech.technicianProfile || {};

        const isNotUser = userData?.id != (tech?.id ?? '');
        const nameMatch = tech.fullName?.toLowerCase().includes(query);
        const mainServiceMatch = profile.mainService?.toLowerCase().includes(query);
        const otherServicesMatch = (profile.services || []).some(service =>
            service.toLowerCase().includes(query)
        );
        const regionMatch = profile.region?.toLowerCase().includes(query);
        const cityMatch = profile.city?.toLowerCase().includes(query);
        const addressMatch = profile.localAddress?.toLowerCase().includes(query);

        const searchMatch =
            nameMatch ||
            mainServiceMatch ||
            otherServicesMatch ||
            regionMatch ||
            cityMatch ||
            addressMatch;

        const serviceFilterMatch = filter ? profile.mainService === filter : true;

        if (nearbySearch && userLocation && profile.location) {
            console.log('UserLocation', userLocation);
            console.log('Profile Location', profile.location);
            console.log('Distance', getDistance(userLocation, profile.location))

            return getDistance(userLocation, profile.location) <= (searchRadius * 1000) && searchMatch && serviceFilterMatch && isNotUser;
        }

        return isNotUser && searchMatch && serviceFilterMatch;
    });

    const sendServiceRequest = async ({
  technicianId,
  technicianName,
  technicianPhotoUrl,
  description,
  emmergency,
  scheduledDate = null,
}) => {
  if (!userData) {
    toaster({
      title: 'Not logged in',
      description: 'You need to be logged in to send a request.',
      status: 'error',
      duration: 2000,
      isClosable: true,
    });
    return;
  }

  setLoading(true)

  try {
    const requestData = {
      clientId: userData.id,
      clientName: userData.fullName,
      clientPhotoUrl: userData.photoUrl ?? '',
      technicianId,
      technicianName,
      technicianPhotoUrl,
      description,
      emmergency,
      scheduledDate,
      status: 'pending',
      requestedAt: serverTimestamp(),
    };

    const requestRef = collection(db, 'requests');
    await addDoc(requestRef, requestData);

    toaster({
      title: 'Request sent',
      description: 'Your service request was sent successfully.',
      status: 'success',
      duration: 4000,
      isClosable: true,
    });
  } catch (error) {
    console.error('Failed to send request:', error);
    toaster({
      title: 'Error',
      description: 'Failed to send your request. Please try again later.',
      status: 'error',
      duration: 2000,
      isClosable: true,
    });
  } finally {
    setLoading(false)
  }
}


    return (
        <TechnicianContext.Provider
            value={{
                technicians,
                loading,
                search,
                setSearch,
                filter,
                setFilter,
                nearbySearch,
                setNearbySearch,
                searchRadius,
                setSearchRadius,
                filteredTechnicians,
                sendServiceRequest,
            }}
        >
            {children}
        </TechnicianContext.Provider>
    )
}
