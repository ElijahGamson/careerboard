import { auth, googleProvider } from '../library/firebaseConfig';
import { signInWithPopup, signOut } from 'firebase/auth';
import { useState, useEffect } from 'react';
import styled from 'styled-components';

// const AuthButton = styled.button`
//     padding: 10px 20px;
//     border: none;
//     border-radius: 6px;
//     cursor: pointer;
//     font-size: 1rem;

//     &:hover {
//         background-color: #357abd;
//     }
// `;

export default function Auth() {
    // Stores the currently logged in user, null if not logged in
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Listen for auth state changes, fires when user logs in or out
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });

        // Cleanup the listener when component unmounts
        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        try {
            // Opens the Google sign in popup
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error('Error signing in:', error);
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    // If user is logged in show their name and sign out button
    if (user) {
        return (
            <div>
                <p style={{marginBottom: '10px'}}>Welcome, {user.displayName}!</p>
                <button onClick={handleSignOut}>Sign Out</button>
            </div>
        );
    }

    // If user is not logged in show sign in button
    return (
        <button onClick={signInWithGoogle}>
            Sign in with Google
        </button>
    );
}