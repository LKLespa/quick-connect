import React, { createContext, useContext, useEffect, useState } from "react";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
} from "firebase/auth";
import {
    doc,
    setDoc,
    onSnapshot,
    collection,
    getDoc,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";
import { toaster } from "../components/ui/toaster"
import { auth, db } from "../firebase/config"; // your firebase config file
import { uploadFile } from "../firebase/functions";
import { v4 as uuidv4 } from 'uuid';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// TODO: Handle Offline
export const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const authInstance = getAuth();
    const isAuthenticated = !!authInstance.currentUser;

    useEffect(() => {
        setLoading(true)
        let unsubUser = null;

        const unsubscribe = onAuthStateChanged(authInstance, (user) => {
            if (user) {
                const userRef = doc(db, "users", user.uid);

                unsubUser = onSnapshot(userRef, (docSnap) => {
                    if (docSnap.exists()) {
                        setUserData({ id: user.uid, ...docSnap.data() });
                    }
                });
            } else {
                setUserData(null);
            }
            setLoading(false);

        // if user has technician Id and role is technician but doesn't have technician data, navigate to technician setup
            
        console.log('Authenticated', isAuthenticated)
        console.log('UserData', userData)
        });

        return () => {
            unsubscribe(); // stop listening to auth changes
            if (unsubUser) unsubUser(); // stop listening to user doc changes
        };
    }, [authInstance]);

    const signUp = async ({
        email,
        password,
        fullName,
        phoneNumber,
        role,
        photo,
        onDone,
    }) => {
        setLoading(true);
        setError(null);
        // console.log("Values", fullName, password, email, phoneNumber, role, onDone)

        console.log('File', photo)

        const register = async () => {
            try {
                let photoUrl = '';
                let clientId = null;
                let technicianId = null;

                const { user } = await createUserWithEmailAndPassword(
                    authInstance,
                    email,
                    password
                );

                if (photo) {
                    photoUrl = await uploadFile(photo, `profilePictures/${user.uid}.jpg`)
                }

                if (role == 'client') {
                    clientId = uuidv4()
                } else {
                    technicianId = uuidv4()
                }

                const userRef = doc(db, "users", user.uid);
                await setDoc(userRef, {
                    email,
                    fullName,
                    phoneNumber,
                    role,
                    dateCreated: serverTimestamp(),
                    photoUrl,
                    clientId,
                    technicianId,
                });

                setUserData({
                    id: user.uid,
                    email,
                    fullName,
                    phoneNumber,
                    role,
                    photoUrl,
                    clientId,
                    technicianId,
                });

                onDone && onDone();
            } catch (err) {
                setError(err.message);
                throw err;
            } finally {
                setLoading(false);
            }
        }

        toaster.promise(register(), {
            success: {
                title: 'Successfully Registered!'
            },
            error: {
                title: "Registeration Failed!",
                description: "Something went wrong. Try again.",
            },
            loading: {
                title: "Registering...", description: "Please wait"
            }
        })
    };

   const setupTechnician = async ({
    services,
    location,  // { latitude, longitude }
    region,
    city,
    localAddress,
    mainService,
    experienceYears = 0,
    availability = true,
    onDone,
}) => {
    if (!userData?.id) return;

    setLoading(true);
    setError(null);
    console.log('DATA', services,
    location,  // { latitude, longitude }
    region,
    city,
    localAddress,
    mainService,
    experienceYears,
    availability = true,
    onDone,)

    try {
        const userRef = doc(db, "users", userData.id);

        await updateDoc(userRef, {
            technicianProfile: {
                region,
                city,
                localAddress,
                mainService,
                services,             
                location,             
                experienceYears,
                availability,
                updatedAt: serverTimestamp(),
            }
        });

        toaster.create({ title: "Technician Profile Updated", type: "success", duration: 3000 });
        onDone && onDone();
    } catch (error) {
        console.error("❌ Technician profile update failed:", error);
        toaster.create({ title: "Update Failed", type: "error", description: error.message });
    } finally {
        setLoading(false);
    }
};

    const signIn = async ({ email, password, onDone }) => {
        setLoading(true);
        setError(null);

        const login = async () => {
            try {
                const { user } = await signInWithEmailAndPassword(authInstance, email, password);
                const userRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userRef);

                if (userDoc.exists()) {
                    setUserData({ id: user.uid, ...userDoc.data() });
                } else {
                    setUserData(null);
                }
                onDone && onDone();
            } catch (err) {
                setError(err.message);
                throw err;
            } finally {
                setLoading(false);
            }
        }

        toaster.promise(login(), {
            success: {
                title: 'Successfully Logged In!'
            },
            error: {
                title: "Log In Failed!",
                description: error,
            },
            loading: {
                title: "Signing in...", description: "Please wait"
            }
        })
    };

    const signOut = async () => {
        setLoading(true);
        setError(null);

        const logOut = async () => {
            try {
                await firebaseSignOut(authInstance);
                setUserData(null);
            } catch (error) {
                setError(error.message);
                throw error;
            } finally {
                setLoading(false);
            }
        }

        toaster.promise(logOut(), {
            success: {
                title: 'Successfully Logged Out!'
            },
            error: {
                title: "Log Out Failed!",
                description: "Something went wrong. Try again.",
            },
            loading: {
                title: "Logging out...", description: "Please wait"
            }
        })
    };

    return (
        <AuthContext.Provider
            value={{
                userData,
                loading,
                error,
                isAuthenticated,
                signUp,
                signIn,
                signOut,
                setupTechnician,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
