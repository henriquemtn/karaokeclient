import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../firebase/firebase";
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                // Se o usuário já estiver autenticado, redirecione para a tela principal
                console.log("Usuário autenticado:", user);
                navigate("/");
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
                    uid: user.uid,
                };
    
                await setDoc(userDocRef, userData);
            }
        } catch (error) {
            console.error('Error with Google login:', error);
        }
    };
    const handleEmailPasswordLogin = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log('Email/password login successful');
            toast.success("Login feito com sucesso!")
    
            // Limpar os campos após o login bem-sucedido
            setEmail('');
            setPassword('');
        } catch (error) {
            console.error('Error with email/password login:', error);
            toast.error("Email ou senha incorretos!")
        }
    };

    return (
        <>
            <div id="login-popup"
                className="bg-[#333] overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 h-full items-center justify-center flex">
                <div className="relative p-4 w-full max-w-md h-full md:h-auto">

                    <div className="relative bg-white rounded-lg shadow">
                        <button type="button"
                            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center popup-close"><svg
                                aria-hidden="true" className="w-5 h-5" fill="#c6c7c7" viewBox="0 0 20 20"
                                xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd"
                                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                    clipRule="evenodd"></path>
                            </svg>
                            <span className="sr-only">Close popup</span>
                        </button>

                        <div className="p-5">
                            <h3 className="text-2xl mb-0.5 font-medium"></h3>
                            <p className="mb-4 text-sm font-normal text-gray-800"></p>

                            <div className="text-center">
                                <p className="mb-3 text-2xl font-semibold leading-5 text-slate-900">
                                    Entre em sua conta
                                </p>
                                <p className="mt-2 text-sm leading-4 text-slate-600">
                                    Você precisa de uma conta para acessar a plataforma
                                </p>
                            </div>

                            <div className="mt-7 flex flex-col gap-2">

                                <button
                                    onClick={handleGoogleLogin}
                                    className="inline-flex h-10 w-full items-center justify-center gap-2 rounded border border-slate-300 bg-white p-2 text-sm font-medium text-black outline-none focus:ring-2 focus:ring-[#333] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"><img
                                        src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google"
                                        className="h-[18px] w-[18px] " />Continue com o
                                    Google
                                </button>
                            </div>

                            <div className="flex w-full items-center gap-2 py-6 text-sm text-slate-600">
                                <div className="h-px w-full bg-slate-200"></div>
                                OU
                                <div className="h-px w-full bg-slate-200"></div>
                            </div>

                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleEmailPasswordLogin(email, password);
                                }}
                            >
                                <label>
                                    Email:
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
                                    />
                                </label>
                                <br />
                                <label>
                                    Password:
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
                                    />
                                </label>
                                <br />
                                <button className="inline-flex w-full items-center justify-center rounded-lg bg-black p-2 py-3 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 disabled:bg-gray-400"
                                 type="submit">Fazer Login</button>
                            </form>

                            <div className="mt-6 text-center text-sm text-slate-600">
                                Não possui uma conta?
                                <a href="/register" className="pl-1 font-medium text-[#4285f4]">Registrar-se</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
