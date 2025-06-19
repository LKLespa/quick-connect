// src/providers/ClientProvider.jsx

import { createContext, useContext, useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useDebounce } from '../hooks/useDebounce';
import { useAuth } from './AuthProvider';

const ClientContext = createContext();

export const useClients = () => useContext(ClientContext);

export const ClientProvider = ({ children }) => {
  const { userData } = useAuth();

  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const fetchClients = async () => {
      setLoading(true);
      try {
        const usersRef = collection(db, 'users');
        const snapshot = await getDocs(usersRef);
        const allUsers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const clientUsers = allUsers.filter(user => !!user.clientId);

        setClients(clientUsers);
      } catch (err) {
        console.error('Error fetching clients:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  const filteredClients = clients.filter(client => {
    const query = debouncedSearch.toLowerCase();

    const isNotUser = userData?.id != (client?.id ?? '');

    const nameMatch = client.fullName?.toLowerCase().includes(query);
    const emailMatch = client.email?.toLowerCase().includes(query);
    const phoneMatch = client.phoneNumber?.includes(query);

    return (nameMatch || emailMatch || phoneMatch);
  });

  return (
    <ClientContext.Provider
      value={{
        clients,
        loading,
        search,
        setSearch,
        filteredClients,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};
