import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase";
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, getAuth } from 'firebase/auth';

export default function Checkin() {
    const [customerName, setCustomerName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const user = auth.currentUser;


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                // Se o usuário já estiver autenticado, redirecione para a tela principal
                navigate("/checkin/u40yZ6xuSrt7tkEa4MWU");
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const karaokeCheckin = () => {
        navigate("/inside/u40yZ6xuSrt7tkEa4MWU");
    }

    const handleGoogleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);

            const user = result.user;
            console.log("Google login successful:", user);
        } catch (error) {
            console.error("Error with Google login:");
        }
    };

    // New function to handle email/password login
    const handleEmailPasswordLogin = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log('Email/password login successful');
        } catch (error) {
            console.error('Error with email/password login:', error);
        }
    };

    const handleSignOut = async () => {
        try {
            const auth = getAuth();
            await auth.signOut();
            navigate('/login');
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
    };

    if (user) {
        return (
            <div id="login-popup"
                className="bg-black/50 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 h-full items-center justify-center flex">
                <div className="relative p-4 w-full max-w-md h-full md:h-auto">
                    <div className="relative bg-white rounded-lg shadow">

                        <div className="p-5">
                            <h3 className="text-2xl mb-0.5 font-medium"></h3>
                            <p className="mb-4 text-sm font-normal text-gray-800"></p>

                            <div className="text-center">
                                <p className="mb-6 text-2xl font-semibold leading-5 text-slate-900">
                                    Nome do Karaoke
                                </p>
                                <div className='flex justify-center items-center gap-2'>
                                    <img src={user?.photoURL || "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg"} alt="Avatar" className='h-10 w-10 rounded-full' />
                                    <h1 className="text-black">{user?.displayName || 'Usuário'}</h1>
                                </div>
                            </div>

                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    karaokeCheckin();
                                }}
                            >
                                <br />
                                <button className="inline-flex w-full items-center justify-center rounded-lg bg-black p-2 py-3 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 disabled:bg-gray-400"
                                    type="submit">Fazer Checkin</button>
                            </form>

                            <div className="mt-6 text-center text-sm text-slate-600">
                                Não é você?
                                <a onClick={handleSignOut} className="pl-1 font-medium text-[#4285f4]">Trocar de conta</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <>
            <div id="login-popup"
                className="bg-black/50 overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 h-full items-center justify-center flex">
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
                                    Checkin: NomeDoKaraoke
                                </p>
                                <p className="mt-2 text-sm leading-4 text-slate-600">
                                    You must be logged in to perform this action.
                                </p>
                            </div>

                            <div className="mt-7 flex flex-col gap-2">

                                <button
                                    onClick={handleGoogleLogin}
                                    className="inline-flex h-10 w-full items-center justify-center gap-2 rounded border border-slate-300 bg-white p-2 text-sm font-medium text-black outline-none focus:ring-2 focus:ring-[#333] focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60"><img
                                        src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google"
                                        className="h-[18px] w-[18px] " />Continue with
                                    Google
                                </button>
                            </div>

                            <div className="flex w-full items-center gap-2 py-6 text-sm text-slate-600">
                                <div className="h-px w-full bg-slate-200"></div>
                                OR
                                <div className="h-px w-full bg-slate-200"></div>
                            </div>

                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleEmailPasswordLogin(email, password);
                                }}
                            >
                                <label>
                                    Nome:
                                    <input
                                        type="text"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        required
                                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-black focus:ring-offset-1"
                                    />
                                </label>
                                <br />
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
                                    type="submit">Login with Email/Password</button>
                            </form>

                            <div className="mt-6 text-center text-sm text-slate-600">
                                Don't have an account?
                                <a href="/signup" className="font-medium text-[#4285f4]">Sign up</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

