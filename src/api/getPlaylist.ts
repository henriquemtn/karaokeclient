import { collection, getDocs, query } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';

interface PlaylistItem {
    musicId: string;
    musicName: string;
    userId: string;
}

export const getPlaylist = async (houseId: string): Promise<PlaylistItem[]> => {
    const playlistCollection = collection(firestore, 'houses', houseId, 'playlist');

    const playlistQuery = query(playlistCollection);
    const playlistSnapshot = await getDocs(playlistQuery);

    const playlistData: PlaylistItem[] = playlistSnapshot.docs.map((doc) => doc.data() as PlaylistItem);

    return playlistData;
};