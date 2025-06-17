// src/providers/TechnicianProvider.jsx

import { createContext, useContext, useEffect, useState } from 'react'
import { collection, getDocs, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useDebounce } from '../hooks/useDebounce'
import { useAuth } from './AuthProvider'
import { getDistance } from 'geolib'

const TechnicianContext = createContext()

export const useTechnicians = () => useContext(TechnicianContext)

export const TechnicianProvider = ({ children }) => {
    const {userLocation, setUserLocation} = useAuth();

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

            return getDistance(userLocation, profile.location) <= (searchRadius * 1000) && searchMatch && serviceFilterMatch
        }

        return searchMatch && serviceFilterMatch;
    });


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
            }}
        >
            {children}
        </TechnicianContext.Provider>
    )
}
