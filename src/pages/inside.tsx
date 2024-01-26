import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTransition, animated } from '@react-spring/web';

import { getAuth, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';

import Button from '../components/Button';
import Music from '../components/inside/Music';
import OtherSong from '../components/inside/OtherSong';
import NextSong from '../components/karaoke/NextSong';
import addOnPlaylist from '../api/addOnPlaylist';
import { getUserInfo } from '../api/getUserInfo';
import toast from 'react-hot-toast';

interface PlaylistItem {
    displayName: string;
    musicInfo: any;
    musicId: string;
    musicName: string;
    userId: string;
}


export default function Inside() {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [musics, setMusics] = useState<any[]>([]);
    const { houseId } = useParams<{ houseId: string | undefined }>();
    const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                if (houseId) {
                    const houseDocRef = doc(firestore, 'houses', houseId);
                    const houseDocSnap = await getDoc(houseDocRef);

                    if (houseDocSnap.exists()) {
                        const houseData = houseDocSnap.data();
                        if (houseData?.playlist) {
                            console.log('Playlist encontrada:', houseData.playlist);
                            setPlaylist(houseData.playlist);
                        } else {
                            console.error('Array de playlist não encontrada no documento da casa.');
                        }
                    } else {
                        console.error('Documento da casa não encontrado.');
                    }
                }
            } catch (error) {
                console.error('Erro ao buscar a array de playlist:', error);
            }
        };

        fetchPlaylist();
    }, [houseId]);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (userAuth) => {
            setUser(userAuth);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchMusics = async () => {
            try {
                // Referência para a coleção "musics"
                const musicCollection = collection(firestore, 'musics');
                const snapshot = await getDocs(musicCollection);

                // Mapeando os documentos e adicionando ao estado
                const musicData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setMusics(musicData);
            } catch (error) {
                console.error('Erro ao buscar músicas:', error);
            }
        };

        fetchMusics();
    }, []);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const transition = useTransition(isDropdownOpen, {
        from: { x: 0, y: 100, opacity: 0 },
        enter: { x: 0, y: 0, opacity: 1 },
        leave: { x: 0, y: 100, opacity: 0 },
    });

    const handleAddToPlaylist = async (musicId: string, musicName: string) => {
        console.log('handleAddToPlaylist chamado com:', musicId, musicName);
        if (user && user.uid && houseId) {
            try {
                // Obtenha informações adicionais do usuário, incluindo o nome
                const userInfo = await getUserInfo(user.uid);

                if (userInfo && userInfo.displayName) {
                    // Verifique se a música já está na playlist
                    const isMusicInPlaylist = playlist.some(item => item.musicId === musicId);

                    if (isMusicInPlaylist) {
                        toast('A música já está na playlist.', {
                            icon: '✋',
                        });
                    } else {
                        // Se o nome do usuário estiver disponível e a música não estiver na playlist, chame addOnPlaylist
                        addOnPlaylist({
                            houseId,
                            musicId,
                            userId: user.uid,
                            displayName: userInfo.displayName,
                        });

                        console.log('Música adicionada com sucesso!');
                        toast.success('Música adicionada com sucesso!');
                        setTimeout(() => {
                            window.location.reload();
                        }, 2000); // Espera 2 segundos antes de recarregar a página

                    }
                } else {
                    console.error('Nome do usuário não encontrado.');
                    toast.error('Nome do usuário não encontrado.');
                }
            } catch (error) {
                console.error('Erro ao adicionar música à playlist:', error);
                toast.error('Erro ao adicionar música à playlist.');
            }
        }
    };


    const handleLogout = () => {
        navigate("/")
    }


    return (
        <>
            <div className='p-4 flex flex-col min-h-screen bg-[#111118]'>
                <div className='flex justify-between w-full py-4 text-white font-medium'>
                    <h1>Olá, {user?.displayName || ""}👋</h1>
                    <div onClick={handleLogout}>
                        <h1>Sair</h1>
                    </div>
                </div>
                {playlist.length > 0 ? (
                    playlist.map((item, index) => {
                        if (index === 0) {
                            // Primeira música na playlist
                            return (
                                <NextSong
                                    key={index}
                                    music={item.musicInfo.title}
                                    artist={item.musicInfo.artist}
                                    usuario={`${item.displayName} está cantando`}
                                />
                            );
                        } else {
                            // Outras músicas na playlist
                            return (
                                <OtherSong
                                    key={index}
                                    music={item.musicInfo.title}
                                    artist={item.musicInfo.artist}
                                    usuario={item.displayName}
                                />
                            );
                        }
                    })
                ) : (
                    <div className='text-white font-medium'>Nenhuma música na playlist!</div>
                )}





                <div className='flex fixed bottom-0 left-0 p-4 w-full'>
                    <Button
                        outline
                        color='roxo'
                        label='Adicionar Música'
                        onClick={toggleDropdown}
                    />
                </div>
                {/* ... */}
                {isDropdownOpen &&
                    transition((style, item) =>
                        item && (
                            <animated.div
                                style={style}
                                className="fixed top-0 left-0 w-full h-full flex flex-col bg-[#111118] rounded shadow-lg z-10"
                            >
                                <div className='flex items-end justify-end w-full px-8 py-2'>
                                    <div className='' onClick={toggleDropdown}>
                                        <h1 className='text-white font-medium'>x</h1>
                                    </div>
                                </div>
                                <div className="px-8 pt-4">
                                    <div className="flex gap-4 flex-col justify-center items-center text-white">
                                        <div className="flex flex-row justify-around w-full font-bold">
                                            <h1>BUSCAR MÚSICA</h1>
                                            <h1 className="text-[#424262]">PLAYLISTS</h1>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Digite o nome da música, artista.."
                                            className="w-full h-[34px] p-3 text-white bg-[#424262] rounded-md"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                        />
                                    </div>
                                    <div className="pt-4">
                                        {musics
                                            .filter((music) =>
                                                music.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                music.artist.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                music.album.toLowerCase().includes(searchTerm.toLowerCase())
                                            )
                                            .map((music) => (
                                                <Music
                                                    key={music.id}
                                                    title={music.title}
                                                    artist={music.artist}
                                                    onAdd={() => handleAddToPlaylist(music.id, music.title)}
                                                />
                                            ))}
                                        {musics.length === 0 && (
                                            <div className='text-white font-medium'>
                                                Nenhuma música encontrada!
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </animated.div>
                        )
                    )
                }
            </div>
        </>
    )
}