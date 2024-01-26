import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import Playlist from '../components/Playlist';

export default function Home() {
    const navigate = useNavigate();
    const [user, setUser] = useState<FirebaseUser | null>(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (userAuth) => {
            console.log('onAuthStateChanged:', userAuth);
            setUser(userAuth);
        });
    
        return () => {
            console.log('Unsubscribed from onAuthStateChanged');
            unsubscribe();
        };
    }, []);

    const handleSignOut = async () => {
        try {
            const auth = getAuth();
            await auth.signOut();
            navigate('/login');
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
    };
    
    return (
        <div className="flex flex-col md:justify-between min-h-screen p-4 gap-4 bg-[#333]">
            <div className="w-full h-[100px] bg-purple-700 flex items-center px-4 shadow-md justify-between">
                <div className='flex items-center gap-2'>
                    <img src={user?.photoURL || "https://t4.ftcdn.net/jpg/05/49/98/39/360_F_549983970_bRCkYfk0P6PP5fKbMhZMIb07mCJ6esXL.jpg"} alt="Avatar" className='h-16 w-16 rounded-full' />
                    <h1 className="text-white">{user?.displayName || 'Usuário'}</h1>
                </div>
                <p className="font-medium text-white" onClick={handleSignOut} style={{ cursor: 'pointer' }}>
                    Logout
                </p>
            </div>

            <div className="w-full h-[400px] bg-purple-700 shadow-md p-4">
                <Playlist />
            </div>
        </div>
    );
}
