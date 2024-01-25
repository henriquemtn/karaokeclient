import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';

interface MusicInfo {
  link: string;
  artist: string;
  album: string;
  title: string;
}

export const getMusicInfo = async (musicId: string): Promise<MusicInfo | null> => {
    try {
    const musicDocRef = doc(firestore, 'musics', musicId);
    const musicDocSnapshot = await getDoc(musicDocRef);
    console.log('musicId:', musicId);

    if (musicDocSnapshot.exists()) {
      const musicInfo = musicDocSnapshot.data() as MusicInfo;
      return musicInfo;
      
    } else {
      console.error('Música não encontrada');
      return null;
    }
  } catch (error) {
    console.error('Erro ao buscar informações da música:', error);
    return null;
  }
};
