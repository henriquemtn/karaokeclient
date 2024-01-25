import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase/firebase';

export const endOfMusic = async (houseId: string) => {
    try {
        const playlistRef = doc(firestore, 'houses', houseId);
        
        // Obtém o documento atual da playlist
        const playlistDoc = await getDoc(playlistRef);
        const currentPlaylist = playlistDoc.data()?.playlist || [];

        // Verifica se há algum item na playlist
        if (currentPlaylist.length > 0) {
            // Obtém o primeiro item da playlist
            const firstItem = currentPlaylist[0];

            // Remove o primeiro item da playlist
            const updatedPlaylist = currentPlaylist.slice(1);

            // Atualiza o documento no Firestore
            await updateDoc(playlistRef, {
                playlist: updatedPlaylist,
            });

            console.log('Primeiro item removido com sucesso do Firebase:', firstItem);
        } else {
            console.log('Não há itens para remover na playlist.');
        }
    } catch (error) {
        console.error('Erro ao remover o primeiro item do Firebase:', error);
    }
};
