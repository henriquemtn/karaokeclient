import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, firestore } from '../firebase/firebase';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, DocumentData } from 'firebase/firestore';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                // Se o usuário já estiver autenticado, redirecione para a tela principal
                navigate('/');
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleGoogleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
    
            const user = result.user;
            console.log('Google login successful:', user);
    
            // Use UID as the document name
            const userDocRef = doc(firestore, 'users', user.uid);
    
            // Check if the user is new based on metadata
            const isNewUser =
                user.metadata.creationTime === user.metadata.lastSignInTime;
    
            if (isNewUser) {
                // If the user is new, add the user data to the "users" collection
                const userData = {
                    displayName: user.displayName,
                    email: user.email,
                    // Add other relevant user data
                };
    
                await setDoc(userDocRef, userData);
            }
        } catch (error) {
            console.error('Error with Google login:', error);
        }
    };
    



    const handleEmailPasswordRegister = async (e: any) => {
        e.preventDefault();

        try {
            // Criação do usuário com e-mail e senha
            const result = await createUserWithEmailAndPassword(auth, email, password);

            // Atualização do displayName
            await updateProfile(result.user, { displayName });

            // Criação de um documento associado ao usuário no Firestore
            const userDocRef = doc(firestore, 'users', result.user.uid);
            const userData: DocumentData = {
                displayName,
                email,
                uid: result.user.uid,
            };
            await setDoc(userDocRef, userData);

            // Redirecionamento para a página principal após o cadastro
            navigate('/');
        } catch (error) {
            // Verifique se 'error' é do tipo Error antes de acessar suas propriedades
            if (error instanceof Error) {
                console.error('Erro ao criar usuário:', error.message);
            } else {
                console.error('Erro desconhecido ao criar usuário:', error);
            }
        }
    };


    return (
        <>
            {/* Seu formulário de registro aqui */}
            <form
                onSubmit={handleEmailPasswordRegister}
            >
                <label>
                    Nome:
                    <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Registrar</button>
            </form>

            {/* Botão para login com o Google */}
            <button onClick={handleGoogleLogin}>Login com Google</button>

            {/* Link para página de login */}
            <div>
                Já tem uma conta? <a href="/login">Faça login</a>
            </div>
        </>
    );
}
