import { auth, googleProvider } from '../library/firebaseConfig';
import { signInWithPopup, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useState, useEffect } from 'react';
import styled from 'styled-components';

const AuthButton = styled.button`
    background-color: #4285f4;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 1rem;
    width: 100%;
    margin-top: 10px;

    &:hover {
        background-color: #357abd;
    }
`;

const GoogleButton = styled(AuthButton)`
    background-color: #4285f4;
`;

const Input = styled.input`
    width: 100%;
    padding: 8px;
    margin-top: 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
`;

const AuthContainer = styled.div`
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    background: white;
    border-radius: 10px;
    box-shadow: 0px 2px 6px rgba(0,0,0,0.1);
    text-align: center;
`;

export default function Auth() {
    const [user, setUser] = useState(null);

    // Tracks whether user is signing up or logging in
    const [isSignUp, setIsSignUp] = useState(false);

    // Stores the email and password the user types
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Stores any error messages to display to the user
    const [error, setError] = useState('');

    useEffect(() => {
        // Listen for auth state changes
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            setError('Error signing in with Google');
        }
    };

    const handleEmailAuth = async () => {
        setError('');
        try {
            if (isSignUp) {
                // Create a new account
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                // Sign into existing account
                await signInWithEmailAndPassword(auth, email, password);
            }
        } catch (err) {
            // Firebase error messages are not very user friendly so we simplify them
            if (err.code === 'auth/email-already-in-use') setError('Email already in use!');
            else if (err.code === 'auth/wrong-password') setError('Incorrect password!');
            else if (err.code === 'auth/user-not-found') setError('No account found with that email!');
            else if (err.code === 'auth/weak-password') setError('Password must be at least 6 characters!');
            else setError('Something went wrong, please try again!');
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    // If user is logged in show their email and sign out button
    if (user) {
        return (
            <AuthContainer>
                <p>Welcome, {user.displayName || user.email}!</p>
                <AuthButton onClick={handleSignOut}>Sign Out</AuthButton>
            </AuthContainer>
        );
    }

    return (
        <AuthContainer>
            <h2>{isSignUp ? 'Create Account' : 'Sign In'}</h2>

            {/* Email and password inputs */}
            <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            {/* Show error message if something goes wrong */}
            {error && <p style={{color: 'red', marginTop: '10px'}}>{error}</p>}

            {/* Sign in or sign up button */}
            <AuthButton onClick={handleEmailAuth}>
                {isSignUp ? 'Create Account' : 'Sign In'}
            </AuthButton>

            {/* Google sign in button */}
            <GoogleButton onClick={signInWithGoogle}>
                Sign in with Google
            </GoogleButton>

            {/* Toggle between sign in and sign up */}
            <p style={{marginTop: '15px', cursor: 'pointer', color: '#4285f4'}}
                onClick={() => {
                    setIsSignUp(!isSignUp);
                    setError('');
                }}>
                {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </p>
        </AuthContainer>
    );
}