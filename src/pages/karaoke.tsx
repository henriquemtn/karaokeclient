import { useState, useEffect } from "react";
import YouTube from "react-youtube";
import NextSong from "../components/karaoke/NextSong";
import BelowKaraoke from "../components/karaoke/BelowKaraoke";
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from "../firebase/firebase";
import { useParams } from "react-router-dom";
import { endOfMusic } from "../api/endOfMusic";

interface PlaylistItem {
    displayName: string;
    musicInfo: any;
    musicId: string;
    musicName: string;
    userId: string;
    link: string;
}

export default function Karaoke() {
    const { houseId } = useParams<{ houseId: string }>();
    const [currentVideoIndex] = useState(0);
    const [playlist, setPlaylist] = useState<PlaylistItem[]>([]);

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


    console.log('Playlist:', playlist);


    const opts = {
        height: '900px',
        width: '100%',
        playerVars: {
            autoplay: 1,
        },
    };

    const onEnd = () => {
        if (houseId) {
            endOfMusic(houseId);
        } else {
            console.error('houseId está indefinido.');
        }
        // Recarrega a página após o término da música
        setTimeout(() => {
            window.location.reload();
        }, 2000); // Espera 2 segundos antes de recarregar a página
    };

    const currentVideoId = playlist.length > 0 ? playlist[currentVideoIndex]?.musicInfo.link || "" : "";

    console.log(currentVideoId)

    return (
        <div className="bg-[#111118] min-h-screen text-white">
            <div className="flex flex-col justify-center">
                <YouTube videoId={currentVideoId} opts={opts} onEnd={onEnd} />
            </div>
            <div className="flex gap-5 p-2">
                {playlist.length > 0 ? (
                    <>
                        <div className="w-1/4">
                            <NextSong
                                music={playlist[0]?.musicInfo.name}
                                artist={playlist[0]?.musicInfo.artist}
                                usuario={`${playlist[0]?.displayName} está cantando`}
                            />
                        </div>
                        {playlist.slice(1).map((item, index) => (
                            <div className="w-1/4" key={index}>
                                <BelowKaraoke
                                    music={item?.musicInfo.name}
                                    artist={item?.musicInfo.artist}
                                    usuario={item?.displayName}
                                />
                            </div>
                        ))}
                    </>
                ) : (
                    <div className='text-white font-medium'>Nenhuma música ainda na lista!</div>
                )}
            </div>
        </div>
    );
}