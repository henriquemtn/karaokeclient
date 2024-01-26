import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';
import { getMusicInfo } from '../api/getMusicInfo';

interface AddOnPlaylistParams {
  houseId: string;
  musicId: string;
  userId: string;
  displayName: string;
}

const addOnPlaylist = async ({ houseId, musicId, userId, displayName }: AddOnPlaylistParams) => {
  try {
    // Obtenha informações da música usando a função getMusicInfo
    const musicInfo = await getMusicInfo(musicId);

    if (!musicInfo) {
      console.error('getMusicInfo retornou um valor indefinido ou nulo.');
      return;
    }

    const houseRef = doc(firestore, 'houses', houseId);
    const houseDoc = await getDoc(houseRef);

    if (houseDoc.exists()) {
      const houseData = houseDoc.data();

      if (!houseData) {
        console.error('Dados da casa estão indefinidos.');
        return;
      }

      const isMusicInPlaylist = houseData.playlist.some((item: any) => item.musicId === musicId && item.userId === userId);

      if (isMusicInPlaylist) {
        console.error('O usuário já adicionou esta música à playlist.');
        return;
      }

      const isUserInPlaylist = houseData.playlist.some((item: any) => item.userId === userId);

      if (isUserInPlaylist) {
        console.error('O usuário já adicionou uma música à playlist e não pode adicionar outra.');
        return;
      }

      const updatedPlaylist = [
        ...houseData.playlist,
        {
          musicId,
          userId,
          musicInfo: {
            ...musicInfo,
            musicName: musicInfo.title,
          },
          displayName,
        },
      ];

      await updateDoc(houseRef, { playlist: updatedPlaylist });

      console.log('Música adicionada à playlist da casa com sucesso!');
    } else {
      console.error('Casa não encontrada:', houseId);
    }
  } catch (error) {
    console.error('Erro ao adicionar música à playlist da casa:', error);
    throw error;
  }
};

export default addOnPlaylist;